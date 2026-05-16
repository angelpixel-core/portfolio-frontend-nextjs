"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/state/stores/ReduxStore";
import { loginSuccess, logout } from "@/state/slices/authPanel/slice";
import {
  saveSession,
  loadSession,
  clearSession,
  AUTH_SESSION_KEY,
} from "@/application/auth/session";

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = useSelector(
    (state: RootState) => state.authPanel.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.authPanel.user);

  useEffect(() => {
    if (!isPending && session?.user?.email) {
      dispatch(
        loginSuccess({
          email: session.user.email,
          name: session.user.name ?? undefined,
        })
      );
    }

    if (!isPending && !session && isAuthenticated) {
      dispatch(logout());
    }
  }, [
    dispatch,
    isAuthenticated,
    isPending,
    session,
    session?.user?.email,
    session?.user?.name,
  ]);

  // Sync Redux state → localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      saveSession(user);
    } else {
      clearSession();
    }
  }, [isAuthenticated, user]);

  // Cross-tab sync via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== AUTH_SESSION_KEY) return;

      const user = loadSession();
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(logout());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [dispatch]);

  return children;
};

export default AuthProvider;
