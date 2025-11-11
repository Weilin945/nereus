"use client";

import { useUiStore } from "../stores/ui-store";

interface MarketOutcomeProps {
    outcomeId?: string;
    outcome: string;
    percentage: number;
    volume: number;
    change: number;
    yesPrice: number;
    noPrice: number;
}

export default function MarketOutcome({
    outcomeId,
    outcome,
    percentage,
    volume,
    change,
    yesPrice,
    noPrice,
}: MarketOutcomeProps) {
    const isPositive = change >= 0;
    const setSelectedOutcomeId = useUiStore((s) => s.setSelectedOutcomeId);
    const setTradeSide = useUiStore((s) => s.setTradeSide);

    const chooseOutcome = () => {
        if (outcomeId) setSelectedOutcomeId(outcomeId);
        setTradeSide("buy");
    };

        return (
            <div className="card-surface p-5 border-l-2 border-[var(--primary)] hover:border-[var(--primary-light)] transition-all">
            <div className="flex justify-between items-start mb-4 gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5 wrap-break-word leading-snug">{outcome}</h3>
                    <p className="text-[var(--foreground-tertiary)] text-xs">
                        ${volume.toLocaleString()}.{volume % 1000 === 0 ? "000" : ""} Vol
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <div className="text-white text-xl sm:text-2xl font-bold tracking-tight" style={{letterSpacing: '-0.5px'}}>{percentage}%</div>
                    <div className={`text-sm font-medium ${isPositive ? "text-[var(--success-light)]" : "text-[var(--danger-light)]"}`}>
                        {isPositive ? "+" : ""}
                        {change}%
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <button className="flex-1 btn btn-success" onClick={chooseOutcome}>
                    Yes {yesPrice.toFixed(1)}¢
                </button>
                <button className="flex-1 btn btn-danger" onClick={chooseOutcome}>
                    No {noPrice.toFixed(1)}¢
                </button>
            </div>
        </div>
    );
}