"use client";

import { useEffect, useMemo } from "react";
import HomCard from "../components/homCard";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Footer from "../components/footer";
import { useUiStore } from "../stores/ui-store";

export default function Page(){
    const { markets, marketsLoading, loadMarkets } = useUiStore((state) => ({
        markets: state.markets,
        marketsLoading: state.marketsLoading,
        loadMarkets: state.loadMarkets
    }));

    useEffect(() => {
        if (markets.length === 0) {
            void loadMarkets({ limit: 12 });
        }
    }, [markets.length, loadMarkets]);

    const cardData = useMemo(() => {
        if (markets.length === 0) {
            return [];
        }

        return markets.map((market) => {
            const primaryOutcome = market.outcomes.reduce((best, outcome) => {
                if (!best) {
                    return outcome;
                }
                return outcome.percentage > best.percentage ? outcome : best;
            }, market.outcomes[0]);

            return {
                id: market.id,
                title: market.title,
                description: market.description ?? "",
                value: primaryOutcome ? `${primaryOutcome.percentage}%` : "--",
                change: primaryOutcome?.change ?? 0,
                marketType: "prediction"
            };
        });
    }, [markets]);

    return (
        <main>
            <Navbar />
            
            {/* Hero Section */}
            <Hero />
            
            {/* Markets Grid */}
            <div className="max-w-[1400px] mx-auto p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white tracking-tight">Active Markets</h2>
                    <div className="flex gap-2">
                        <button className="btn btn-chip">All</button>
                        <button className="btn btn-chip">Trending</button>
                        <button className="btn btn-chip">New</button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {cardData.length === 0 && !marketsLoading && (
                        <div className="col-span-full text-center text-foreground-secondary py-12">
                            No markets available yet.
                        </div>
                    )}

                    {cardData.length === 0 && marketsLoading && (
                        <div className="col-span-full text-center text-foreground-secondary py-12">
                            Loading markets...
                        </div>
                    )}

                    {cardData.map((data) => (
                        <HomCard
                            key={data.id}
                            id={data.id}
                            title={data.title}
                            description={data.description}
                            value={data.value}
                            change={data.change}
                            marketType={data.marketType}
                        />
                    ))}
                </div>
            </div>
            
            <Footer />
        </main>
    );
}