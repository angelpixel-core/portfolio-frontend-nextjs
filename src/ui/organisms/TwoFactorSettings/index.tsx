"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  TwoFactorEnrollResponse,
  TwoFactorStatus,
} from "@/services/auth/types";
import {
  disableTwoFactor,
  getStatus,
  regenerateRecoveryCodes,
  startEnrollment,
  verifyEnrollment,
} from "@/services/auth/twoFactor";
import RecoveryCodes from "@/molecules/RecoveryCodes";
import "./styles.css";

type ActionState = "idle" | "loading" | "success" | "error";

const formatTimestamp = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString();
};

const TwoFactorSettings = () => {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [enrollment, setEnrollment] = useState<TwoFactorEnrollResponse | null>(
    null
  );
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [pendingRecoveryCodes, setPendingRecoveryCodes] = useState<
    string[] | null
  >(null);
  const [enrollmentPassword, setEnrollmentPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [actionState, setActionState] = useState<ActionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const refreshStatus = useCallback(async () => {
    try {
      setError(null);
      const nextStatus = await getStatus();
      setStatus(nextStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load status");
    }
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleStartEnrollment = async () => {
    if (!enrollmentPassword.trim()) return;

    try {
      setActionState("loading");
      setError(null);
      setHasAcknowledged(false);
      setRecoveryCodes(null);
      setPendingRecoveryCodes(null);
      const response = await startEnrollment({
        password: enrollmentPassword.trim(),
      });
      setEnrollment(response);
      setPendingRecoveryCodes(response.recoveryCodes ?? null);
      setActionState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
      setActionState("error");
    }
  };

  const handleVerifyEnrollment = async () => {
    if (!verificationCode.trim()) return;

    try {
      setActionState("loading");
      setError(null);
      const response = await verifyEnrollment({
        code: verificationCode.trim(),
      });
      setRecoveryCodes(response.recoveryCodes ?? pendingRecoveryCodes ?? null);
      setPendingRecoveryCodes(null);
      setEnrollment(null);
      setVerificationCode("");
      await refreshStatus();
      setActionState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setActionState("error");
    }
  };

  const handleDisable = async () => {
    if (!disablePassword.trim() || !confirmDisable) return;

    try {
      setActionState("loading");
      setError(null);
      await disableTwoFactor({
        password: disablePassword.trim(),
        confirm: confirmDisable,
      });
      setDisablePassword("");
      setConfirmDisable(false);
      await refreshStatus();
      setActionState("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Disable failed");
      setActionState("error");
    }
  };

  const handleRegenerateCodes = async () => {
    if (!recoveryPassword.trim()) return;

    try {
      setActionState("loading");
      setError(null);
      const response = await regenerateRecoveryCodes({
        password: recoveryPassword.trim(),
      });
      setRecoveryCodes(response.recoveryCodes);
      setHasAcknowledged(false);
      setActionState("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to regenerate codes"
      );
      setActionState("error");
    }
  };

  const statusLabel = useMemo(() => {
    if (!status) return "Loading";
    return status.enabled ? "Enabled" : "Disabled";
  }, [status]);

  const seedValue = useMemo(() => {
    if (!enrollment) return null;
    if (enrollment.secret) return enrollment.secret;
    if (!enrollment.otpauthUrl) return null;

    try {
      const url = new URL(enrollment.otpauthUrl);
      const secret = url.searchParams.get("secret");
      return secret || enrollment.otpauthUrl;
    } catch {
      return enrollment.otpauthUrl;
    }
  }, [enrollment]);

  return (
    <div className="two-factor">
      <div className="two-factor__card">
        <div className="two-factor__header">
          <div>
            <p className="two-factor__eyebrow">Two-factor authentication</p>
            <h3 className="two-factor__title">Authenticator app</h3>
          </div>
          <span
            className={`two-factor__status two-factor__status--${
              status?.enabled ? "enabled" : "disabled"
            }`.trim()}
          >
            {statusLabel}
          </span>
        </div>

        {error && (
          <p className="two-factor__error" role="alert">
            {error}
          </p>
        )}

        {status?.enabled && (
          <div className="two-factor__details">
            <p>
              Enrolled:{" "}
              <span>
                {formatTimestamp(status.enrolledAt) ?? "Not available"}
              </span>
            </p>
            <p>
              Last verified:{" "}
              <span>
                {formatTimestamp(status.lastVerifiedAt) ?? "Not available"}
              </span>
            </p>
          </div>
        )}

        {!status?.enabled && !enrollment && (
          <div className="two-factor__block">
            <label className="two-factor__label" htmlFor="two-factor-start">
              Account password
            </label>
            <input
              id="two-factor-start"
              type="password"
              className="two-factor__input focus-ring"
              value={enrollmentPassword}
              onChange={(event) => setEnrollmentPassword(event.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="two-factor__primary focus-ring"
              onClick={handleStartEnrollment}
              disabled={actionState === "loading" || !enrollmentPassword.trim()}
            >
              Start enrollment
            </button>
          </div>
        )}

        {enrollment && (
          <div className="two-factor__enrollment">
            <div className="two-factor__qr">
              <img
                src={enrollment.qrCodeDataUrl}
                alt="2FA QR code"
                className="two-factor__qr-image"
              />
              <p className="two-factor__qr-caption">
                Scan the QR code with your authenticator app.
              </p>
            </div>
            <div className="two-factor__manual">
              <p className="two-factor__manual-title">Manual setup link</p>
              <code className="two-factor__manual-code">
                {enrollment.otpauthUrl}
              </code>
              {seedValue && (
                <div className="two-factor__seed">
                  <p className="two-factor__manual-title">Seed</p>
                  <code className="two-factor__manual-code">{seedValue}</code>
                </div>
              )}
              <label className="two-factor__label" htmlFor="two-factor-code">
                Verification code
              </label>
              <input
                id="two-factor-code"
                type="text"
                className="two-factor__input focus-ring"
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                placeholder="123456"
              />
              <button
                type="button"
                className="two-factor__primary focus-ring"
                onClick={handleVerifyEnrollment}
                disabled={actionState === "loading" || !verificationCode.trim()}
              >
                Verify and enable
              </button>
            </div>
          </div>
        )}

        {status?.enabled && (
          <div className="two-factor__actions">
            <div className="two-factor__block">
              <label className="two-factor__label" htmlFor="two-factor-disable">
                Account password to disable
              </label>
              <input
                id="two-factor-disable"
                type="password"
                className="two-factor__input focus-ring"
                value={disablePassword}
                onChange={(event) => setDisablePassword(event.target.value)}
                placeholder="Enter your password"
              />
              <label className="two-factor__confirm">
                <input
                  type="checkbox"
                  checked={confirmDisable}
                  onChange={(event) => setConfirmDisable(event.target.checked)}
                />
                <span>I understand this will disable 2FA</span>
              </label>
              <button
                type="button"
                className="two-factor__danger focus-ring"
                onClick={handleDisable}
                disabled={
                  actionState === "loading" ||
                  !disablePassword.trim() ||
                  !confirmDisable
                }
              >
                Disable 2FA
              </button>
            </div>
            <div className="two-factor__block">
              <label className="two-factor__label" htmlFor="two-factor-recovery">
                Password to regenerate
              </label>
              <input
                id="two-factor-recovery"
                type="password"
                className="two-factor__input focus-ring"
                value={recoveryPassword}
                onChange={(event) => setRecoveryPassword(event.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="two-factor__secondary focus-ring"
                onClick={handleRegenerateCodes}
                disabled={actionState === "loading" || !recoveryPassword.trim()}
              >
                Regenerate recovery codes
              </button>
            </div>
          </div>
        )}
      </div>

      {recoveryCodes && recoveryCodes.length > 0 && (
        <RecoveryCodes
          codes={recoveryCodes}
          onAcknowledge={() => setHasAcknowledged(true)}
          acknowledged={hasAcknowledged}
        />
      )}
    </div>
  );
};

export default TwoFactorSettings;
