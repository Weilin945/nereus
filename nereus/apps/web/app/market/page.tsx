"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { storeStore } from "@/store/storeStore";
import { PricePill } from "../../components/market/price-pill";
import { Sparkline } from "../../components/market/sparkline";
import { Separator } from "@workspace/ui/components/separator";
import { Button } from "@workspace/ui/components/button";
import { FlipBuyButton } from "../../components/market/flip-buy-button";
import { Clock, Database, Wallet } from "lucide-react";

function calculatePercentage(value: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((value / total) * 100);
}

const formatDate = (ts: number) => new Date(ts).toLocaleString();

export default function MarketPage() {
	const searchParams = useSearchParams();
	const marketId = searchParams.get("id");
	const { marketList } = storeStore();
	const market = marketList.find((m) => m.address === marketId);

	if (!market) {
		return <div className="p-8 text-center">Market not found.</div>;
	}

	const total = market.yes + market.no;
	const yesPercentage = calculatePercentage(market.yes, total);
	const noPercentage = calculatePercentage(market.no, total);
	const yesFee = market.yesprice ? Number(market.yesprice) / 1e9 : "-";
	const noFee = market.noprice ? Number(market.noprice) / 1e9 : "-";
	const now = Math.floor(Date.now() / 1000);
	const isEnded = market.end_time <= now;

	const handleResolve = () => {
		console.log("Resolve button pressed for market:", marketId);
	};

	return (
		<div className="max-w-3xl mx-auto py-8">
			<div className="space-y-6">
				<div className="flex items-start justify-between">
					<div>
						<h2 className="text-2xl font-bold leading-tight">{market.topic}</h2>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">ID: {market.address.slice(0, 6)}...{market.address.slice(-4)}</span>
						</div>
					</div>
				</div>

				<div className="rounded-lg border bg-card p-4 shadow-sm">
					<div className="mb-4 flex justify-between items-center">
						<span className="text-sm font-medium">Price History</span>
						<div className="flex gap-2">
							<PricePill side="Yes" price={yesPercentage} />
							<PricePill side="No" price={noPercentage} />
						</div>
					</div>
					<Sparkline width={600} height={200} className="w-full" />
				</div>

				<div className="space-y-2">
					<h3 className="font-semibold text-lg">Description</h3>
					<p className="text-muted-foreground leading-relaxed">{market.description}</p>
				</div>

				<Separator />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Clock className="h-4 w-4" /> Start Time
						</div>
						<p className="font-medium">{formatDate(market.start_time)}</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Clock className="h-4 w-4" /> End Time
						</div>
						<p className="font-medium">{formatDate(market.end_time)}</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Wallet className="h-4 w-4" /> Pool Balance
						</div>
						<p className="font-medium">{market.balance / 1e9} USDC</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Database className="h-4 w-4" /> Oracle Config
						</div>
						<p className="font-medium truncate" title={market.oracle_config}>{market.oracle_config}</p>
					</div>
				</div>

				<div className="bg-muted/30 p-4 rounded-lg border space-y-2">
					<h4 className="font-semibold text-sm">Fee Structure</h4>
					<div className="flex justify-between text-sm">
						<span>Yes Position Fee:</span>
						<span className="font-mono">{yesFee} USDC</span>
					</div>
					<div className="flex justify-between text-sm">
						<span>No Position Fee:</span>
						<span className="font-mono">{noFee} USDC</span>
					</div>
				</div>

				<div className="border-t pt-6 flex flex-col gap-4">
					{!isEnded && (
						<div className="flex gap-4">
							<FlipBuyButton
								side="YES"
								price={typeof yesFee === 'number' ? yesFee : 0}
								onConfirm={(amount) => {}}
								className="flex-1 h-12"
							/>
							<FlipBuyButton
								side="NO"
								price={typeof noFee === 'number' ? noFee : 0}
								onConfirm={(amount) => {}}
								className="flex-1 h-12"
							/>
						</div>
					)}
					<Button className="mt-4 w-full" onClick={handleResolve} variant="default">
						Resolve
					</Button>
				</div>
			</div>
		</div>
	);
}
