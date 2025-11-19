import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { PricePill } from "./price-pill"
import { Sparkline } from "./sparkline"
import { Stat } from "./stat"
import { Market, storeStore } from "@/store/storeStore"
import { useBuyYes } from "@/hooks/useBuyYes"

// Utility function to format countdown from timestamp
function formatCountdown(endTime: number): string {
  const now = Math.floor(Date.now() / 1000)
  const timeLeft = endTime - now
  
  if (timeLeft <= 0) {
    return "Ended"
  }
  
  const days = Math.floor(timeLeft / (24 * 60 * 60))
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60))
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60)
  
  if (days > 0) {
    return `${days}d ${hours}h`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

// Helper function to calculate percentage
function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

interface MarketCardProps {
  m: Market
  onMarketClick?: (market: Market) => void
}

// 1. 大型列表卡片 (詳細資訊)
export function MarketCard({ m, onMarketClick }: MarketCardProps) {
  // 連接 Store 的 selectTrade
  const selectTrade = storeStore((state) => state.selectTrade);
  const { handleBuyYes } = useBuyYes();
  
  const total = m.yes + m.no
  const yesPercentage = calculatePercentage(m.yes, total)
  const noPercentage = calculatePercentage(m.no, total)
  const countdown = formatCountdown(m.end_time)

  const yesFee = m.yesprice ? Number(m.yesprice) / 1e9 : undefined
  const noFee = m.noprice ? Number(m.noprice) / 1e9 : undefined

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle 
          className="text-lg cursor-pointer hover:text-primary transition-colors"
          onClick={() => onMarketClick?.(m)}
        >
          {m.topic}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{m.description}</p>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 pt-0 md:grid-cols-5">
        <div className="col-span-3 rounded-md bg-muted/40 p-2">
          <Sparkline width={520} height={120} />
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <PricePill side="Yes" price={yesPercentage} />
            <PricePill side="No" price={noPercentage} />
          </div>
          <Separator />
          <Stat label="Ends in" value={countdown} />
          <Stat label="Balance" value={`${m.balance} USDC`} />
          <Stat label="Fee" value={`Yes: ${yesFee !== undefined ? yesFee : "-"} | No: ${noFee !== undefined ? noFee : "-"}`} />
          <div className="mt-auto flex gap-2">
            {/* 這裡點擊後會更新 Store，並觸發 TradePanel */}
            <Button 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleBuyYes(m);
              }}
            >
              Buy Yes
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => selectTrade(m, "No")}
            >
              Buy No
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 2. 中型網格卡片 (較精簡)
export function MarketCardGrid({ m, onMarketClick }: MarketCardProps) {
  const selectTrade = storeStore((state) => state.selectTrade);
  const { handleBuyYes } = useBuyYes();

  const total = m.yes + m.no
  const yesPercentage = calculatePercentage(m.yes, total)
  const noPercentage = calculatePercentage(m.no, total)
  const countdown = formatCountdown(m.end_time)
  const yesFee = m.yesprice ? Number(m.yesprice) / 1e9 : undefined
  const noFee = m.noprice ? Number(m.noprice) / 1e9 : undefined

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle 
            className="line-clamp-2 text-base"
            onClick={() => onMarketClick?.(m)}
        >
            {m.topic}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Sparkline width={300} height={70} />
        <div className="flex items-center justify-between">
          <PricePill side="Yes" price={yesPercentage} />
          {/* 透過 stopPropagation 防止點擊按鈕時觸發卡片的 onClick */}
          <Button className="ml-2 h-8 px-3" size="sm" onClick={(e) => { e.stopPropagation(); handleBuyYes(m); }}>
             Yes
          </Button>
          
          <PricePill side="No" price={noPercentage} />
          <Button className="ml-2 h-8 px-3" size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); selectTrade(m, "No"); }}>
             No
          </Button>
        </div>
        <Stat label="Ends in" value={countdown} />
        <Stat label="Fee" value={`Y: ${yesFee ?? "-"} | N: ${noFee ?? "-"}`} />
      </CardContent>
    </Card>
  )
}

// 3. 小型卡片 (適合側邊欄或密集顯示)
export function MarketCardSmall({ m, onMarketClick }: MarketCardProps) {
  const total = m.yes + m.no
  const yesPercentage = calculatePercentage(m.yes, total)
  const noPercentage = calculatePercentage(m.no, total)
  const countdown = formatCountdown(m.end_time)
  const yesFee = m.yesprice ? Number(m.yesprice) / 1e9 : undefined
  const noFee = m.noprice ? Number(m.noprice) / 1e9 : undefined

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onMarketClick?.(m)}>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2 text-sm">{m.topic}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <PricePill side="Yes" price={yesPercentage} />
          <PricePill side="No" price={noPercentage} />
        </div>
        <Stat label="Ends in" value={countdown} />
        <Stat label="Fee" value={`Y: ${yesFee ?? "-"} | N: ${noFee ?? "-"}`} />
      </CardContent>
    </Card>
  )
}