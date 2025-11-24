"use client"
import * as React from "react"
import { LineChart } from '@mui/x-charts';

type Props = {
  points?: number
  width?: number
  height?: number
  stroke?: string
  className?: string
  interactive?: boolean
}

export function Sparkline({ points = 50, width: initialWidth = 220, height = 64, stroke = "oklch(70.4% 0.14 182.503)", className = "", interactive = false }: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = React.useState(initialWidth);

  React.useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setChartWidth(entry.contentRect.width);
        }
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const { yesData, noData, xLabels } = React.useMemo(() => {
    const yesData: number[] = [];
    const noData: number[] = [];
    const xLabels: number[] = [];
    let current = 0.5;
    
    for (let i = 0; i < points; i++) {
        yesData.push(Number(current.toFixed(2)));
        noData.push(Number((1 - current).toFixed(2)));
        xLabels.push(i);
        
        const change = (Math.random() - 0.5) * 0.1;
        current += change;
        current = Math.max(0.05, Math.min(0.95, current));
    }
    return { yesData, noData, xLabels }
  }, [points])

  return (
    <div className={className} ref={containerRef} style={{ width: '100%', overflow: 'hidden' }}>
      <LineChart
        width={chartWidth}
        height={height}
        series={[
          { data: yesData, label: 'YES', color: stroke, showMark: false, curve: "monotoneX" },
          { data: noData, label: 'NO', color: 'oklch(58.6% 0.253 17.585)', showMark: false, curve: "monotoneX" },
        ]}
        xAxis={[{ data: xLabels, scaleType: 'linear', hideTooltip: !interactive }]}
        yAxis={[{ min: 0, max: 1, hideTooltip: !interactive }]}
        // @ts-expect-error - leftAxis type definition missing
        leftAxis={interactive ? undefined : null}
        bottomAxis={interactive ? undefined : null}
        margin={interactive ? { left: 30, right: 10, top: 10, bottom: 20 } : { left: 0, right: 0, top: 5, bottom: 5 }}
        slotProps={{
            legend: { hidden: !interactive } as any,
        }}
      />
    </div>
  )
}
