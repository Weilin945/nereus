"use client";

import Card from "./ui/Card";

interface HomCardProps {
    id?: string;
    title?: string;
    description?: string;
    value?: string;
    change?: number;
    marketType?: string;
}

export default function HomCard({
    id,
    title = "Market Asset",
    description = "Trading pair information",
    value = "$0.00",
    change = 0,
    marketType = "prediction"
}: HomCardProps) {
    const isPositive = change >= 0;
    const slug = id || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    return (
        <Card
            href={`/market/${slug}?type=${marketType}`}
            accent={isPositive ? "lime" : "magenta"}
            className="group relative overflow-hidden"
            padding="md"
        >
            {/* Subtle gradient overlay - only visible on hover */}
            <div 
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                style={{
                    background: "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.08), transparent 70%)"
                }} 
            />

            <div className="relative space-y-3">
                <h3 className="font-bold text-[15px] sm:text-[16px] text-[var(--foreground)] tracking-tight leading-snug line-clamp-2 transition-all group-hover:text-[var(--primary-light)]">
                    {title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] line-clamp-2 leading-relaxed">
                    {description}
                </p>
                <div className="flex items-end justify-between pt-2 border-t border-[var(--border-subtle)]">
                    <span className="text-[28px] font-bold text-white tracking-tight" style={{letterSpacing: '-1px'}}>
                        {value}
                    </span>
                    <span className={`badge ${isPositive ? 'pos' : 'neg'}`}>
                        {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                    </span>
                </div>
            </div>
        </Card>
    );
}