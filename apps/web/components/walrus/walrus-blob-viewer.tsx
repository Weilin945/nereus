"use client";

import * as React from "react";
import { ChevronDown, FileCode2, FileText, ExternalLink } from "lucide-react";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { getFullnodeUrl } from "@mysten/sui/client";
import { walrus } from "@mysten/walrus";
import { Highlight, themes, type Language } from "prism-react-renderer";

type Network = "testnet" | "mainnet" | "devnet";

type BlobKind = "code-snippet" | "ai-resolution" | "unknown";

interface WalrusBlobViewerProps {
  blobId: string;
  network?: Network;
  className?: string;
}

interface ParsedBlobState {
  kind: BlobKind;
  rawText: string;
  filename?: string;
  timestamp?: string;
  // code
  code?: string;
  language?: Language;
  // resolution
  title?: string;
  prompt?: string;
}

function buildWalruscanUrl(blobId: string, network: Network): string {
  const path = network === "mainnet" ? "mainnet" : network;
  return `https://walruscan.com/${path}/blob/${blobId}`;
}

function detectLanguage(filename?: string, code?: string): Language {
  if (filename?.endsWith(".ts") || filename?.endsWith(".tsx")) return "tsx";
  if (filename?.endsWith(".js") || filename?.endsWith(".jsx")) return "jsx";
  if (filename?.endsWith(".py")) return "python";
  if (filename?.endsWith(".json")) return "json";

  if (code?.includes("import requests") || code?.includes("def ")) {
    return "python";
  }

  return "tsx";
}

export const WalrusBlobViewer: React.FC<WalrusBlobViewerProps> = ({
  blobId,
  network = "testnet",
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<ParsedBlobState | null>(null);

  const walrusClient = React.useMemo(
    () =>
      new SuiJsonRpcClient({
        url: getFullnodeUrl(network),
        network,
      }).$extend(
        walrus({
          // If you need wasmUrl or custom fetch, configure here.
        }),
      ),
    [network],
  );

  React.useEffect(() => {
    if (!isOpen || !blobId) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const [file] = await walrusClient.walrus.getFiles({ ids: [blobId] });
        const text = await file.text();

        if (cancelled) return;

        let parsed: any | null = null;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = null;
        }

        const state: ParsedBlobState = {
          kind: "unknown",
          rawText: text,
        };

        if (parsed && typeof parsed === "object") {
          const type = parsed.type as string | undefined;

          // code snippet
          if (type === "code-snippet" || typeof parsed.code === "string") {
            const filename =
              typeof parsed.filename === "string" ? parsed.filename : undefined;
            const language = detectLanguage(filename, parsed.code);

            state.kind = "code-snippet";
            state.filename = filename;
            state.timestamp =
              typeof parsed.timestamp === "string"
                ? parsed.timestamp
                : undefined;
            state.code = parsed.code ?? text;
            state.language = language;
          }
          // ai-resolution meta
          else if (
            type === "ai-resolution" ||
            (typeof parsed.title === "string" &&
              typeof parsed.prompt === "string")
          ) {
            state.kind = "ai-resolution";
            state.title =
              typeof parsed.title === "string" ? parsed.title : undefined;
            state.prompt =
              typeof parsed.prompt === "string" ? parsed.prompt : text;
            state.timestamp =
              typeof parsed.timestamp === "string"
                ? parsed.timestamp
                : undefined;
          }
        }

        setData(state);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? String(e));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [blobId, walrusClient, isOpen]);

  const walruscanUrl = buildWalruscanUrl(blobId, network);
  const kind = data?.kind ?? "unknown";

  return (
    <div
      className={`rounded-lg border bg-card shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          {kind === "code-snippet" ? (
            <FileCode2 className="h-4 w-4 text-primary" />
          ) : (
            <FileText className="h-4 w-4 text-primary" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              Oracle Blob Viewer
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              {blobId.slice(0, 10)}...{blobId.slice(-6)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {kind === "code-snippet" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Code
            </span>
          )}
          {kind === "ai-resolution" && (
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
              Resolution
            </span>
          )}
          <a
            href={walruscanUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted transition-colors"
          >
            <span>Walruscan</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Body */}
      <div
        className={`transition-[max-height,opacity] duration-200 ease-in-out ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="border-t px-4 py-3 text-sm">
          {loading && (
            <div className="animate-pulse space-y-2 text-muted-foreground">
              <div className="h-3 w-1/3 rounded bg-muted" />
              <div className="h-3 w-2/3 rounded bg-muted" />
              <div className="h-3 w-1/2 rounded bg-muted" />
            </div>
          )}

          {!loading && error && (
            <div className="text-xs text-red-500">
              Failed to load blob: {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* Code snippet */}
              {data.kind === "code-snippet" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {data.filename && (
                        <span className="font-mono">
                          {data.filename}
                        </span>
                      )}
                    </div>
                    {data.timestamp && (
                      <span>
                        {new Date(data.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="rounded-md bg-muted/70 p-2 text-xs overflow-auto max-h-[420px]">
                    <Highlight
                      theme={themes.vsDark}
                      code={data.code ?? data.rawText}
                      language={data.language ?? "tsx"}
                    >
                      {({ className: hClassName, style, tokens, getLineProps, getTokenProps }) => (
                        <pre
                          className={`${hClassName} text-xs leading-relaxed`}
                          style={style}
                        >
                          {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line, key: i })}>
                              {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token, key })} />
                              ))}
                            </div>
                          ))}
                        </pre>
                      )}
                    </Highlight>
                  </div>
                </div>
              )}

              {/* AI resolution */}
              {data.kind === "ai-resolution" && (
                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    {data.title && (
                      <h4 className="text-sm font-semibold">
                        {data.title}
                      </h4>
                    )}
                    {data.timestamp && (
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(data.timestamp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="rounded-md bg-muted/60 p-3 text-xs leading-relaxed whitespace-pre-wrap">
                    {data.prompt ?? data.rawText}
                  </div>
                  <details className="mt-2 text-[11px] text-muted-foreground">
                    <summary className="cursor-pointer">
                      View raw JSON
                    </summary>
                    <pre className="mt-1 max-h-60 overflow-auto rounded bg-background/80 p-2 text-[11px]">
                      {data.rawText}
                    </pre>
                  </details>
                </div>
              )}

              {/* Fallback: unknown */}
              {data.kind === "unknown" && (
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">
                    Unrecognized blob format, showing raw text:
                  </p>
                  <pre className="max-h-72 overflow-auto rounded bg-muted/60 p-2 whitespace-pre-wrap">
                    {data.rawText}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
