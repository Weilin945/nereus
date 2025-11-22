// app/page.tsx
import { ArrowUpRight, Brain, Code2, Shield, Sparkles, Waves } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@workspace/ui/components/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs";
import Image from 'next/image';
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <HeroSection />
      <FeatureStrip />
      <HowItWorks />
      <ResolutionModes />
      <WhySection />
      <FaqSection />
      <FooterDots />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src="/nereus_compress.gif"
        alt="Nereus Hero Animation"
        fill
        className="object-cover opacity-70"
        priority
        unoptimized
      />

      {/* Dark / gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/95" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 pb-32 pt-6 md:px-10 md:pb-40">
        {/* Top nav */}
        <header className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
              <Image
                src="/nereus_logo.png"
                alt="Nereus Logo"
                width={40}
                height={40}
              />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold tracking-tight">Nereus</span>
              <span className="text-xs text-slate-300/80">
                Ocean-native Prediction Markets
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-200/80 md:flex">
            <a href="#features" className="transition hover:text-sky-300">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-sky-300">
              How it works
            </a>
            <a href="#resolution" className="transition hover:text-sky-300">
              Resolution
            </a>
            <a href="#faq" className="transition hover:text-sky-300">
              FAQ
            </a>
            <Button
              size="sm"
              variant="outline"
              className="border-sky-400/70 bg-slate-950/40 text-sky-50 hover:bg-sky-500/10"
            >
              Docs
            </Button>
            <Button
              size="sm"
              className="bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/40 hover:bg-sky-400"
            >
              <Link href="/main">
                Launch App
              </Link>
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Button>
          </nav>
        </header>

        {/* Hero main content */}
        <div className="mt-10 flex flex-1 flex-col gap-10 md:flex-row md:items-center md:gap-12">
          {/* Left: copy */}
          <div className="max-w-xl space-y-6">
            <Badge className="border-sky-400/60 bg-slate-900/60 text-xs font-medium text-sky-100 backdrop-blur">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live on-chain in seconds
            </Badge>

            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-50 drop-shadow-sm sm:text-5xl md:text-6xl">
              Prediction Markets,
              <span className="block text-sky-300">Truly Decentralized.</span>
            </h1>

            <p className="max-w-lg text-sm text-slate-200/85 sm:text-base">
              Nereus turns every opinion into liquid positions. Trade event
              outcomes, earn yield while you bet, and let AI & code-native
              oracles resolve markets without trusting a single operator.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button className="h-11 rounded-full bg-sky-500 px-7 text-sm font-semibold text-slate-950 shadow-xl shadow-sky-500/40 hover:bg-sky-400">
                <Link href="/main">
                  Launch App
                </Link>
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-full border-slate-600/80 bg-slate-900/70 px-6 text-sm text-slate-100 hover:bg-slate-800"
              >
                View protocol design
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-xs text-slate-300/80">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-medium text-slate-100">
                    Yield when you bet
                  </div>
                  <div>Idle liquidity earns fees & on-chain yield.</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/15">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-medium text-slate-100">
                    Collateral always on-chain
                  </div>
                  <div>No custodial pools. Fully auditable.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-900/80 p-3 ring-1 ring-slate-700/70">
      <div className="text-[11px] text-slate-300/80">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-50">{value}</div>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] text-slate-300/80">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function FeatureStrip() {
  const features = [
    {
      title: "Generate yield when you bet",
      description:
        "LP shares earn trading fees and external yield sources while your positions stay live.",
      icon: Sparkles,
    },
    {
      title: "AI resolution",
      description:
        "LLM-based agents read data, transcripts and oracles, then output verifiable resolution proofs.",
      icon: Brain,
    },
    {
      title: "Code resolution",
      description:
        "Fully deterministic markets that resolve directly from on-chain state and contracts.",
      icon: Code2,
    },
  ];

  return (
    <section
      id="features"
      className="bg-slate-950 pt-16 pb-20 md:pt-24 md:pb-24"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group relative flex flex-col rounded-[26px] border-slate-800/80 bg-slate-900/80 shadow-[0_18px_45px_rgba(15,23,42,0.75)] backdrop-blur-lg transition hover:-translate-y-1.5 hover:border-sky-500/60 hover:bg-slate-900"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[26px] bg-gradient-to-b from-sky-500/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <CardHeader className="relative space-y-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/40">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <CardTitle className="text-base">{f.title}</CardTitle>
                <CardDescription className="text-xs text-slate-300/90">
                  {f.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Create a market",
      body: "Define the question, outcomes and resolution criteria. Choose between AI, code, or hybrid resolution.",
    },
    {
      title: "Provide liquidity or trade",
      body: "LPs seed the pool and earn fees. Traders buy YES/NO shares at LMSR-driven prices.",
    },
    {
      title: "Resolve and settle",
      body: "Resolution engines submit proofs on-chain. Payouts are instantly distributed from the pool.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-t border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950/95 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md space-y-3">
            <Badge className="bg-sky-500/20 text-xs text-sky-200">
              How Nereus works
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              A three-phase flow,
              <span className="block text-sky-300">
                built for deep liquidity.
              </span>
            </h2>
            <p className="text-sm text-slate-200/85">
              Every market is an isolated ocean pool: configurable curves,
              collateral, and resolution. The protocol never takes custody of
              user funds outside the contracts that back your positions.
            </p>
          </div>

          <div className="grid gap-4 md:w-[52%]">
            {steps.map((s, idx) => (
              <div
                key={s.title}
                className="relative flex gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 backdrop-blur"
              >
                <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/20 text-xs font-semibold text-sky-200">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-50">
                    {s.title}
                  </div>
                  <p className="text-xs text-slate-300/90">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResolutionModes() {
  return (
    <section
      id="resolution"
      className="border-t border-slate-900 bg-slate-950 py-16 md:py-20"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge className="bg-emerald-500/20 text-xs text-emerald-200">
              Resolution layer
            </Badge>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              AI, code or human committees.
              <span className="block text-sky-300">
                Pick the right oracle for each ocean.
              </span>
            </h2>
            <p className="max-w-md text-sm text-slate-200/85">
              Nereus lets creators mix resolution engines: deterministic
              on-chain checks, AI-assisted judgments and multisig councils. Each
              engine ships with explicit on-chain SLAs and escape hatches.
            </p>
          </div>

          <Tabs defaultValue="ai" className="mt-3 w-full max-w-md md:mt-0">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/80">
              <TabsTrigger value="ai" className="text-xs">
                AI
              </TabsTrigger>
              <TabsTrigger value="code" className="text-xs">
                Code
              </TabsTrigger>
              <TabsTrigger value="hybrid" className="text-xs">
                Hybrid
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="mt-4">
              <Card className="border-slate-800/80 bg-slate-900/80">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-100">
                      <Brain className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">
                      AI Resolution Agents
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-300/90">
                    LLMs read structured data, transcripts and market criteria
                    to output resolution proofs. Every step is logged and
                    auditable.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="mt-4">
              <Card className="border-slate-800/80 bg-slate-900/80">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-100">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">
                      Code-native Resolution
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-300/90">
                    Markets that resolve purely from chain state: prices,
                    oracle feeds and contract calls. Zero interpretation, fully
                    reproducible.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="hybrid" className="mt-4">
              <Card className="border-slate-800/80 bg-slate-900/80">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-indigo-500/25 text-indigo-100">
                      <Shield className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-sm">
                      Hybrid & Committees
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs text-slate-300/90">
                    AI suggests a resolution, code validates the inputs, and a
                    human committee signs off only when needed. Defense in
                    depth for high-stakes markets.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="border-t border-slate-900 bg-gradient-to-b from-slate-950 to-slate-950 py-16 md:py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 md:flex-row md:px-10">
        <div className="max-w-md space-y-3">
          <Badge className="bg-sky-500/20 text-xs text-sky-200">
            Built like an ocean
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Liquidity that feels like a deep sea,
            <span className="block text-sky-300">
              not a shallow prediction pool.
            </span>
          </h2>
          <p className="text-sm text-slate-200/85">
            Orderbooks fragment liquidity across pairs. Nereus uses curve-based
            pools and cross-market collateral to concentrate depth where it
            matters: around the current belief.
          </p>
        </div>

        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <MiniMetric
            icon={Waves}
            label="Continuous prices"
            value="LMSR-style curves with bounded loss for LPs."
          />
          <MiniMetric
            icon={Sparkles}
            label="Composable collateral"
            value="Bring your yield-bearing assets as backing collateral."
          />
          <MiniMetric
            icon={Activity}
            label="Latency-tolerant"
            value="Designed for oracle delays & chain finality."
          />
          <MiniMetric
            icon={Shield}
            label="Guardrails"
            value="Circuit breakers & dispute windows on every market."
          />
        </div>
      </div>
    </section>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Waves;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 text-xs backdrop-blur">
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/15 text-sky-200">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="font-semibold text-slate-50">{label}</div>
        <p className="mt-1 text-slate-300/90">{value}</p>
      </div>
    </div>
  );
}

function FaqSection() {
  return (
    <section
      id="faq"
      className="border-t border-slate-900 bg-slate-950 pb-16 pt-14"
    >
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <div className="mb-6 space-y-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
            FAQ
          </h2>
          <p className="text-xs text-slate-300/85">
            A quick overview of how Nereus behaves under the surface.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="1" className="border-slate-800">
            <AccordionTrigger className="text-sm">
              Is Nereus non-custodial?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-300/90">
              Yes. All collateral lives in smart contracts that back open
              positions and liquidity shares. There is no off-chain custody
              layer that can pause withdrawals or move funds without on-chain
              approval.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="2" className="border-slate-800">
            <AccordionTrigger className="text-sm">
              What assets can I use as collateral?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-300/90">
              The protocol is designed to support stablecoins and yield-bearing
              tokens as collateral. Each deployment whitelists assets that have
              sufficient liquidity, oracle coverage and risk parameters.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="3" className="border-slate-800">
            <AccordionTrigger className="text-sm">
              How are AI resolutions kept in check?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-slate-300/90">
              AI agents run inside deterministic pipelines with full logs.
              Markets define escalation paths: if the AI output is contested,
              a committee or on-chain vote can override it within a fixed
              dispute window.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

function FooterDots() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 md:px-10">
        <span className="text-xs text-slate-500">
          © {new Date().getFullYear()} Nereus. All rights reserved.
        </span>
        <div className="flex items-center gap-3">
          <span className="sr-only">Pagination dots</span>
          <span className="h-4 w-4 rounded-full bg-slate-700"></span>
          <span className="h-4 w-4 rounded-full bg-slate-700"></span>
          <span className="h-4 w-4 rounded-full bg-slate-700"></span>
        </div>
      </div>
    </footer>
  );
}

function Activity(props: React.SVGProps<SVGSVGElement>) {
  return <Shield {...props} />; // placeholder if you don't import Activity from lucide-react
}
