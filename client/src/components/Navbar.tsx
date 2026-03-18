import React from "react";
import { MapPin, Moon, Sun, Wifi } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light";

  return (
    <nav className="fixed inset-x-0 top-0 z-[2000]">
      <div className="glass-panel border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-[0_0_28px_rgba(99,102,241,0.45),0_4px_16px_rgba(2,6,23,0.35)]">
                <MapPin className="size-5 text-white" />
              </div>
              <span
                className={cn(
                  "absolute -right-0.5 -top-0.5 size-3 rounded-full border-2",
                  "border-background bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]",
                )}
                style={{ animation: "live-dot 2s ease-in-out infinite" }}
                aria-hidden="true"
              />
            </div>

            <div className="leading-none">
              <div className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                <span className="bg-gradient-to-br from-foreground via-violet-200 to-indigo-200 bg-clip-text text-transparent dark:from-white dark:via-violet-200 dark:to-indigo-200">
                  RouteX
                </span>
              </div>
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                Sri Eshwar Engineering
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-emerald-500 shadow-[0_0_18px_rgba(52,211,153,0.08)] sm:flex">
              <Wifi className="size-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em]">Live</span>
              <span
                className="size-2 rounded-full bg-emerald-500"
                style={{ animation: "live-dot 1.5s ease-in-out infinite" }}
                aria-hidden="true"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-xl bg-background/40 backdrop-blur hover:bg-accent/60"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </div>
        </div>

        <div className="pointer-events-none relative h-px overflow-hidden opacity-60">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.55) 30%, rgba(139,92,246,0.85) 50%, rgba(99,102,241,0.55) 70%, transparent 100%)",
              animation: "shimmer-slide 4s linear infinite",
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
