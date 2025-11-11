"use client";

import HomCard from "../components/homCard";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Page(){
    // Grid configuration - easily extendable
    const gridColumns = 4;
    const gridRows = 3;
    const totalCards = gridColumns * gridRows;

    // Sample data for demonstration
    const cardData = [
        { 
            id: "fed-december-2025",
            title: "Fed Decision December 2025", 
            description: "Will the Fed cut rates in December?", 
            value: "71%", 
            change: 5.2,
            marketType: "prediction"
        },
        { 
            id: "trump-2024-election",
            title: "Trump Re-election 2024", 
            description: "Will Trump win the 2024 election?", 
            value: "45%", 
            change: -2.1,
            marketType: "prediction"
        },
        { 
            id: "btc-100k",
            title: "Bitcoin $100K by EOY", 
            description: "Bitcoin reaches $100,000 by December", 
            value: "23%", 
            change: 8.7,
            marketType: "prediction"
        },
        { 
            id: "ai-agi-2025",
            title: "AGI by End of 2025", 
            description: "Artificial General Intelligence achieved", 
            value: "12%", 
            change: 12.3,
            marketType: "prediction"
        },
        {
            id: "tesla-stock-crash",
            title: "Tesla Below $100",
            description: "TSLA stock falls below $100",
            value: "8%",
            change: -5.4,
            marketType: "prediction"
        },
        {
            id: "war-ends-ukraine",
            title: "Ukraine War Ends 2025",
            description: "Russia-Ukraine conflict resolution",
            value: "34%",
            change: 3.2,
            marketType: "prediction"
        },
        {
            id: "spacex-mars-mission",
            title: "SpaceX Mars Mission",
            description: "First crewed mission to Mars",
            value: "5%",
            change: 1.8,
            marketType: "prediction"
        },
        {
            id: "us-recession-2025",
            title: "US Recession in 2025",
            description: "Official recession declared",
            value: "28%",
            change: -3.1,
            marketType: "prediction"
        }
    ];

    return (
        <main>
            <Navbar />
            
            {/* Hero Section */}
            <div className="border-b border-[var(--border-subtle)] bg-gradient-to-b from-[rgba(59,130,246,0.03)] to-transparent">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight" style={{letterSpacing: '-1px'}}>
                            Professional Prediction Markets
                        </h1>
                        <p className="text-base md:text-lg text-[var(--foreground-secondary)] leading-relaxed">
                            Trade on future events with confidence. Powered by decentralized technology and community wisdom.
                        </p>
                    </div>
                </div>
            </div>
            
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
                    {Array.from({ length: totalCards }, (_, index) => {
                        const data = cardData[index % cardData.length];
                        return (
                            <HomCard 
                                key={index}
                                id={data.id}
                                title={data.title}
                                description={data.description}
                                value={data.value}
                                change={data.change}
                                marketType={data.marketType}
                            />
                        );
                    })}
                </div>
            </div>
            
            <Footer />
        </main>
    );
}