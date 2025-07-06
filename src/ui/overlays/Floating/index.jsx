"use client";

import "./styles.css";
import { motion } from "framer-motion";

import { useChatPanel } from "@/state/slices/chatPanel";
import { useMenuPanel } from "@/state/slices/menuPanel";

const Floating = ({ id, children }) => {
  const { isOpen: isChatOpen, close: closeChat } = useChatPanel();
  const { isOpen: isMenuOpen, close: closeMenu } = useMenuPanel();

  const handleClickOutside = (event) => {
    const blade = document.querySelector(`#${id}Floating`);

    if (blade && event.target === blade) {
      if (isMenuOpen) closeMenu();
      else if (isChatOpen) closeChat();
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
      <div className="floating_panel">{children}</div>
    </motion.div>
  );
};

export default Floating;
