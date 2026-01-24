"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks";

const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: shouldReduceMotion ? 0 : 3_000,
  });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (shouldReduceMotion && ref.current) {
      ref.current.textContent = value;
      return;
    }
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue, shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    springValue.on("change", (latest) => {
      if (ref.current && latest.toFixed(0) <= value) {
        ref.current.textContent = latest.toFixed(0);
      }
    });
  }, [springValue, value, shouldReduceMotion]);

  return <span ref={ref}></span>;
};

export default AnimatedNumber;
