import { ConnectButton } from "@mysten/dapp-kit";
import NereusLogo from "./nereus-logo";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-[var(--border-subtle)] bg-[rgba(9,17,26,0.85)]">
            <nav className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="transition-transform group-hover:scale-105">
                            <NereusLogo size="md" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-bold text-[var(--primary-light)] tracking-tight select-none transition-all group-hover:text-[var(--primary)]" style={{letterSpacing: '-0.5px'}}>
                                Nereus
                            </span>
                            <span className="text-[10px] font-semibold text-[var(--foreground-tertiary)] uppercase tracking-wider hidden sm:block" style={{letterSpacing: '1px'}}>
                                Prediction Markets
                            </span>
                        </div>
                    </div>
                    <span className="hidden md:inline-flex text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r from-[rgba(59,130,246,0.15)] to-[rgba(14,165,233,0.15)] border border-[var(--border-accent)] text-[var(--primary-light)]" style={{letterSpacing: '0.5px'}}>
                        BETA
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <ConnectButton />
                </div>
            </nav>
        </header>
    );
}