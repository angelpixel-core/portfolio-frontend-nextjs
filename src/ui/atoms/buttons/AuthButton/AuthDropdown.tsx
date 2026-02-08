"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import type { AuthUser } from "@/services/auth/types";

interface AuthDropdownProps {
  user: AuthUser;
  onLogout: () => void;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const AuthDropdown = ({
  user,
  onLogout,
  onClose,
  triggerRef,
}: AuthDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !(triggerRef?.current && triggerRef.current.contains(target))
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);

    // Focus first menuitem on mount
    const firstItem = dropdownRef.current?.querySelector(
      '[role="menuitem"]'
    ) as HTMLElement | null;
    firstItem?.focus();

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSignOut = () => {
    onLogout();
    onClose();
  };

  return (
    <motion.div
      ref={dropdownRef}
      id="authDropdown"
      role="menu"
      className="auth-dropdown"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
      transition={{ duration: shouldReduceMotion ? 0.01 : 0.15 }}
    >
      <div className="auth-dropdown__header">
        {user.name && <span className="auth-dropdown__name">{user.name}</span>}
        <span className="auth-dropdown__email">{user.email}</span>
      </div>
      <div className="auth-dropdown__divider" />
      <button
        role="menuitem"
        className="auth-dropdown__item auth-dropdown__item--danger"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </motion.div>
  );
};

export default AuthDropdown;
