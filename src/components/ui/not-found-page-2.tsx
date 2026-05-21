"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

const H = 40;
const V = 20;

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0a0a0a] text-[#0F172A]">
      {/* Animated background orbs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, H, -H, 0], y: [0, V, -V, 0], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-gradient-to-tr from-[#111827]/20 to-inverse-primary/10 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -H, H, 0], y: [0, -V, V, 0] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-[#6b0fa0]/15 to-[#111827]/10 blur-[120px]"
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(14,159,110,0.5) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black 20%, transparent 100%)",
          }}
        />
      </div>

      <Empty className="border-none">
        <EmptyHeader>
          {/* Logo */}
          <img src="/favicon.png" alt="Vielinks" className="h-10 w-10 mb-4 opacity-80" />

          {/* 404 number */}
          <EmptyTitle className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent font-extrabold text-[7rem] leading-none tracking-[-0.06em] md:text-[9rem]">
            404
          </EmptyTitle>

          {/* Divider */}
          <div className="my-2 h-px w-16 bg-gradient-to-r from-transparent via-[#0E9F6E]/40 to-transparent" />

          <EmptyDescription className="text-[#0F172A]/50 text-base leading-[1.8] max-w-xs">
            The page you are looking for might have been moved or does not exist.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="rounded-full bg-[#111827] text-[#0B0B0A] font-bold px-8 hover:shadow-[0_0_36px_rgba(14,159,110,0.35)] transition-all"
            >
              <a href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="rounded-full border-white/[0.12] bg-white/[0.04] text-[#0F172A]/60 px-8 hover:border-[#111827]/30 hover:text-[#0F172A]/80 hover:bg-white/[0.07] transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          <p className="text-[0.72rem] text-[#0F172A]/25 tracking-wide">
            Vielinks · Social media management platform
          </p>
        </EmptyContent>
      </Empty>
    </div>
  );
}
