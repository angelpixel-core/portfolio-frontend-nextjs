"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { AuthUser } from "@/application/auth/types";
import { authClient } from "@/lib/auth-client";

interface AuthDropdownProps {
  user: AuthUser;
  onLogout: () => void;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

const AuthDropdown = ({
  user,
  onLogout,
  onClose,
  triggerRef,
}: AuthDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

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
  }, [onClose, triggerRef]);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      await authClient.signOut({});
      onLogout();
      onClose();
    } catch {
      setLogoutError("An unexpected error occurred");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <m.div
      ref={dropdownRef}
      data-testid="auth-dropdown"
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
      <Link
        href="/settings"
        role="menuitem"
        className="auth-dropdown__item"
        onClick={onClose}
        data-testid="auth-dropdown-settings"
      >
        Settings
      </Link>
      <Link
        href="/admin"
        role="menuitem"
        className="auth-dropdown__item"
        onClick={onClose}
        data-testid="auth-dropdown-admin"
      >
        Admin
      </Link>
      {logoutError && (
        <div className="auth-dropdown__error" role="alert">
          {logoutError}
        </div>
      )}
      <button
        data-testid="auth-dropdown-sign-out"
        role="menuitem"
        className="auth-dropdown__item auth-dropdown__item--danger"
        onClick={handleSignOut}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? "Signing out…" : "Sign Out"}
      </button>
    </m.div>
  );
};

export default AuthDropdown;
