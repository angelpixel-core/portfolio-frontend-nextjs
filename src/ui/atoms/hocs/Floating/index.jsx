"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import { setIsMenuOpen } from "@/slices/menu/menuSlice";
import { setIsChatOpen } from "@/slices/chat/chatSlice";

export function Floating({ children, id }) {
  const { isChatOpen } = useSelector((state) => state.chat);
  const { isMenuOpen } = useSelector((state) => state.menu);

  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    const blade = document.querySelector(`#${id}Floating`);

    if (blade == event.target) {
      if (isMenuOpen) {
        console.log("close Menu");
        dispatch(setIsMenuOpen(false));
      } else if (isChatOpen) {
        console.log("close Chat");
        dispatch(setIsChatOpen(false));
      }
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
      animate={{ scale: 1, opacity: 1 }}
      id={`${id}Floating`}
      className="floating_container"
      onClick={handleClickOutside}
    >
      <div className="floating">{children}</div>
    </motion.div>
  );
}
