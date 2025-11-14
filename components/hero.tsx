import Link from "next/link";
import NereusLogo from "./nereus-logo";

export default function Hero() {
  return (
    <section className="nereus-hero border-b border-[var(--border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 md:py-14 relative">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4 text-[var(--foreground-tertiary)]">
              <NereusLogo size="sm" />
              <span className="text-xs font-semibold tracking-widest uppercase">Nereus Markets</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4" style={{letterSpacing: "-1.2px"}}>
              Trade on the Future
            </h1>
            <p className="text-[var(--foreground-secondary)] text-base md:text-lg max-w-2xl leading-relaxed">
              Professional prediction markets with ocean‑calm UX. Subtle trident & wave motifs bring the Nereus identity to life—without distractions.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link href="/market" className="btn btn-primary hero-cta">
                Start Trading
              </Link>
              <Link href="#" className="btn btn-outline">
                Learn More
              </Link>
            </div>
          </div>

          <div className="hidden md:block w-[420px] shrink-0 self-stretch">
            <div className="card-surface h-full rounded-2xl p-6 flex flex-col justify-between" aria-hidden>
              <div>
                <p className="text-caption mb-2">Live sentiment</p>
                <h3 className="text-title mb-4">Weekly Outlook</h3>
                <div className="skeleton h-40 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <span className="badge pos">↑ Bullish</span>
                <span className="badge neg">↓ Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
