import React from "react";
import { X, ExternalLink, Clock, Database, Wallet } from "lucide-react"; // 假設你有 lucide-react 圖標
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { PricePill } from "../market/price-pill";
import { Sparkline } from "../market/sparkline";
import { storeStore } from "@/store/storeStore";
import { useBuyYes } from "@/hooks/useBuyYes";

// 輔助：計算百分比
function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// 輔助：格式化時間 (如果沒有 date-fns，可以用這個簡單版)
const formatDate = (ts: number) => new Date(ts * 1000).toLocaleString();

export function MarketDetailSidebar() {
  const { selectedMarket, setSelectedMarket } = storeStore();
  const { handleBuyYes } = useBuyYes();
  
  // 當沒有選中時，我們不 render null，而是透過 CSS class 把它移出畫面
  // 這樣可以保有 transition 動畫效果
  const isOpen = !!selectedMarket;
  const m = selectedMarket;

  // 關閉 Sidebar 的函式
  const handleClose = () => setSelectedMarket(null);

  // 如果尚未選取任何東西且是第一次渲染，可能會報錯，所以做個安全檢查
  if (!m && !isOpen) return null;

  const total = m ? m.yes + m.no : 0;
  const yesPercentage = m ? calculatePercentage(m.yes, total) : 0;
  const noPercentage = m ? calculatePercentage(m.no, total) : 0;
  const yesFee = m?.yesprice ? Number(m.yesprice) / 1e9 : "-";
  const noFee = m?.noprice ? Number(m.noprice) / 1e9 : "-";

  return (
    <>
      {/* 1. 背景遮罩 (Backdrop) */}
      {/* 點擊背景區域會關閉 Sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 backdrop-blur-sm ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* 2. 滑出式面板 (Sidebar) */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full md:w-1/2 bg-background shadow-2xl transition-transform duration-300 ease-in-out border-l ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()} // 防止點擊面板內部時觸發背景的關閉事件
      >
        {m && (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold leading-tight">{m.topic}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">ID: {m.address.slice(0, 6)}...{m.address.slice(-4)}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 主要圖表區 - 比 Card 更大 */}
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="mb-4 flex justify-between items-center">
                   <span className="text-sm font-medium">Price History</span>
                   <div className="flex gap-2">
                      <PricePill side="Yes" price={yesPercentage} />
                      <PricePill side="No" price={noPercentage} />
                   </div>
                </div>
                <Sparkline width={600} height={200} className="w-full" />
              </div>

              {/* 詳細描述 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {m.description}
                </p>
              </div>

              <Separator />

              {/* 詳細數據 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> Start Time
                  </div>
                  <p className="font-medium">{formatDate(m.start_time)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" /> End Time
                  </div>
                  <p className="font-medium">{formatDate(m.end_time)}</p>
                </div>
                
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet className="h-4 w-4" /> Pool Balance
                  </div>
                  <p className="font-medium">{m.balance} USDC</p>
                </div>

                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Database className="h-4 w-4" /> Oracle Config
                  </div>
                  <p className="font-medium truncate" title={m.oracle_config}>
                    {m.oracle_config}
                  </p>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border space-y-2">
                <h4 className="font-semibold text-sm">Fee Structure</h4>
                <div className="flex justify-between text-sm">
                    <span>Yes Position Fee:</span>
                    <span className="font-mono">{yesFee} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>No Position Fee:</span>
                    <span className="font-mono">{noFee} USDC</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-muted/10 mt-auto">
              <div className="flex gap-4">
                <Button 
                  className="flex-1 h-12 text-lg bg-green-600 hover:bg-green-700"
                  onClick={() => m && handleBuyYes(m)}
                >
                  Buy Yes ({yesPercentage}%)
                </Button>
                <Button className="flex-1 h-12 text-lg bg-red-600 hover:bg-red-700" variant="outline">
                  Buy No ({noPercentage}%)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}