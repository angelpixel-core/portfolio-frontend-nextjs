"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";

export function Floating({ children, id }) {
  const { isChatOpen } = useSelector((state) => state.chat);
  const { isMenuOpen } = useSelector((state) => state.menu);

  const handleClickOutside = (event) => {
    const blade = document.querySelector(`#${id}Floating`);

    if (isChatOpen || isMenuOpen) {
      if (!blade.contains(event.target)) {
        console.log({ blade });
        console.log({ target: event.target });
      } else {
        console.log("click fuera");
      }
    }

    blade.addEventListener("click", () => {});
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
      animate={{ scale: 1, opacity: 1 }}
      id={`${id}Floating`}
      onClick={handleClickOutside}
    >
      {children}
    </motion.div>
  );
}
