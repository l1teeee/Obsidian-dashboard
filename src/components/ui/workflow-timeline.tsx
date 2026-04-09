"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Link2, CalendarDays, Send, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WorkflowEntry = {
  step: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  mockup: React.ReactNode;
  button?: { url: string; text: string };
};

/* ── Mockups por paso ─────────────────────────────────────── */

function ConnectMockup() {
  const platforms = [
    { name: "Instagram", handle: "@yourbrand", color: "#e1306c", connected: true,  icon: "IG" },
    { name: "LinkedIn",  handle: "Your Company", color: "#0a66c2", connected: true,  icon: "LI" },
    { name: "Facebook",  handle: "Your Page",    color: "#1877f2", connected: false, icon: "FB" },
  ];
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Connected Accounts</p>
      {platforms.map((p) => (
        <div key={p.name} className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold" style={{ backgroundColor: `${p.color}22`, color: p.color }}>
            {p.icon}
          </div>
          <div className="flex-1">
            <p className="text-[0.72rem] font-semibold text-white/70">{p.name}</p>
            <p className="text-[0.6rem] text-white/30">{p.handle}</p>
          </div>
          {p.connected ? (
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[0.55rem] font-bold text-emerald-400">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Connected
            </span>
          ) : (
            <button className="rounded-full border border-[#d394ff]/25 bg-[#d394ff]/10 px-2.5 py-0.5 text-[0.55rem] font-bold text-[#d394ff]">
              Connect
            </button>
          )}
        </div>
      ))}
      <p className="text-center text-[0.6rem] text-white/20">OAuth-secured · Connects in under 2 minutes</p>
    </div>
  );
}

function PlanMockup() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Post Composer</p>
        <div className="flex gap-1">
          {["IG", "LI", "FB"].map((p, i) => (
            <span key={p} className={`rounded-full px-2 py-0.5 text-[0.5rem] font-bold border ${i < 2 ? "border-[#d394ff]/25 bg-[#d394ff]/10 text-[#d394ff]" : "border-white/[0.06] bg-white/[0.03] text-white/25"}`}>{p}</span>
          ))}
        </div>
      </div>
      {/* Caption editor */}
      <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 space-y-2">
        <div className="h-2 w-4/5 rounded-full bg-white/10" />
        <div className="h-2 w-3/5 rounded-full bg-white/[0.07]" />
        <div className="h-2 w-2/3 rounded-full bg-white/[0.07]" />
        <div className="mt-3 flex gap-2">
          <span className="rounded-full border border-[#d394ff]/20 bg-[#d394ff]/8 px-2 py-0.5 text-[0.5rem] text-[#d394ff]/70">#branding</span>
          <span className="rounded-full border border-[#d394ff]/20 bg-[#d394ff]/8 px-2 py-0.5 text-[0.5rem] text-[#d394ff]/70">#creative</span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[0.5rem] text-white/20">+ AI hashtags</span>
        </div>
      </div>
      {/* Schedule row */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
        <div>
          <p className="text-[0.52rem] text-white/25">Scheduled for</p>
          <p className="text-[0.65rem] font-semibold text-white/65">Wed, Apr 9 · 11:00 AM</p>
        </div>
        <button className="rounded-full bg-[#d394ff] px-3 py-1 text-[0.55rem] font-bold text-[#3a0060]">Schedule</button>
      </div>
    </div>
  );
}

function PublishMockup() {
  const posts = [
    { platform: "IG", title: "Product launch carousel", time: "Today · 9:00 AM",   color: "#e1306c", done: true  },
    { platform: "LI", title: "Q2 industry insights",    time: "Today · 12:30 PM",  color: "#0a66c2", done: true  },
    { platform: "FB", title: "Weekend community poll",  time: "Now publishing...", color: "#1877f2", done: false },
  ];
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Publishing Queue</p>
        <span className="flex items-center gap-1 text-[0.55rem] font-bold text-[#d394ff]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d394ff] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
          </span>
          Auto-publishing
        </span>
      </div>
      {posts.map((p) => (
        <div key={p.title} className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.52rem] font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
            {p.platform}
          </div>
          <div className="flex-1">
            <p className="text-[0.62rem] font-medium text-white/60">{p.title}</p>
            <p className="text-[0.5rem] text-white/25">{p.time}</p>
          </div>
          {p.done ? (
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[0.5rem] font-bold text-emerald-400">✓ Published</span>
          ) : (
            <span className="animate-pulse rounded-full border border-[#d394ff]/20 bg-[#d394ff]/10 px-2 py-0.5 text-[0.5rem] font-bold text-[#d394ff]">Publishing…</span>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-2">
        <p className="text-[0.55rem] text-white/22">Next post in 3h 12min</p>
        <p className="text-[0.55rem] text-white/22">28 posts queued</p>
      </div>
    </div>
  );
}

function AnalyzeMockup() {
  const bars = [42, 68, 51, 88, 61, 95, 74];
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total Reach",  value: "144.3K", delta: "+18.2%" },
          { label: "Engagement",   value: "6.8%",   delta: "+1.4pp" },
          { label: "Top Platform", value: "IG",     delta: "47% share" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
            <p className="mb-1 text-[0.5rem] font-bold uppercase tracking-[0.16em] text-white/25">{m.label}</p>
            <p className="text-[0.95rem] font-bold text-white">{m.value}</p>
            <span className="text-[0.52rem] font-semibold text-[#d394ff]">{m.delta}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.52rem] font-bold uppercase tracking-[0.16em] text-white/25">Weekly Reach · Apr 1–7</p>
          <span className="rounded px-2 py-0.5 text-[0.48rem] font-bold bg-[#d394ff]/15 text-[#d394ff]">7D</span>
        </div>
        <div className="flex h-[72px] items-end gap-1.5">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <div className="rounded-t-[3px] border-t border-[#d394ff]/30 bg-gradient-to-t from-[#d394ff]/60 via-[#d394ff]/20 to-[#d394ff]/5" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <span key={i} className="flex-1 text-center text-[0.4rem] font-bold uppercase text-white/20">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────── */
const workflowEntries: WorkflowEntry[] = [
  {
    step: "01",
    icon: Link2,
    title: "Connect your accounts",
    subtitle: "Setup · 2 minutes",
    description: "Link Instagram, LinkedIn, and Facebook in a single OAuth flow. No API keys, no developer setup — just authorize and you're live.",
    items: [
      "One-click OAuth for all three platforms",
      "Secure token storage — never stored in plaintext",
      "Multiple accounts and workspaces supported",
      "Reconnect or disconnect anytime from Settings",
    ],
    mockup: <ConnectMockup />,
  },
  {
    step: "02",
    icon: CalendarDays,
    title: "Plan and compose your content",
    subtitle: "Content workflow",
    description: "Write once, publish everywhere. The unified composer lets you tailor each post per platform, attach media, pick hashtags, and queue it for the perfect moment.",
    items: [
      "Multi-platform composer with per-channel previews",
      "AI-assisted caption drafting and hashtag suggestions",
      "Media library with DALL-E 3 image generation built in",
      "Drag-and-drop calendar for visual planning",
      "Auto-save drafts so you never lose your work",
    ],
    mockup: <PlanMockup />,
  },
  {
    step: "03",
    icon: Send,
    title: "Publish at exactly the right time",
    subtitle: "Auto-publishing engine",
    description: "Set it and forget it. Vielinks auto-publishes your content on schedule, with AI recommendations for peak engagement windows based on your audience data.",
    items: [
      "Fully automated publishing — no manual action needed",
      "AI best-time engine trained on your historical data",
      "Real-time queue status and push notifications",
      "Failure alerts with automatic retry logic",
    ],
    mockup: <PublishMockup />,
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Analyze and optimize performance",
    subtitle: "Performance intelligence",
    description: "Real-time metrics across every platform. Understand exactly which posts drove the most reach, engagement, and follower growth — then use that data to publish smarter.",
    items: [
      "Cross-platform reach, engagement rate, and impressions",
      "Post-level performance breakdown with benchmark comparison",
      "Best-performing content types and hashtag analytics",
      "Weekly performance report delivered to your inbox",
    ],
    mockup: <AnalyzeMockup />,
  },
];

/* ── Component ────────────────────────────────────────────── */
export interface WorkflowTimelineProps {
  title?: string;
  description?: string;
  entries?: WorkflowEntry[];
}

export default function WorkflowTimeline({
  title = "How Vielinks works",
  description = "From account setup to performance insights — the entire social media workflow in one place.",
  entries = workflowEntries,
}: WorkflowTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setSentinelRef = (el: HTMLDivElement | null, i: number) => {
    sentinelRefs.current[i] = el;
  };

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const centerY = window.innerHeight / 2.6;
      let bestIndex = 0;
      let bestDist = Infinity;
      sentinelRefs.current.forEach((node, i) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - centerY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      });
      setActiveIndex(bestIndex);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* Ambient */}
      <div className="pointer-events-none absolute left-[5%] top-32 h-80 w-80 rounded-full bg-[#d394ff]/[0.04] blur-[110px]" />
      <div className="pointer-events-none absolute bottom-24 right-[4%] h-64 w-64 rounded-full bg-[#aa30fa]/[0.04] blur-[100px]" />

      {/* Border top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d394ff]/12 to-transparent" />

      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d394ff]/20 bg-[#d394ff]/[0.07] px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#d394ff]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d394ff]" />
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] leading-[0.96] text-white md:text-5xl">
            {title.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="bg-gradient-to-r from-[#d394ff] via-[#f0dcff] to-[#c97cff] bg-clip-text text-transparent">
              {title.split(" ").slice(-2).join(" ")}
            </span>
          </h2>
          <p className="mt-5 text-[1rem] font-light leading-[1.8] text-white/45 max-w-lg">
            {description}
          </p>
        </div>

        {/* Timeline entries */}
        <div className="space-y-24 md:space-y-32">
          {entries.map((entry, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                className="relative flex flex-col gap-8 md:flex-row md:gap-14"
                aria-current={isActive ? "true" : "false"}
              >
                {/* Sentinel */}
                <div
                  ref={(el) => setSentinelRef(el, index)}
                  aria-hidden
                  className="absolute -top-20 left-0 h-10 w-10 opacity-0 pointer-events-none"
                />

                {/* ── Left: step meta ── */}
                <div className="md:sticky md:top-32 flex md:w-[220px] shrink-0 flex-col gap-4 h-min">
                  {/* Step number + connector */}
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl border font-bold text-xs transition-all duration-500",
                      isActive
                        ? "border-[#d394ff]/40 bg-[#d394ff]/15 text-[#d394ff] shadow-[0_0_20px_rgba(211,148,255,0.2)]"
                        : "border-white/[0.08] bg-white/[0.02] text-white/25"
                    )}>
                      {entry.step}
                    </div>
                    {/* Line to next step (not on last) */}
                    {index < entries.length - 1 && (
                      <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500",
                    isActive
                      ? "border-[#d394ff]/30 bg-[#d394ff]/12 text-[#d394ff]"
                      : "border-white/[0.07] bg-white/[0.02] text-white/20"
                  )}>
                    <entry.icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className={cn(
                      "text-sm font-bold transition-colors duration-300",
                      isActive ? "text-white" : "text-white/35"
                    )}>
                      {entry.title}
                    </p>
                    <p className={cn(
                      "mt-0.5 text-[0.68rem] transition-colors duration-300",
                      isActive ? "text-[#d394ff]/70" : "text-white/20"
                    )}>
                      {entry.subtitle}
                    </p>
                  </div>
                </div>

                {/* ── Right: content card ── */}
                <article className={cn(
                  "flex-1 flex flex-col rounded-[1.75rem] border transition-all duration-500 overflow-hidden",
                  isActive
                    ? "border-[#d394ff]/18 bg-[#141414]/90 shadow-[0_20px_80px_rgba(0,0,0,0.4),0_0_0_1px_rgba(211,148,255,0.05)]"
                    : "border-white/[0.06] bg-[#0f0f0f]/60"
                )}>
                  {/* Top sheen */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

                  {/* Mockup preview */}
                  <div className={cn(
                    "overflow-hidden transition-all duration-500",
                    isActive ? "max-h-[400px] p-6 pb-0 opacity-100" : "max-h-0 opacity-0 p-0"
                  )}>
                    {entry.mockup}
                  </div>

                  {/* Text content */}
                  <div className="p-6 md:p-8 space-y-5">
                    <div>
                      <h3 className={cn(
                        "text-lg font-bold leading-snug tracking-tight transition-colors duration-300 mb-2",
                        isActive ? "text-white" : "text-white/50"
                      )}>
                        {entry.title}
                      </h3>
                      <p className={cn(
                        "text-[0.9rem] leading-[1.75] transition-all duration-300",
                        isActive ? "text-white/55 line-clamp-none" : "text-white/30 line-clamp-2"
                      )}>
                        {entry.description}
                      </p>
                    </div>

                    {/* Expandable items */}
                    <div
                      aria-hidden={!isActive}
                      className={cn(
                        "grid transition-all duration-500 ease-out",
                        isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="space-y-4 pt-1">
                          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
                            <ul className="space-y-2.5">
                              {entry.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-[0.85rem] text-white/50">
                                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d394ff]/50" />
                                  <span className="leading-relaxed">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {entry.button && (
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm" asChild className="group font-medium">
                                <a href={entry.button.url} target="_blank" rel="noreferrer">
                                  {entry.button.text}
                                  <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vertical timeline line */}
      <div className="pointer-events-none absolute left-1/2 top-[280px] hidden -translate-x-1/2 w-px h-[calc(100%-380px)] bg-gradient-to-b from-transparent via-[#d394ff]/10 to-transparent md:block" />
    </section>
  );
}
