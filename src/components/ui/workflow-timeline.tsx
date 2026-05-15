"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Send, BarChart3, CheckCircle2, FileText } from "lucide-react";
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

function PlanMockup() {
  return (
    <div className="rounded-2xl border border-[#E7E0D0] bg-[#FFFFFF] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#15140F]/30">Post Composer</p>
        <div className="flex gap-1">
          {["IG", "LI", "FB"].map((p, i) => (
            <span key={p} className={`rounded-full px-2 py-0.5 text-[0.5rem] font-bold border ${i < 2 ? "border-[#C8553A]/25 bg-[#C8553A]/10 text-[#C8553A]" : "border-[#E7E0D0] bg-[#FBF8F2] text-[#A39B8B]"}`}>{p}</span>
          ))}
        </div>
      </div>
      {/* Caption editor */}
      <div className="rounded-xl border border-[#E7E0D0] bg-[#FFFFFF] p-3 space-y-2">
        <div className="h-2 w-4/5 rounded-full bg-[#E7E0D0]" />
        <div className="h-2 w-3/5 rounded-full bg-[#E7E0D0]/70" />
        <div className="h-2 w-2/3 rounded-full bg-[#E7E0D0]/70" />
        <div className="mt-3 flex gap-2">
          <span className="rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-2 py-0.5 text-[0.5rem] text-[#C8553A]/70">#branding</span>
          <span className="rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-2 py-0.5 text-[0.5rem] text-[#C8553A]/70">#creative</span>
          <span className="rounded-full border border-[#E7E0D0] bg-[#FBF8F2] px-2 py-0.5 text-[0.5rem] text-[#15140F]/20">+ AI hashtags</span>
        </div>
      </div>
      {/* Schedule row */}
      <div className="flex items-center justify-between rounded-xl border border-[#E7E0D0] bg-[#FBF8F2] px-3 py-2.5">
        <div>
          <p className="text-[0.52rem] text-[#15140F]/25">Scheduled for</p>
          <p className="text-[0.65rem] font-semibold text-[#15140F]/65">Wed, Apr 9 · 11:00 AM</p>
        </div>
        <button className="rounded-full bg-[#C8553A] px-3 py-1 text-[0.55rem] font-bold text-white">Schedule</button>
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
    <div className="rounded-2xl border border-[#E7E0D0] bg-[#FFFFFF] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#15140F]/30">Publishing Queue</p>
        <span className="flex items-center gap-1 text-[0.55rem] font-bold text-[#C8553A]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8553A] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
          </span>
          Auto-publishing
        </span>
      </div>
      {posts.map((p) => (
        <div key={p.title} className="flex items-center gap-3 rounded-xl border border-[#E7E0D0] bg-[#FBF8F2] px-3 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.52rem] font-bold" style={{ backgroundColor: `${p.color}20`, color: p.color }}>
            {p.platform}
          </div>
          <div className="flex-1">
            <p className="text-[0.62rem] font-medium text-[#15140F]/60">{p.title}</p>
            <p className="text-[0.5rem] text-[#15140F]/25">{p.time}</p>
          </div>
          {p.done ? (
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[0.5rem] font-bold text-emerald-400">✓ Published</span>
          ) : (
            <span className="animate-pulse rounded-full border border-[#C8553A]/20 bg-[#C8553A]/10 px-2 py-0.5 text-[0.5rem] font-bold text-[#C8553A]">Publishing…</span>
          )}
        </div>
      ))}
      <div className="flex items-center justify-between rounded-lg border border-[#E7E0D0] bg-[#FBF8F2] px-3 py-2">
        <p className="text-[0.55rem] text-[#15140F]/22">Next post in 3h 12min</p>
        <p className="text-[0.55rem] text-[#15140F]/22">28 posts queued</p>
      </div>
    </div>
  );
}

function DraftMockup() {
  return (
    <div className="rounded-2xl border border-[#E7E0D0] bg-[#FFFFFF] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#15140F]/30">Post Composer</p>
        <div className="flex gap-1">
          {["IG", "LI", "FB"].map((p, i) => (
            <span key={p} className={`rounded-full px-2 py-0.5 text-[0.5rem] font-bold border ${i < 2 ? "border-[#C8553A]/25 bg-[#C8553A]/10 text-[#C8553A]" : "border-[#E7E0D0] bg-[#FBF8F2] text-[#A39B8B]"}`}>{p}</span>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-[#E7E0D0] bg-[#FFFFFF] p-3 space-y-2">
        <p className="text-[0.6rem] font-bold text-[#15140F]/40 mb-2">Caption</p>
        <div className="h-2 w-11/12 rounded-full bg-[#E7E0D0]" />
        <div className="h-2 w-9/12 rounded-full bg-[#E7E0D0]/70" />
        <div className="h-2 w-8/12 rounded-full bg-[#E7E0D0]/70" />
        <div className="mt-3 flex gap-2">
          <span className="rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-2 py-0.5 text-[0.5rem] text-[#C8553A]/70">#branding</span>
          <span className="rounded-full border border-[#C8553A]/20 bg-[#C8553A]/8 px-2 py-0.5 text-[0.5rem] text-[#C8553A]/70">#creative</span>
          <span className="rounded-full border border-[#E7E0D0] bg-[#FBF8F2] px-2 py-0.5 text-[0.5rem] text-[#15140F]/20">+ AI hashtags</span>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-[#C8553A]/15 bg-[#C8553A]/5 px-3 py-2.5">
        <svg className="h-3.5 w-3.5 text-[#C8553A]/70 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <p className="text-[0.58rem] text-[#15140F]/50">AI suggests: <span className="text-[#C8553A]/80">Tuesday 9–11 AM gets 2.3x more reach</span></p>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-[#E7E0D0] bg-[#FBF8F2] px-3 py-2.5">
        <div>
          <p className="text-[0.52rem] text-[#15140F]/25">Scheduled for</p>
          <p className="text-[0.65rem] font-semibold text-[#15140F]/65">Wed, Apr 9 · 11:00 AM</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full border border-[#A53F28]/25 bg-[#A53F28]/10 px-3 py-1 text-[0.55rem] font-bold text-[#A53F28]">Send for review</button>
        </div>
      </div>
    </div>
  );
}

function ApproveMockup() {
  const items = [
    { title: "Product launch carousel", platform: "IG", color: "#e1306c", status: "approved", time: "Approved 2h ago" },
    { title: "Q2 industry insights", platform: "LI", color: "#0a66c2", status: "pending", time: "Waiting on review" },
    { title: "Community poll", platform: "FB", color: "#1877f2", status: "review", time: "Changes requested" },
  ];
  const badge = (status: string) => {
    if (status === "approved") return <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[0.5rem] font-bold text-emerald-400">✓ Approved</span>;
    if (status === "pending")  return <span className="rounded-full border border-[#A53F28]/20 bg-[#A53F28]/10 px-2 py-0.5 text-[0.5rem] font-bold text-[#A53F28]">Pending</span>;
    return <span className="rounded-full border border-[#E7E0D0] bg-[#FBF8F2] px-2 py-0.5 text-[0.5rem] font-bold text-[#A39B8B]">Review</span>;
  };
  return (
    <div className="rounded-2xl border border-[#E7E0D0] bg-[#FFFFFF] p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#15140F]/30">Approval Queue</p>
        <span className="flex items-center gap-1 rounded-full border border-[#A53F28]/20 bg-[#A53F28]/10 px-2 py-0.5 text-[0.5rem] font-bold text-[#A53F28]">2 pending</span>
      </div>
      {items.map((item) => (
        <div key={item.title} className="flex items-center gap-3 rounded-xl border border-[#E7E0D0] bg-[#FBF8F2] px-3 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[0.45rem] font-bold"
            style={{ backgroundColor: item.color + "22", color: item.color }}>
            {item.platform}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[0.62rem] font-medium text-[#15140F]/60">{item.title}</p>
            <p className="text-[0.5rem] text-[#15140F]/25">{item.time}</p>
          </div>
          {badge(item.status)}
        </div>
      ))}
      <p className="text-center text-[0.58rem] text-[#15140F]/20">Posts go to queue only after approval</p>
    </div>
  );
}

function AnalyzeMockup() {
  const bars = [42, 68, 51, 88, 61, 95, 74];
  return (
    <div className="rounded-2xl border border-[#E7E0D0] bg-[#FFFFFF] p-5 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Total Reach",  value: "144.3K", delta: "+18.2%" },
          { label: "Engagement",   value: "6.8%",   delta: "+1.4pp" },
          { label: "Top Platform", value: "IG",     delta: "47% share" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-[#E7E0D0] bg-[#FBF8F2] p-3">
            <p className="mb-1 text-[0.5rem] font-bold uppercase tracking-[0.16em] text-[#15140F]/25">{m.label}</p>
            <p className="text-[0.95rem] font-bold text-[#15140F]">{m.value}</p>
            <span className="text-[0.52rem] font-semibold text-[#C8553A]">{m.delta}</span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-[#E7E0D0] bg-[#FBF8F2] p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[0.52rem] font-bold uppercase tracking-[0.16em] text-[#15140F]/25">Weekly Reach · Apr 1–7</p>
          <span className="rounded px-2 py-0.5 text-[0.48rem] font-bold bg-[#C8553A]/15 text-[#C8553A]">7D</span>
        </div>
        <div className="flex h-[72px] items-end gap-1.5">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col justify-end">
              <div className="rounded-t-[3px] border-t border-[#C8553A]/30 bg-[#C8553A]/45" style={{ height: `${h}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <span key={i} className="flex-1 text-center text-[0.4rem] font-bold uppercase text-[#15140F]/20">{d}</span>
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
    icon: CalendarDays,
    title: "Plan your content calendar",
    subtitle: "Content planning",
    description: "Map out your entire content strategy in a unified calendar. See every scheduled post across Instagram, LinkedIn, and Facebook in one place before anything goes live.",
    items: [
      "Drag-and-drop calendar for visual content planning",
      "Multi-platform view: IG, LI, FB in one grid",
      "Spot gaps and conflicts before they happen",
      "Team-shared workspace — everyone sees the same plan",
    ],
    mockup: <PlanMockup />,
  },
  {
    step: "02",
    icon: FileText,
    title: "Draft with AI assistance",
    subtitle: "Composer + AI",
    description: "Write once, adapt per platform. The composer tailors each post to the channel, suggests captions, hashtags, and recommends the best time to publish based on your audience data.",
    items: [
      "AI-assisted caption drafting and hashtag suggestions",
      "Per-platform preview before submitting for review",
      "Best-time engine trained on your historical data",
      "Auto-save drafts — never lose work in progress",
    ],
    mockup: <DraftMockup />,
  },
  {
    step: "03",
    icon: CheckCircle2,
    title: "Approve before it goes live",
    subtitle: "Team approvals",
    description: "Nothing publishes without sign-off. Route content through your team for review, collect feedback, and keep full control over what goes out on each platform.",
    items: [
      "Approval workflow with role-based permissions",
      "Comment and request changes inline",
      "Posts only queue after explicit approval",
      "Full audit trail of who approved what and when",
    ],
    mockup: <ApproveMockup />,
  },
  {
    step: "04",
    icon: Send,
    title: "Publish at the right time",
    subtitle: "Auto-publishing engine",
    description: "Set it and forget it. Vielinks auto-publishes approved content on schedule, with real-time queue status and automatic retry on failure.",
    items: [
      "Fully automated publishing — no manual action needed",
      "Real-time queue status and push notifications",
      "Failure alerts with automatic retry logic",
      "OAuth-secured — tokens never stored in plaintext",
    ],
    mockup: <PublishMockup />,
  },
  {
    step: "05",
    icon: BarChart3,
    title: "Report on what worked",
    subtitle: "Performance intelligence",
    description: "Real-time metrics across Instagram, LinkedIn, and Facebook. Know exactly which posts drove reach and engagement — then use that data to plan the next cycle smarter.",
    items: [
      "Cross-platform reach, engagement rate, and impressions",
      "Post-level performance with benchmark comparison",
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
  title = "Plan. Draft. Approve. Publish. Report.",
  description = "The complete editorial workflow for Instagram, LinkedIn, and Facebook — from first idea to performance insight.",
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
      <div className="pointer-events-none absolute left-[5%] top-32 h-80 w-80 rounded-full bg-[#C8553A]/6 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-24 right-[4%] h-64 w-64 rounded-full bg-[#A53F28]/6 blur-[100px]" />

      {/* Border top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8553A]/20 to-transparent" />

      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        {/* Header */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C8553A]/25 bg-[#C8553A]/10 px-4 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#C8553A]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C8553A]" />
            How It Works
          </span>
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] leading-[1.1] text-[#15140F] md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 text-[1rem] font-light leading-[1.8] text-[#15140F]/45 max-w-lg">
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
                        ? "border-[#C8553A]/40 bg-[#C8553A]/15 text-[#C8553A] shadow-[0_0_20px_rgba(200,85,58,0.2)]"
                        : "border-[#E7E0D0] bg-[#FBF8F2] text-[#A39B8B]"
                    )}>
                      {entry.step}
                    </div>
                    {/* Line to next step (not on last) */}
                    {index < entries.length - 1 && (
                      <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-[#E7E0D0] to-transparent" />
                    )}
                  </div>

                  {/* Icon */}
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-500",
                    isActive
                      ? "border-[#C8553A]/30 bg-[#C8553A]/12 text-[#C8553A]"
                      : "border-[#E7E0D0] bg-[#FBF8F2] text-[#A39B8B]"
                  )}>
                    <entry.icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className={cn(
                      "text-sm font-bold transition-colors duration-300",
                      isActive ? "text-[#15140F]" : "text-[#15140F]/35"
                    )}>
                      {entry.title}
                    </p>
                    <p className={cn(
                      "mt-0.5 text-[0.68rem] transition-colors duration-300",
                      isActive ? "text-[#C8553A]/70" : "text-[#15140F]/20"
                    )}>
                      {entry.subtitle}
                    </p>
                  </div>
                </div>

                {/* ── Right: content card ── */}
                <article className={cn(
                  "flex-1 flex flex-col rounded-[1.75rem] border transition-all duration-500 overflow-hidden",
                  isActive
                    ? "border-[#C8553A]/20 bg-[#FFFFFF] shadow-[0_20px_60px_rgba(21,20,15,0.10),0_0_0_1px_rgba(200,85,58,0.10)]"
                    : "border-[#E7E0D0] bg-[#FBF8F2]"
                )}>
                  {/* Top sheen */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E7E0D0] to-transparent" />

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
                        isActive ? "text-[#15140F]" : "text-[#15140F]/50"
                      )}>
                        {entry.title}
                      </h3>
                      <p className={cn(
                        "text-[0.9rem] leading-[1.75] transition-all duration-300",
                        isActive ? "text-[#15140F]/55 line-clamp-none" : "text-[#15140F]/30 line-clamp-2"
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
                          <div className="rounded-2xl border border-[#E7E0D0] bg-[#FBF8F2] p-4">
                            <ul className="space-y-2.5">
                              {entry.items.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-[0.85rem] text-[#15140F]/50">
                                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C8553A]/50" />
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
      <div className="pointer-events-none absolute left-1/2 top-[280px] hidden -translate-x-1/2 w-px h-[calc(100%-380px)] bg-gradient-to-b from-transparent via-[#C8553A]/20 to-transparent md:block" />
    </section>
  );
}
