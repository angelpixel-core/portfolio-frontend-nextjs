"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

export default function AnimatedChildren({ children }) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <div key={router.asPath}>{children}</div>
    </AnimatePresence>
  );
}
