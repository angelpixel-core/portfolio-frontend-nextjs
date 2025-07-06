"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { TransitionEffect } from "@/molecules";

const AnimatedChildren = ({ children }) => {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <div key={router.asPath}>
        <TransitionEffect />

        {children}
      </div>
    </AnimatePresence>
  );
};

export default AnimatedChildren;
