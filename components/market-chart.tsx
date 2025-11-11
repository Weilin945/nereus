"use client";

import { useMemo, useRef, useState } from "react";
import { useUiStore, Timeframe } from "../stores/ui-store";
import type { ChartDataPoint } from "../types/market-types";

interface MarketChartProps {
    data?: ChartDataPoint[];
    className?: string;
}

function generateMockSeries(n: number, start = 60): ChartDataPoint[] {
    // simple bounded random walk
    let yes = start;
    const out: ChartDataPoint[] = [];
    for (let i = 0; i < n; i++) {
        const drift = (Math.random() - 0.5) * 4; // +/-2%
        yes = Math.min(95, Math.max(5, yes + drift));
        const no = 100 - yes;
        out.push({ timestamp: Date.now() - (n - i) * 60_000, yes, no });
    }
    return out;
}

const TF_LENGTH: Record<Exclude<Timeframe, "ALL">, number> = {
    "1H": 60,
    "6H": 60 * 6,
    "1D": 24 * 12, // 5-min resolution
    "1W": 7 * 24,
    "1M": 30 * 24,
};

export default function MarketChart({ data, className = "" }: MarketChartProps) {
    const tf = useUiStore((s) => s.timeframe);
    const setTimeframe = useUiStore((s) => s.setTimeframe);
    const [hoverI, setHoverI] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const baseData: ChartDataPoint[] = useMemo(() => {
        if (data && data.length > 1) return data;
        // default demo data ~ 500 points
        return generateMockSeries(500, 62);
    }, [data]);

    const displayData = useMemo(() => {
        if (tf === "ALL") return baseData;
        const n = TF_LENGTH[tf as Exclude<Timeframe, "ALL">];
        return baseData.slice(-n);
    }, [baseData, tf]);


    // Build SVG paths
    const width = 800; // viewBox width (responsive via viewBox)
    const height = 260; // chart height in viewBox
    const padL = 36, padR = 12, padT = 16, padB = 24;
    const W = width - padL - padR;
    const H = height - padT - padB;

        const pointsYes: string = useMemo(() => {
            const n = displayData.length;
            if (n === 0) return "";
            return displayData
                .map((p, i) => {
                    const x = padL + (i * W) / Math.max(1, n - 1);
                    const y = padT + (1 - p.yes / 100) * H;
                    return `${x},${y}`;
                })
                .join(" ");
        }, [displayData, W, H, padL, padT]);

        const pointsNo: string = useMemo(() => {
            const n = displayData.length;
            if (n === 0) return "";
            return displayData
                .map((p, i) => {
                    const x = padL + (i * W) / Math.max(1, n - 1);
                    const y = padT + (1 - p.no / 100) * H;
                    return `${x},${y}`;
                })
                .join(" ");
        }, [displayData, W, H, padL, padT]);

    const handleMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
        const x = e.clientX - rect.left - padL;
        if (x < 0 || displayData.length < 2) { setHoverI(null); return; }
        const i = Math.round((x / W) * (displayData.length - 1));
        setHoverI(Math.max(0, Math.min(displayData.length - 1, i)));
    };

    const handleLeave = () => setHoverI(null);

    const hover = hoverI != null ? displayData[hoverI] : null;
    const hoverX = hoverI != null ? padL + (hoverI * W) / Math.max(1, displayData.length - 1) : null;

                const tfBtn = (label: Timeframe) => (
        <button
            key={label}
                        onClick={() => setTimeframe(label)}
                    className={`btn btn-chip ${tf === label ? 'active' : ''}`}
        >
            {label}
        </button>
    );

    return (
        <div className={`card-surface ${className}`} ref={containerRef}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 p-5 pb-0">
                <h3 className="text-white text-lg font-bold tracking-tight">Market Prediction</h3>
                <div className="flex flex-wrap gap-2">
                    {(["1H","6H","1D","1W","1M","ALL"] as Timeframe[]).map(tfBtn)}
                </div>
            </div>

            <div className="relative w-full h-64 select-none px-2">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="absolute inset-0 w-full h-full"
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                >
                    {/* Grid */}
                    {[0,20,40,60,80,100].map((v) => {
                        const y = padT + (1 - v/100) * H;
                        return (
                            <g key={v}>
                                <line x1={padL} y1={y} x2={width-padR} y2={y} stroke="rgba(255,255,255,0.05)" strokeOpacity={0.8} />
                                <text x={8} y={y+4} fontSize={11} fill="var(--foreground-tertiary)" fontWeight={500}>{v}%</text>
                            </g>
                        );
                    })}

                    {/* Lines - More subtle, professional look */}
                    <polyline 
                        fill="none" 
                        stroke="var(--primary-light)" 
                        strokeWidth={2.5} 
                        points={pointsYes} 
                        style={{ filter: "drop-shadow(0 0 4px rgba(99,102,241,0.3))" }} 
                    />
                    <polyline 
                        fill="none" 
                        stroke="var(--danger)" 
                        strokeWidth={2.5} 
                        points={pointsNo} 
                        style={{ filter: "drop-shadow(0 0 4px rgba(239,68,68,0.3))" }} 
                    />

                    {/* Hover marker */}
                    {hover && hoverX != null && (
                        <g>
                            <line x1={hoverX} y1={padT} x2={hoverX} y2={height-padB} stroke="rgba(255,255,255,0.2)" strokeDasharray="4 4" opacity={0.8} />
                            {/* yes circle */}
                            <circle cx={hoverX} cy={padT + (1 - hover.yes/100)*H} r={5} fill="var(--primary-light)" stroke="white" strokeWidth={1.5} />
                            {/* no circle */}
                            <circle cx={hoverX} cy={padT + (1 - hover.no/100)*H} r={5} fill="var(--danger)" stroke="white" strokeWidth={1.5} />
                        </g>
                    )}
                </svg>

                {/* Tooltip */}
                {hover && hoverX != null && (
                    <div
                        className="absolute -translate-x-1/2 top-2 bg-[var(--background-elevated)] border border-[var(--border-medium)] rounded-lg px-3 py-2 text-xs text-white shadow-[var(--elevation-3)] backdrop-blur-xl"
                        style={{ left: `${(hoverX/width)*100}%` }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-[var(--foreground-secondary)] font-medium">{hover.timestamp ? new Date(hover.timestamp).toLocaleTimeString() : ''}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[var(--primary-light)] font-semibold">Yes {hover.yes.toFixed(1)}%</span>
                            <span className="text-[var(--danger-light)] font-semibold">No {hover.no.toFixed(1)}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}