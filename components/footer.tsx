import NereusLogo from "./nereus-logo";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className="border-t border-[var(--border-subtle)] mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <NereusLogo size="md" />
                            <span className="text-xl font-bold text-[var(--primary-light)] tracking-tight">
                                Nereus
                            </span>
                        </div>
                        <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed max-w-md mb-4">
                            Professional prediction markets platform powered by decentralized technology. 
                            Trade on future events with transparency and security.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="text-[var(--foreground-tertiary)] hover:text-[var(--primary-light)] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                            </a>
                            <a href="#" className="text-[var(--foreground-tertiary)] hover:text-[var(--primary-light)] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                            <a href="#" className="text-[var(--foreground-tertiary)] hover:text-[var(--primary-light)] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                            </a>
                        </div>
                    </div>
                    
                    {/* Product Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider" style={{letterSpacing: '1px'}}>
                            Product
                        </h3>
                        <ul className="space-y-2.5">
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">Markets</a></li>
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">Portfolio</a></li>
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">Leaderboard</a></li>
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">Analytics</a></li>
                        </ul>
                    </div>
                    
                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider" style={{letterSpacing: '1px'}}>
                            Company
                        </h3>
                        <ul className="space-y-2.5">
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">About</a></li>
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">Blog</a></li>
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">Careers</a></li>
                            <li><a href="#" className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--primary-light)] transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-[var(--foreground-tertiary)]">
                        © {currentYear} Nereus Markets. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-sm text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)] transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)] transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-sm text-[var(--foreground-tertiary)] hover:text-[var(--foreground-secondary)] transition-colors">
                            Documentation
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
