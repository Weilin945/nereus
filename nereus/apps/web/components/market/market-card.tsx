import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"
import { PricePill } from "./price-pill"
import { Sparkline } from "./sparkline"
import { Stat } from "./stat"
import { Market } from "@/store/storeStore"
import { useBuyYes } from "@/hooks/useBuyYes"
import { useBuyNo } from "@/hooks/useBuyNo"
import { FlipBuyButton } from "./flip-buy-button"
import Link from "next/link"

// Utility function to format countdown from timestamp
function formatCountdown(endTime: number): string {
  const now = Math.floor(Date.now() )
  const timeLeft = endTime - now

  if (timeLeft <= 0) {
    return "Ended"
  }

  const days = Math.floor(timeLeft / (24 * 60 * 60 *1000))
  const hours = Math.floor((timeLeft % (24 * 60 * 60 *1000)) / (60 * 60 *1000))
  const minutes = Math.floor((timeLeft % (60 * 60 *1000)) / (60 * 1000))

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

// 1. 大型列表卡片 (Detailed View)
export function MarketCard({ m, onMarketClick }: MarketCardProps) {
  const { handleBuyYes } = useBuyYes()
  const { handleBuyNo } = useBuyNo()

  const total = m.yes + m.no
  const yesPercentage = calculatePercentage(m.yes, total)
  const noPercentage = calculatePercentage(m.no, total)
  const countdown = formatCountdown(m.end_time)
  const isEnded = countdown === "Ended"

  const yesFee = m.yesprice ? Number(m.yesprice) / 1e9 : undefined
  const noFee = m.noprice ? Number(m.noprice) / 1e9 : undefined

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className="p-4">
        <CardTitle
          className="text-lg cursor-pointer hover:text-primary transition-colors break-words hyphens-auto"
          onClick={() => onMarketClick?.(m)}
        >
          {m.topic}
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2 break-words">
          {m.description}
        </p>
      </CardHeader>
      
      <CardContent className="grid gap-4 p-4 pt-0 md:grid-cols-5 flex-1">
        {/* Chart Section - Handles overflow with min-w-0 */}
        <div className="col-span-3 rounded-md bg-muted/40 p-2 min-w-0 flex items-center justify-center">
          <div className="w-full">
             <Sparkline width={520} height={120} className="w-full h-auto" />
          </div>
        </div>

        {/* Stats & Action Section */}
        <div className="col-span-2 flex flex-col justify-between gap-3 min-w-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <PricePill side="Yes" price={yesPercentage} />
              <PricePill side="No" price={noPercentage} />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 lg:grid-cols-1">
               <Stat label="Ends in" value={countdown} />
               <Stat label="Balance" value={`${m.balance} USDC`} />
               <Stat
                 label="Fee"
                 value={`Yes: ${yesFee !== undefined ? yesFee : "-"} | No: ${noFee !== undefined ? noFee : "-"}`}
               />
            </div>
          </div>

          <div className="mt-auto space-y-2 pt-2">
            <div className="flex gap-2">
              <FlipBuyButton
                side="YES"
                price={yesFee ?? 0}
                onConfirm={(amount) => handleBuyYes(m, amount)}
                className={`flex-1 min-w-[80px] ${isEnded ? "hidden" : ""}`}
              />
              <FlipBuyButton
                side="NO"
                price={noFee ?? 0}
                onConfirm={(amount) => handleBuyNo(m, amount)}
                className={`flex-1 min-w-[80px] ${isEnded ? "hidden" : ""}`}
              />
            </div>
            <Link href={`/market?id=${m.address}`}>
              <Button variant="outline" className="w-full" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 2. 中型網格卡片 (Grid View - Fixed Overlap)
export function MarketCardGrid({ m, onMarketClick }: MarketCardProps) {
  const { handleBuyYes } = useBuyYes()
  const { handleBuyNo } = useBuyNo()

  const total = m.yes + m.no
  const yesPercentage = calculatePercentage(m.yes, total)
  const noPercentage = calculatePercentage(m.no, total)
  const countdown = formatCountdown(m.end_time)
  const isEnded = countdown === "Ended"
  
  const yesFee = m.yesprice ? Number(m.yesprice) / 1e9 : undefined
  const noFee = m.noprice ? Number(m.noprice) / 1e9 : undefined

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle
          className="line-clamp-2 text-base break-words hyphens-auto leading-snug"
          onClick={() => onMarketClick?.(m)}
        >
          {m.topic}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1 flex flex-col">
        <div className="w-full overflow-hidden">
           <Sparkline width={300} height={70} className="w-full h-auto" />
        </div>

        {/* Split into 2 columns to prevent buttons from overlapping pills */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
            {/* Yes Column */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                    <PricePill side="Yes" price={yesPercentage} />
                </div>
                {!isEnded && (
                    <FlipBuyButton
                        side="YES"
                        price={yesFee ?? 0}
                        onConfirm={(amount) => handleBuyYes(m, amount)}
                        className="w-full text-xs h-9"
                    />
                )}
            </div>

            {/* No Column */}
            <div className="flex flex-col gap-2">
                <div className="flex justify-center">
                    <PricePill side="No" price={noPercentage} />
                </div>
                {!isEnded && (
                    <FlipBuyButton
                        side="NO"
                        price={noFee ?? 0}
                        onConfirm={(amount) => handleBuyNo(m, amount)}
                        className="w-full text-xs h-9"
                    />
                )}
            </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t text-xs">
             <Stat label="Ends" value={countdown} />
             <Stat label="Fee" value={`Y:${yesFee ?? "-"} N:${noFee ?? "-"}`} />
        </div>
        
        <Link href={`/market?id=${m.address}`}>
          <Button variant="outline" className="w-full" size="sm">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// 3. 小型卡片 (Compact/Sidebar View)
export function MarketCardSmall({ m, onMarketClick }: MarketCardProps) {
  const total = m.yes + m.no
  const yesPercentage = calculatePercentage(m.yes, total)
  const noPercentage = calculatePercentage(m.no, total)
  const countdown = formatCountdown(m.end_time)
  
  const yesFee = m.yesprice ? Number(m.yesprice) / 1e9 : undefined
  const noFee = m.noprice ? Number(m.noprice) / 1e9 : undefined

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow w-full" 
      onClick={() => onMarketClick?.(m)}
    >
      <CardHeader className="pb-2 p-3">
        <CardTitle className="line-clamp-2 text-sm leading-tight break-words">
            {m.topic}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-3 pt-0">
        <div className="flex items-center justify-between gap-2">
          <PricePill side="Yes" price={yesPercentage} />
          <PricePill side="No" price={noPercentage} />
        </div>
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
                <span>Ends:</span>
                <span className="font-medium text-foreground">{countdown}</span>
            </div>
            <div className="flex justify-between">
                <span>Fee:</span>
                <span className="font-medium text-foreground truncate ml-2">
                    Y:{yesFee ?? "-"} N:{noFee ?? "-"}
                </span>
            </div>
        </div>
        <Link href={`/market?id=${m.address}`}>
          <Button variant="outline" className="w-full mt-2" size="sm">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}