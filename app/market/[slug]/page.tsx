"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../../../components/navbar";
import MarketChart from "../../../components/market-chart";
import MarketOutcome from "../../../components/market-outcome";
import TradingPanel from "../../../components/trading-panel";
import { getCategoryIcon } from "../../../lib/category";
import { MarketData } from "../../../types/market-types";
import { useUiStore } from "../../../stores/ui-store";

// Market data repository
const marketDataRepo: Record<string, MarketData> = {
    "fed-december-2025": {
        id: "fed-december-2025",
        title: "Fed Decision in December 2025?",
        description: "What will the Federal Reserve decide regarding interest rates in December 2025?",
        category: "Economics",
        status: "active",
        endDate: "2025-12-31T23:59:59Z",
        totalVolume: 150000,
        totalLiquidity: 75000,
        outcomes: [
            {
                id: "50bps-decrease",
                outcome: "50+ bps decrease",
                percentage: 2,
                volume: 9066,
                change: 2,
                yesPrice: 2.5,
                noPrice: 97.6
            },
            {
                id: "25bps-decrease",
                outcome: "25 bps decrease", 
                percentage: 71,
                volume: 6356,
                change: -2,
                yesPrice: 71,
                noPrice: 30
            },
            {
                id: "no-change",
                outcome: "No change",
                percentage: 27, 
                volume: 5098,
                change: 2,
                yesPrice: 27,
                noPrice: 74
            },
            {
                id: "25bps-increase",
                outcome: "25+ bps increase",
                percentage: 1,
                volume: 47035,
                change: 0,
                yesPrice: 0.6,
                noPrice: 99.5
            }
        ],
        tags: ["fed", "interest-rates", "economics"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: new Date().toISOString()
    },
    "trump-2024-election": {
        id: "trump-2024-election", 
        title: "Trump Re-election 2024?",
        description: "Will Donald Trump win the 2024 presidential election?",
        category: "Politics",
        status: "active",
        endDate: "2024-11-05T23:59:59Z",
        totalVolume: 2500000,
        totalLiquidity: 1200000,
        outcomes: [
            {
                id: "trump-wins",
                outcome: "Trump Wins",
                percentage: 45,
                volume: 1250000,
                change: -2.1,
                yesPrice: 45,
                noPrice: 55
            },
            {
                id: "trump-loses",
                outcome: "Trump Loses", 
                percentage: 55,
                volume: 1250000,
                change: 2.1,
                yesPrice: 55,
                noPrice: 45
            }
        ],
        tags: ["politics", "election", "trump"],
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString()
    },
    "btc-100k": {
        id: "btc-100k",
        title: "Bitcoin $100K by End of Year?", 
        description: "Will Bitcoin reach $100,000 by December 31, 2025?",
        category: "Cryptocurrency",
        status: "active",
        endDate: "2025-12-31T23:59:59Z",
        totalVolume: 890000,
        totalLiquidity: 445000,
        outcomes: [
            {
                id: "btc-reaches-100k",
                outcome: "Yes, BTC hits $100K",
                percentage: 23,
                volume: 445000,
                change: 8.7,
                yesPrice: 23,
                noPrice: 77
            },
            {
                id: "btc-stays-below-100k",
                outcome: "No, stays below $100K",
                percentage: 77,
                volume: 445000,
                change: -8.7,
                yesPrice: 77,
                noPrice: 23
            }
        ],
        tags: ["bitcoin", "cryptocurrency", "price"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: new Date().toISOString()
    },
    "ai-agi-2025": {
        id: "ai-agi-2025",
        title: "AGI Achieved by End of 2025?",
        description: "Will Artificial General Intelligence be achieved by December 31, 2025?", 
        category: "Technology",
        status: "active",
        endDate: "2025-12-31T23:59:59Z",
        totalVolume: 567000,
        totalLiquidity: 283500,
        outcomes: [
            {
                id: "agi-achieved",
                outcome: "AGI Achieved",
                percentage: 12,
                volume: 283500,
                change: 12.3,
                yesPrice: 12,
                noPrice: 88
            },
            {
                id: "agi-not-achieved",
                outcome: "AGI Not Achieved",
                percentage: 88,
                volume: 283500,
                change: -12.3,
                yesPrice: 88,
                noPrice: 12
            }
        ],
        tags: ["ai", "agi", "technology"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: new Date().toISOString()
    },
    "tesla-stock-crash": {
        id: "tesla-stock-crash",
        title: "Tesla Below $100?",
        description: "Will Tesla stock fall below $100 per share in 2025?",
        category: "Stocks",
        status: "active",
        endDate: "2025-12-31T23:59:59Z",
        totalVolume: 234000,
        totalLiquidity: 117000,
        outcomes: [
            {
                id: "tesla-below-100",
                outcome: "Tesla Below $100",
                percentage: 8,
                volume: 117000,
                change: -5.4,
                yesPrice: 8,
                noPrice: 92
            },
            {
                id: "tesla-above-100",
                outcome: "Tesla Above $100",
                percentage: 92,
                volume: 117000,
                change: 5.4,
                yesPrice: 92,
                noPrice: 8
            }
        ],
        tags: ["tesla", "stocks", "tech"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: new Date().toISOString()
    },
    "war-ends-ukraine": {
        id: "war-ends-ukraine",
        title: "Ukraine War Ends in 2025?",
        description: "Will the Russia-Ukraine conflict reach a resolution by December 31, 2025?",
        category: "World Events",
        status: "active",
        endDate: "2025-12-31T23:59:59Z",
        totalVolume: 678000,
        totalLiquidity: 339000,
        outcomes: [
            {
                id: "war-ends",
                outcome: "War Ends in 2025",
                percentage: 34,
                volume: 339000,
                change: 3.2,
                yesPrice: 34,
                noPrice: 66
            },
            {
                id: "war-continues",
                outcome: "War Continues",
                percentage: 66,
                volume: 339000,
                change: -3.2,
                yesPrice: 66,
                noPrice: 34
            }
        ],
        tags: ["ukraine", "war", "geopolitics"],
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: new Date().toISOString()
    }
};

export default function MarketDetailPage() {
    const params = useParams();
    const marketId = params.slug as string;
    
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const setStoreMarket = useUiStore((s) => s.setMarket);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const fetchMarketData = async () => {
            setLoading(true);
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const data = marketDataRepo[marketId];
            if (data) {
                setMarketData(data);
            } else {
                // Fallback to default market
                setMarketData(marketDataRepo["fed-december-2025"]);
            }
            
            setLoading(false);
        };

        if (marketId) {
            fetchMarketData();
        }
    }, [marketId]);

    // Sync to store when market changes
    useEffect(() => {
        setStoreMarket(marketData ?? null);
    }, [marketData, setStoreMarket]);

    const handleTrade = (amount: number) => {
        console.log("Trade executed:", amount, "for market:", marketId);
        // Future API integration point
    };

    // Tab changes handled internally via store; placeholder removed.

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-white text-lg">Loading market data...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!marketData) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-6">
                    <div className="text-white text-center">
                        <h1 className="text-2xl font-bold mb-4">Market Not Found</h1>
                        <p>The requested market &ldquo;{marketId}&rdquo; could not be found.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-[var(--elevation-2)]">
                                {getCategoryIcon(marketData.category)}
                            </div>
                            <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">{marketData.title}</h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:ml-auto">
                            <button className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] p-2.5 rounded-lg transition-all hover:bg-[rgba(255,255,255,0.06)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </button>
                            <button className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)] p-2.5 rounded-lg transition-all hover:bg-[rgba(255,255,255,0.06)]">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {marketData.description && (
                        <p className="text-[var(--foreground-secondary)] mb-5 text-sm sm:text-base leading-relaxed">{marketData.description}</p>
                    )}
                    
                    {/* Prediction indicators */}
                    <div className="flex flex-wrap gap-3 sm:gap-6 text-sm mb-5">
                        {marketData.outcomes.map((outcome, index) => (
                            <div key={outcome.id} className="flex items-center space-x-2.5 mb-2">
                                <div className={`w-3 h-3 rounded-full shrink-0 shadow-lg ${
                                    index === 0 ? 'bg-[var(--success)]' : 
                                    index === 1 ? 'bg-[var(--danger)]' :
                                    index === 2 ? 'bg-[var(--primary)]' : 'bg-[var(--warning)]'
                                }`}></div>
                                <span className="text-[var(--foreground-secondary)] whitespace-nowrap font-medium">{outcome.outcome} <span className="text-white font-semibold">{outcome.percentage}%</span></span>
                            </div>
                        ))}
                    </div>

                    {/* Market info */}
                    <div className="grid grid-cols-2 sm:flex sm:space-x-6 gap-3 text-sm text-[var(--foreground-secondary)]">
                        <span className="truncate"><span className="font-medium">Vol:</span> ${marketData.totalVolume.toLocaleString()}</span>
                        <span className="truncate"><span className="font-medium">Liq:</span> ${marketData.totalLiquidity.toLocaleString()}</span>
                        <span className="truncate"><span className="font-medium">Cat:</span> {marketData.category}</span>
                        <span className="truncate"><span className="font-medium">Ends:</span> {new Date(marketData.endDate).toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    {/* Left column - Chart */}
                    <div className="xl:col-span-8">
                        <MarketChart data={marketData.chartData} className="mb-6" />
                        
                        {/* Outcomes section */}
                        <div>
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-white text-lg font-bold tracking-tight">OUTCOMES</h2>
                                <h2 className="text-[var(--foreground-secondary)] text-sm font-semibold hidden sm:block">% CHANGE</h2>
                            </div>
                            
                            <div className="space-y-3">
                                {marketData.outcomes.map((outcome) => (
                                    <MarketOutcome
                                        key={outcome.id}
                                        outcomeId={outcome.id}
                                        outcome={outcome.outcome}
                                        percentage={outcome.percentage}
                                        volume={outcome.volume}
                                        change={outcome.change}
                                        yesPrice={outcome.yesPrice}
                                        noPrice={outcome.noPrice}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column - Trading & News */}
                    <div className="xl:col-span-4">
                        <TradingPanel onTrade={handleTrade} />
                    </div>
                </div>
            </div>
        </div>
    );
}