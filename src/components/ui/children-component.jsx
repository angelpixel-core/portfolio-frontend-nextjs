"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ChildrenComponent({ children }) {
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <div key={router.asPath}>{children}</div>
    </AnimatePresence>
  );
}
