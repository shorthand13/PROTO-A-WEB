"use client";

import { useEffect, useState } from "react";

interface HeroTypewriterProps {
  heroLine1: string;
  heroLine2: string;
  solutionTitle: string;
  solutionSubtitle: string;
}

type Phase = "typing1" | "hold1" | "fade1" | "typing2" | "hold2" | "fade2" | "solution";

export default function HeroTypewriter({
  heroLine1,
  heroLine2,
  solutionTitle,
  solutionSubtitle,
}: HeroTypewriterProps) {
  const [phase, setPhase] = useState<Phase>("typing1");
  const [char1, setChar1] = useState(0);
  const [char2, setChar2] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showSolutionTitle, setShowSolutionTitle] = useState(false);
  const [showSolutionSub, setShowSolutionSub] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    let i = 0;
    const typeLine1 = () => {
      if (cancelled) return;
      if (i <= heroLine1.length) {
        setChar1(i);
        i++;
        // Pause at line break (after "のに、")
        const delay = heroLine1[i - 1] === "\n" ? 1500 : 120;
        timers.push(setTimeout(typeLine1, delay));
      } else {
        t(() => setPhase("hold1"), 0);
        t(() => setPhase("fade1"), 3000);
        t(() => {
          setPhase("typing2");
          let j = 0;
          const typeLine2 = () => {
            if (cancelled) return;
            if (j <= heroLine2.length) {
              setChar2(j);
              j++;
              timers.push(setTimeout(typeLine2, 120));
            } else {
              t(() => {
                setPhase("hold2");
                window.dispatchEvent(new Event("hero-line2-done"));
              }, 0);
              t(() => setPhase("fade2"), 1500);
              t(() => {
                setPhase("solution");
                setShowSolution(true);
                t(() => setShowSolutionTitle(true), 1200);
                t(() => setShowSolutionSub(true), 2550);
                t(() => window.dispatchEvent(new Event("hero-casestudy-show")), 3300);
                t(() => window.dispatchEvent(new Event("hero-blog-show")), 3650);
              }, 2300);
            }
          };
          typeLine2();
        }, 3900);
      }
    };

    typeLine1();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [heroLine1, heroLine2]);

  const line1Visible = phase === "typing1" || phase === "hold1";
  const showLine2Phase = phase === "typing2" || phase === "hold2" || phase === "fade2";
  const showIdleCursor = phase === "hold1" || phase === "fade1";

  return (
    <div className="flex flex-col justify-start items-start h-full w-full p-10 relative">
      <p className="text-3xl lg:text-4xl xl:text-5xl font-medium text-foreground leading-relaxed whitespace-pre-line">
        {/* Line 1: stays in flow, fades to transparent so line 2 continues after it */}
        <span
          className="transition-opacity duration-1000 ease-in-out"
          style={{ opacity: line1Visible ? 1 : showLine2Phase ? 0 : 0 }}
        >
          {showLine2Phase ? heroLine1 : heroLine1.slice(0, char1)}
        </span>

        {/* Blinking cursor: shown during typing1, idle (fade1), and typing2 */}
        {(phase === "typing1" || showIdleCursor) && (
          <span className="inline-block w-[3px] h-[0.85em] bg-foreground ml-0.5 animate-pulse align-middle" />
        )}

        {/* Line 2: types right after line 1 */}
        {showLine2Phase && (
          <span
            className="transition-opacity duration-1000 ease-in-out"
            style={{ opacity: phase === "fade2" ? 0 : 1 }}
          >
            {heroLine2.slice(0, char2)}
            {(phase === "typing2" || phase === "hold2") && (
              <span className="inline-block w-[3px] h-[0.85em] bg-foreground ml-0.5 animate-pulse align-middle" />
            )}
          </span>
        )}
      </p>

      {/* Solution — slides up to fill the block */}
      <div
        className="absolute inset-0 flex items-center justify-center p-10 transition-all ease-out"
        style={{
          opacity: showSolution ? 1 : 0,
          transform: showSolution ? "translateY(0)" : "translateY(24px)",
          transitionDuration: "900ms",
        }}
      >
        <div className="rounded-3xl backdrop-blur-sm p-12 lg:p-16 w-full max-w-4xl" style={{ backgroundColor: "#eaad63" }}>
          <div
            className="flex flex-col items-start -space-y-3 transition-opacity duration-700 ease-in-out"
            style={{ opacity: showSolutionTitle ? 1 : 0 }}
          >
            {solutionTitle.replace("一歩」を", "一歩」を\n").split("\n").filter(Boolean).map((line, i) => (
              <span
                key={i}
                className="inline-block bg-white text-foreground text-2xl lg:text-3xl xl:text-4xl font-bold rounded-xl px-5 py-2 shadow-sm"
              >
                {line}
              </span>
            ))}
          </div>
          <p
            className="mt-6 text-base lg:text-lg xl:text-xl text-white font-medium leading-relaxed whitespace-pre-line transition-opacity duration-700 ease-in-out"
            style={{ opacity: showSolutionSub ? 1 : 0 }}
          >
            {solutionSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
