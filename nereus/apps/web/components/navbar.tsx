"use client"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { Separator } from "@workspace/ui/components/separator"
import { NereusLogo } from "./branding"
import { SearchInput } from "./search-input"
import { ConnectButton } from "@mysten/dapp-kit"
import { useRouter } from "next/navigation"
export function Navbar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="cursor-pointer bg-transparent border-none p-0"
          aria-label="Home"
        >
          <NereusLogo className="cursor-pointer" />
        </button>
        <Separator orientation="vertical" className="mx-1 hidden sm:block" />
        <div className="flex-1">
          <SearchInput />
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" size="sm">Leaderboard</Button>
          <Button variant="ghost" size="sm">Referral</Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/create">Create</Link>
          </Button>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
