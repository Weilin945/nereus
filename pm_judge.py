# pm_judge.py
#用法：在終端機執行：python  pm_judge.py "想判定的已結束事件"
#ex. python  pm_judge.py "CMA Awards: Album of the Year"
# 具備：數學比對、選舉定義、比較搜尋、現狀判定、威脅 vs 事實區分、推理過程輸出、假新聞定義
import os, sys, json, time, re, requests
from datetime import datetime, timezone, timedelta
from rapidfuzz import process, fuzz
from dotenv import load_dotenv, find_dotenv


try:
    import google.generativeai as genai
    from google.generativeai.types import Tool, FunctionDeclaration, GenerationConfig
except ImportError:
    print("錯誤：缺少 'google-generativeai' 套件。請執行：pip install -U google-generativeai", file=sys.stderr)
    sys.exit(1)

# -------------------- env & constants --------------------
load_dotenv(find_dotenv(usecwd=True), override=True)

GAMMA = "https://gamma-api.polymarket.com"
SUBGRAPH = os.getenv("POLY_SUBGRAPH_URL")

def _sanitize_key(k: str | None) -> str | None:
    if not k: return None
    return "".join(ch for ch in k.strip() if ch not in ("\r", "\n", "\t"))

GEMINI_API_KEY = _sanitize_key(os.getenv("GEMINI_API_KEY"))
SERPER_API_KEY = _sanitize_key(os.getenv("SERPER_API_KEY")) 

UA = {"User-Agent": "pm_judge/1.0 (+https://polymarket.com)"}

# -------------------- helpers --------------------
def _is_future_cutoff(iso_str: str) -> bool:
    if not iso_str: return False
    try:
        s = iso_str.replace("Z", "+00:00")
        try: dt = datetime.fromisoformat(s)
        except ValueError: dt = datetime.fromisoformat(s + "T23:59:59+00:00")
        if dt.tzinfo is None: dt = dt.replace(tzinfo=timezone.utc)
        now = datetime.now(tz=dt.tzinfo)
        return dt > now
    except Exception: return False

def _domain(url: str) -> str:
    try: return re.sub(r"^https?://", "", url).split("/")[0].lower()
    except Exception: return ""

# -------------------- 1) 搜尋市場 --------------------
def search_markets_by_name(name, limit=20):
    params = {"q": name, "limit_per_type": max(1, int(limit)), "keep_closed_markets": 1, "search_tags": False, "search_profiles": False}
    r = requests.get(f"{GAMMA}/public-search", params=params, timeout=30, headers=UA)
    r.raise_for_status()
    js = r.json()
    cands = []
    for m in js.get("markets", []) or []:
        cands.append({"title": m.get("question") or m.get("title"), "slug": m.get("slug"), "conditionId": m.get("conditionId"), "eventSlug": m.get("event", {}).get("slug") if isinstance(m.get("event"), dict) else None})
    for e in js.get("events", []) or []:
        for m in (e.get("markets") or []):
            cands.append({"title": m.get("question") or m.get("title"), "slug": m.get("slug"), "conditionId": m.get("conditionId"), "eventSlug": e.get("slug")})
    titles = [c["title"] for c in cands if c.get("title")]
    if not titles: return None
    best, score, idx = process.extractOne(name, titles, scorer=fuzz.WRatio)
    return next((c for c in cands if c.get("title") == best), None)

#  2) 取市場細節 
def get_market_detail(slug=None, condition_id=None):
    params = {"limit": 50};
    if slug: params["slug"] = [slug]
    if condition_id: params["condition_ids"] = [condition_id]
    r = requests.get(f"{GAMMA}/markets", params=params, timeout=30, headers=UA)
    r.raise_for_status()
    data = r.json();
    return data[0] if data else None

# 3) 官方結果 
def graph_payout_numerators(condition_id):
    if not SUBGRAPH: return None
    q = "query($ids:[ID!]) { conditions(where:{id_in:$ids}) { id payoutNumerators } }"
    try:
        r = requests.post(SUBGRAPH, json={"query": q, "variables": {"ids": [condition_id]}}, timeout=60, headers=UA)
        r.raise_for_status()
        arr = (r.json().get("data") or {}).get("conditions") or []
        return arr[0]["payoutNumerators"] if arr else None
    except Exception: return None

def decode_official_winner(short_outcomes, payouts):
    if not short_outcomes or not isinstance(payouts, list): return None
    if isinstance(short_outcomes, str): outs = [s.strip().upper() for s in short_outcomes.split(",") if s.strip()]
    else: outs = [str(s).strip().upper() for s in (short_outcomes or []) if str(s).strip()]
    if len(outs) != len(payouts) or len(outs) != 2: return None
    win_idx = max(range(len(payouts)), key=lambda i: float(payouts[i]))
    return outs[win_idx]

def decode_official_from_gamma_market(m):
    for k in ("winningOutcome", "resolvedOutcome", "resolution", "result"):
        v = m.get(k);
        if isinstance(v, str) and v.strip().upper() in ("YES", "NO"): return v.strip().upper()
    for k in ("outcome",):
        v = m.get(k);
        if isinstance(v, bool): return "YES" if v else "NO"
        if v in (0, 1): return "YES" if v == 1 else "NO"
    return None

def scrape_official_from_frontend(event_slug, market_slug):
    """更新版爬蟲：適應 Polymarket 新版 Next.js 結構"""
    urls = []
    if event_slug: urls.append(f"https://polymarket.com/event/{event_slug}/{market_slug}")
    urls.append(f"https://polymarket.com/event/{market_slug}")
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
    
    for url in urls:
        try:
            r = requests.get(url, timeout=10, headers=headers)
            html = r.text
            if '"resolvedOutcome":"NO"' in html or '"winningOutcome":"NO"' in html: return "NO"
            if '"resolvedOutcome":"YES"' in html or '"winningOutcome":"YES"' in html: return "YES"
            m = re.search(r"Final outcome:\s*(Yes|No)", html, re.I)
            if m: return m.group(1).upper()
        except Exception: pass
    return None

def get_official_winner(market, payouts, cand):
    official = decode_official_winner(market.get("shortOutcomes"), payouts)
    if official in ("YES", "NO"): return official
    official = decode_official_from_gamma_market(market)
    if official in ("YES", "NO"): return official
    return scrape_official_from_frontend(cand.get("eventSlug"), market.get("slug"))

#  4) AI tool區

def custom_web_search(query: str, domain: str = "") -> str:
    """(工具1) 一般網頁搜尋"""
    #print(f"--- 執行工具: custom_web_search(query='{query}', domain='{domain}') ---")
    if not SERPER_API_KEY: return "Error: SERPER_API_KEY 未設定。"
    full_query = query
    if domain: full_query += f" site:{domain.strip()}"
    try:
        headers = {"X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json"}
        payload = json.dumps({"q": full_query, "num": 8, "tbs": "qdr:m"})
        r = requests.post("https://google.serper.dev/search", data=payload, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
        snippets = []
        if data.get("organic"):
            for item in data["organic"][:6]:
                snippets.append(f"Title: {item.get('title')}\nSnippet: {item.get('snippet')}\nSource: {item.get('link')}")
        if not snippets: return "Fact: 找不到相關的網頁搜尋結果。"
        return "Fact: 網頁搜尋結果:\n" + "\n---\n".join(snippets)
    except Exception as e: return f"Error: 網頁搜尋錯誤: {str(e)[:100]}"

def search_twitter_posts(keywords: str) -> str:
    """(工具2) X (Twitter) 貼文搜尋 (最近一週)"""
    #print(f"--- 執行工具: search_twitter_posts(keywords='{keywords}') ---")
    if not SERPER_API_KEY: return "Error: SERPER_API_KEY 未設定。"
    full_query = f"{keywords} (site:x.com OR site:twitter.com)"
    try:
        headers = {"X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json"}
        payload = json.dumps({"q": full_query, "num": 8, "tbs": "qdr:w"})
        r = requests.post("https://google.serper.dev/search", data=payload, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
        snippets = []
        if data.get("organic"):
            for item in data["organic"]:
                if "Log in" in item.get("title", ""): continue
                snippets.append(f"Post: {item.get('snippet')}\nLink: {item.get('link')}\nDate: {item.get('date', 'Recent')}")
        if not snippets: return "Fact: 在 X (Twitter) 上找不到最近一週的相關貼文。"
        return f"Fact: X (Twitter) 最近一週貼文搜尋結果:\n" + "\n---\n".join(snippets[:6])
    except Exception as e: return f"Error: Twitter 搜尋錯誤: {str(e)[:100]}"

def check_exchange_price(ticker: str) -> str:
    """(工具3) 交易所查核"""
    #print(f"--- 執行工具: check_exchange_price(ticker='{ticker}') ---")
    ticker = ticker.upper()
    if not ticker.endswith("USDT"): ticker += "USDT"
    try:
        url = f"https://api.mexc.com/api/v3/ticker/price?symbol={ticker}"
        r = requests.get(url, timeout=10, headers=UA)
        if r.status_code == 200:
            data = r.json()
            if data.get("price"): return f"Fact: {ticker} 已在 MEXC 交易所上架, 價格: {data['price']}"
        return f"Fact: {ticker} 查核失敗 (Status: {r.status_code})。"
    except Exception as e: return f"Error: 交易所 API 錯誤: {str(e)[:100]}"

# 5) AI 裁決者

def ai_adjudicate(question: str, cutoff_iso: str, detailed_rules: str) -> (str, list, str):
    """
    回傳: (verdict, citations, reasoning_text)
    """
    if os.getenv("SKIP_AI", "0") == "1": return "INSUFFICIENT", ["GEMINI:skip"], "Skipped"
    if not GEMINI_API_KEY: return "INSUFFICIENT", ["GEMINI:key_missing"], "No API Key"
    try: genai.configure(api_key=GEMINI_API_KEY)
    except Exception as e: return "INSUFFICIENT", [f"GEMINI:sdk_missing:{str(e)[:80]}"], str(e)

    tools = Tool(function_declarations=[
        FunctionDeclaration(
            name="custom_web_search",
            description="用於查核新聞、數據。需要數字時請在查詢中包含 'percentage' or 'count'。",
            parameters={"type": "OBJECT", "properties": {"query": {"type": "STRING"}, "domain": {"type": "STRING"}}, "required": ["query"]}
        ),
        FunctionDeclaration(
            name="search_twitter_posts",
            description="搜尋 X (Twitter) 最近一週的貼文與輿論。",
            parameters={"type": "OBJECT", "properties": {"keywords": {"type": "STRING"}}, "required": ["keywords"]}
        ),
        FunctionDeclaration(
            name="check_exchange_price",
            description="檢查代幣是否上架交易所。",
            parameters={"type": "OBJECT", "properties": {"ticker": {"type": "STRING"}}, "required": ["ticker"]}
        )
    ])
    
    # 模型選擇 (優先使用 gemini-2.5-flash)
    model_name = "gemini-2.5-flash"
    try:
        all_models = [m.name for m in genai.list_models() if "generateContent" in m.supported_generation_methods]
        picks = ([m for m in all_models if "gemini-2.5-flash" in m] or [m for m in all_models if "gemini-2.0-flash" in m] or [m for m in all_models if "gemini-1.5-flash" in m])
        if picks: model_name = picks[0].replace("models/", "")
    except: pass
    
    model = genai.GenerativeModel(model_name=model_name, tools=[tools])

   
    # Phase 1: 規劃 (Planner Prompt)

    planner_prompt = (
        f"You are an expert fact-adjudicator. Today's date is {datetime.now(timezone.utc).isoformat()}.\n"
        "**STRATEGY GUIDE:**\n"
        "1. **Neutral Search:** Do NOT search using the exact market question (e.g. '...by Nov 15'). This leads to prediction spam. Instead, search for **FACTUAL LISTS** like 'North Korea missile test timeline November 2025' or 'List of missile launches 2025'.\n"
        "2. **Numbers:** If asking for numbers, include 'count', 'results' in query.\n"
        "3. **Social Media:** Use 'search_twitter_posts' for viral events.\n"
        "4. **Crypto:** Use 'check_exchange_price' for tokens.\n"
        "5. **Specific Dates:** Include the EXACT YEAR (e.g. '2025') to filter old news.\n"
        "6. **Superlatives:** For 'most seats', search 'ELECTION RESULTS TABLE'.\n"
        "7. **Default:** Use 'custom_web_search'.\n\n"
        f"**Question:** {question}\n"
        f"**Rule:** {detailed_rules}\n"
        f"**Adjudication Time:** {cutoff_iso}\n"
    )

    try:
        print(f"\n--AI Planner (Phase 1) Starting...")
        response = model.generate_content(planner_prompt, tool_config={"function_calling_config": {"mode": "ANY"}})
        part = response.candidates[0].content.parts[0]
    except Exception as e: return "INSUFFICIENT", [f"GEMINI:P1_error:{str(e)[:100]}"], str(e)

    # Phase 2: 執行
    fact_string, citations = "", []
    if not part.function_call:
        return ("YES" if part.text.upper().startswith("YES") else "NO"), [f"GEMINI:direct:{part.text[:50]}"], "Direct response from Planner"

    fn_call = part.function_call
    fn_name, fn_args = fn_call.name, {k: v for k, v in fn_call.args.items()}
    
    try:
        if fn_name == "custom_web_search": fact_string = custom_web_search(**fn_args)
        elif fn_name == "check_exchange_price": fact_string = check_exchange_price(**fn_args)
        elif fn_name == "search_twitter_posts": fact_string = search_twitter_posts(**fn_args)
        else: fact_string = f"Error: 未知工具 '{fn_name}'"
    except Exception as e: fact_string = f"Error: Python 執行失敗: {str(e)}"
    
    citations = [f"TOOL:{fn_name}", f"FACT:{fact_string[:200]}..."]
    print(f"-Fact Returned ({len(fact_string)} chars) ---")

    
    # Phase 3: 總結 (Summarizer Prompt)
    summarizer_model = genai.GenerativeModel(model_name=model_name)
    
    summarizer_prompt = (
        "You are the final adjudicator. Answer based ONLY on the facts provided.\n\n"
        "**⛔️ CRITICAL WARNINGS:**\n"
        "1. **IGNORE URLs:** Do NOT look at dates inside links/URLs. IGNORE THEM.\n"
        "2. **TEXT ONLY:** You must find the specific date/year written inside the **TEXT SNIPPET**.\n"
        "3. **ZOMBIE CHECK (Vital):** If the snippet header says 'Nov 2025' but the body text mentions conflicting months (e.g. 'January', 'May') or context from past years, it is a **ZOMBIE ARTICLE**. REJECT IT. Real news implies consistency.\n\n"
        "**LOGIC GUIDELINES:**\n"
        "4. **Rule Compliance:** Check 'DETAILED MARKET RULES'. If required evidence (e.g. photos) is missing, answer NO.\n"
        "5. **Status Quo:** If no news confirms a change, answer NO.\n"
        "6. **Elections:** 'Winning 1st round' = Highest Votes (Plurality).\n"
        "7. **Numbers:** Compare exact numbers strictly.\n"
        "8. **Consensus:** Single source = NO. If major outlets (Reuters, AP) are silent on a 'war/missile' event, it didn't happen.\n"
        "9. **Explicit Denial:** If an authority denies it, answer NO.\n"
        "10. **Format:** Return *only* one of three words: YES / NO / INSUFFICIENT.\n\n"
        "**OUTPUT FORMAT:**\n"
        "REASONING: [Does the body text match the header date? Are there conflicting dates (e.g. Jan vs Nov)? Is there a consensus?]\n"
        "VERDICT: [YES / NO / INSUFFICIENT]\n\n"
        f"**Question:** {question}\n"
        f"**DETAILED MARKET RULES:** {detailed_rules}\n"
        f"**Fact found:** {fact_string}\n"
    )
    
    try:
        print("--AI Summarizer (Phase 3) Starting...")
        response2 = summarizer_model.generate_content(summarizer_prompt)
        text = response2.text.strip()
        
        # 推理與結果
        reasoning = "No reasoning provided."
        verdict = "INSUFFICIENT"
        
        r_match = re.search(r"REASONING:\s*(.*)", text, re.DOTALL | re.IGNORECASE)
        v_match = re.search(r"VERDICT:\s*(YES|NO|INSUFFICIENT)", text, re.IGNORECASE)
        
        if r_match: 
            reasoning = r_match.group(1).split("VERDICT:")[0].strip()
        if v_match: 
            verdict = v_match.group(1).upper()
        elif "YES" in text.upper(): verdict = "YES"
        elif "NO" in text.upper(): verdict = "NO"

        print(f"\n🧐 AI Reasoning:\n{reasoning}\n")
        print(f"⚖️ Verdict): {verdict}\n-------------------------")
        
        return verdict, citations, reasoning
    except Exception as e: return "INSUFFICIENT", [f"GEMINI:P3_error:{str(e)[:100]}"], str(e)

#  6) 主流程 
def judge_and_compare(event_name: str):
    cand = search_markets_by_name(event_name)
    if not cand: return {"error": "not_found", "query": event_name}
    m = get_market_detail(slug=cand["slug"], condition_id=cand["conditionId"])
    if not m: return {"error": "market_not_loaded", "slug": cand["slug"]}

    # 組合詳細規則
    description = m.get("description", "")
    res_source = m.get("resolutionSource", "")
    detailed_rules = f"Resolution Source: {res_source}\nDescription/Criteria: {description}"

    payouts = graph_payout_numerators(m.get("conditionId"))
    official = get_official_winner(m, payouts, cand)
    cutoff = m.get("umaEndDateIso") or m.get("endDateIso") or m.get("endDate") or ""
    status = m.get("umaResolutionStatus")
    
    resolution_date_for_ai = datetime.now(timezone.utc).isoformat() if status == "resolved" else cutoff
    
    ai, cites, reasoning = "INSUFFICIENT", [], "Skipped (Future Cutoff)"
    if status == "resolved" or not _is_future_cutoff(cutoff):
        ai, cites, reasoning = ai_adjudicate(m.get("question") or event_name, resolution_date_for_ai, detailed_rules)
    else: ai, cites = "INSUFFICIENT", ["NOTE:CUTOFF_IN_FUTURE"]

    return {
        "question": m.get("question"),
        #"slug": m.get("slug"),
        "Polymarket_official": official,
        "AI_judge": ai,
        "match": (official == ai) if official in ("YES","NO") and ai in ("YES","NO") else None,
        #"ai_reasoning": reasoning,
        #"citations": cites
    }

if __name__ == "__main__":
    if not SUBGRAPH: print("請設定 env: POLY_SUBGRAPH_URL", file=sys.stderr); sys.exit(1)
    if not GEMINI_API_KEY: print("請設定 env: GEMINI_API_KEY", file=sys.stderr); sys.exit(1)
    q = sys.argv[1] if len(sys.argv) > 1 else input("輸入事件名稱：").strip()
    res = judge_and_compare(q)
    print(json.dumps(res, ensure_ascii=False, indent=2))