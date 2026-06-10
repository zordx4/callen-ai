// CountUp — animates a number from 0 to target when scrolled into view.
// Used in the stat band on the landing page.

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useTransform, animate } from "motion/react";

type CountUpProps = {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: (n: number) => string;
};

export function CountUp({
  to,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  format,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) =>
    format ? format(v) : v.toFixed(decimals)
  );
  // Server-render the FINAL value so crawlers, link previews, and no-JS
  // clients see "50,000" instead of "0". The same value paints first on
  // the client (hydration-safe), then snaps to 0 and counts up the moment
  // the element scrolls into view.
  const [display, setDisplay] = useState(format ? format(to) : to.toFixed(decimals));

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, to, {
        duration,
        ease: [0.2, 0.65, 0.3, 0.9],
      });
      const unsub = rounded.on("change", (v) => setDisplay(v));
      return () => {
        controls.stop();
        unsub();
      };
    }
  }, [inView, to, motionValue, rounded, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}
