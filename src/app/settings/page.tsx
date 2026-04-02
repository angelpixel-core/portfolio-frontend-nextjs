"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import TwoFactorSettings from "@/organisms/TwoFactorSettings";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useThemeMode from "@/state/slices/themeMode/hooks";
import "@/buttons/ArrowButton/styles.css";
import "./styles.css";

type SettingsTab = "general" | "security";

type SaveState = "idle" | "saving" | "saved";

const SettingsPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const { openAuthPanel } = useAuthPanel();
  const { mode, setThemeMode } = useThemeMode();

  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [photoDragActive, setPhotoDragActive] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAuthenticated = !!session?.user?.email;

  useEffect(() => {
    if (session?.user?.name && !displayName) {
      setDisplayName(session.user.name);
    }

    if (!displayName && session?.user?.email) {
      setDisplayName(session.user.email.split("@")[0]);
    }

    if (session?.user?.email && !email) {
      setEmail(session.user.email);
    }
  }, [displayName, email, session?.user?.email, session?.user?.name]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoSelection = (file: File | null) => {
    if (!file) return;

    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }

    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    handlePhotoSelection(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setPhotoDragActive(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    handlePhotoSelection(file);
  };

  const handleSave = () => {
    setSaveState("saving");
    window.setTimeout(() => setSaveState("saved"), 600);
    window.setTimeout(() => setSaveState("idle"), 2000);
  };

  const saveLabel = useMemo(() => {
    if (saveState === "saving") return "Saving...";
    if (saveState === "saved") return "Saved";
    return "Save changes";
  }, [saveState]);

  if (!isPending && !isAuthenticated) {
    return (
      <section className="settings-page" data-testid="settings-page">
        <div className="settings-empty" data-testid="settings-auth-required">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-empty__text">
            Sign in to manage your profile preferences and security settings.
          </p>
          <button
            type="button"
            className="settings-empty__cta focus-ring"
            onClick={openAuthPanel}
          >
            Sign in
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="settings-page" data-testid="settings-page">
      <header className="settings-header">
        <div>
          <h1 className="settings-title">Settings</h1>
          <p className="settings-header__subtitle">
            Manage your profile details, appearance, and security preferences.
          </p>
        </div>
      </header>

        <div className="settings-layout">
          <aside className="settings-sidebar" aria-label="Settings sections">
            <div className="settings-sidebar__content">
              <p className="settings-sidebar__label">Sections</p>
              <div className="settings-sidebar__menu">
                <button
                  type="button"
                  className="settings-sidebar__button focus-ring"
                  data-active={activeTab === "general"}
                  onClick={() => setActiveTab("general")}
                >
                  General
                </button>
                <button
                  type="button"
                  className="settings-sidebar__button focus-ring"
                  data-active={activeTab === "security"}
                  onClick={() => setActiveTab("security")}
                >
                  Security
                </button>
              </div>
            </div>
          </aside>

        <div className="settings-content">
          {activeTab === "general" && (
            <div className="settings-panel" data-testid="settings-general">
              <div className="settings-card">
                <div className="settings-field">
                  <label htmlFor="settings-display-name">Display name</label>
                  <input
                    id="settings-display-name"
                    type="text"
                    className="settings-input focus-ring"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Your name"
                  />
                </div>

                <div className="settings-field">
                  <label htmlFor="settings-email">Email</label>
                  <input
                    id="settings-email"
                    type="email"
                    className="settings-input focus-ring"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                  />
                </div>

                <div className="settings-field">
                  <label>Profile photo</label>
                  <div
                    className={`settings-photo settings-photo--centered ${
                      photoDragActive ? "settings-photo--active" : ""
                    }`.trim()}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setPhotoDragActive(true);
                    }}
                    onDragLeave={() => setPhotoDragActive(false)}
                    onDrop={handleDrop}
                  >
                    <div className="settings-photo__preview">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Selected profile"
                          className="settings-photo__image"
                        />
                      ) : (
                        <span className="settings-photo__initials">
                          {(displayName || "User").slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="settings-photo__content">
                      <p className="settings-photo__title">
                        Drag and drop a photo
                      </p>
                      <p className="settings-photo__meta">
                        {photoName
                          ? `Selected: ${photoName}`
                          : "PNG, JPG up to 5MB"}
                      </p>
                      <button
                        type="button"
                        className="settings-photo__button focus-ring"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload photo
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="settings-photo__input"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              <div className="settings-card">
                <div className="settings-field">
                  <label>Theme</label>
                  <div className="settings-theme">
                    <label className="settings-theme__option">
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={mode === "light"}
                        onChange={() => setThemeMode("light")}
                      />
                      <span>Light</span>
                    </label>
                    <label className="settings-theme__option">
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={mode === "dark"}
                        onChange={() => setThemeMode("dark")}
                      />
                      <span>Dark</span>
                    </label>
                  </div>
                  <p className="settings-field__hint">
                    Theme preference is saved on this device.
                  </p>
                </div>
              </div>

              <div className="settings-panel__footer">
                <button
                  type="button"
                  className="settings-panel__action arrow-link focus-ring"
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                >
                  {saveLabel}
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="settings-panel" data-testid="settings-security">
              <TwoFactorSettings />
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
