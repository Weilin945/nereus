"use client"

import { useEffect } from "react"
import { CategoryTabs } from "./category-tabs"
import {  MarketCard, MarketCardGrid, MarketCardSmall } from "./market/market-card"
import { storeStore, type Market } from "@/store/storeStore"
// 引入剛寫好的 Sidebar (路徑請依你的專案結構調整，假設在同一層或 components)
import { MarketDetailSidebar } from "./sneakpeek/peekCard" 

export function MarketGrid() {
  // 1. 改用 Store 中的 setSelectedMarket，移除原本的 useState
  const { marketList, queryMarkets, setSelectedMarket } = storeStore()
  
  useEffect(() => {
    queryMarkets()
  }, [queryMarkets])

  // 2. 點擊時，直接更新 Global Store，Sidebar 就會自動偵測到變化並滑出
  const handleMarketClick = (market: Market, side?: "yes" | "no") => {
    setSelectedMarket(market)
    console.log('Market clicked:', market.topic, side)
  }

  if (marketList.length === 0) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4">
        <CategoryTabs>
          {() => (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading markets...</p>
            </div>
          )}
        </CategoryTabs>
      </section>
    )
  }

  // ⚠️ 重要修正：移除了 marketList.forEach(...) 
  // 原因：在 render 過程中直接呼叫 API (getPrices) 會導致效能災難和無限迴圈。
  // 且你的 Store 已經在 queryMarkets 時抓好價格了。

  return (
    <section className="mx-auto w-full max-w-7xl px-4 relative">
      {/* 3. 放入 Sidebar 元件，它預設是隱藏的 (fixed position) */}
      <MarketDetailSidebar />

      <CategoryTabs>
        {() => (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            {/* Large Card */}
            {marketList[0] && (
              <div className="md:col-span-6">
                <MarketCard m={marketList[0]} onMarketClick={handleMarketClick} />
              </div>
            )}
            
            {/* Medium Cards */}
            {marketList[1] && (
              <div className="md:col-span-3">
                <MarketCardGrid m={marketList[1]} onMarketClick={handleMarketClick} />
              </div>
            )}
            {marketList[2] && (
              <div className="md:col-span-3">
                <MarketCardGrid m={marketList[2]} onMarketClick={handleMarketClick} />
              </div>
            )}

            {/* Small Cards */}
            {marketList.slice(3, 6).map((market) => (
              <div key={market.address} className="md:col-span-3">
                <MarketCardSmall m={market} onMarketClick={handleMarketClick} />
              </div>
            ))}
            
            <div className="md:col-span-12">
              <div className="h-12" /> {/* Spacer for footer */}
            </div>
          </div>
        )}
      </CategoryTabs>
    </section>
  )
}