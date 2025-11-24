"use client"
import * as React from "react"

type Props = {
  points?: number
  width?: number
  height?: number
  stroke?: string
  className?: string
}

export function Sparkline({ points = 24, width = 220, height = 64, stroke = "oklch(70.4% 0.14 182.503)", className = "" }: Props) {
  const { greenPath, redPath } = React.useMemo(() => {
    const rand = (seed: number) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    const greenData = Array.from({ length: points }, (_, i) => rand(i + 1))
    // Clamp green values between 0 and 1
    const green = greenData.map(v => Math.max(0, Math.min(1, v)))
    const red = green.map(v => 1 - v)
    const max = 1
    const min = 0
    const scaleY = (v: number) => height - ((v - min) / (max - min + 1e-6)) * height
    const step = width / (points - 1)
    const greenPath = green.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${scaleY(v)}`).join(" ")
    const redPath = red.map((v, i) => `${i === 0 ? "M" : "L"}${i * step},${scaleY(v)}`).join(" ")
    return { greenPath, redPath }
  }, [points, width, height])

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <path d={greenPath} fill="none" stroke={stroke} strokeWidth={2} />
      <path d={redPath} fill="none" stroke="oklch(58.6% 0.253 17.585)" strokeWidth={2} />
    </svg>
  )
}
