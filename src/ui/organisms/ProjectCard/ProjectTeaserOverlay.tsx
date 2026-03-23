"use client";

import { useEffect } from "react";
import Floating from "@/overlays/Floating";
import useChatPanel from "@/state/slices/chatPanel/hooks";
import { trackEvent } from "@/services/analytics";
import type { ProjectStatusModel } from "@/domains/project/model/schema";

interface ProjectTeaserOverlayProps {
  isOpen: boolean;
  onRequestClose: () => void;
  projectTitle: string;
  projectStatus: ProjectStatusModel;
  projectSlug: string;
}

const getStatusLabel = (status: ProjectStatusModel) => {
  if (status === "planned") return "Planned";
  if (status === "in-progress") return "In progress";
  return "Preview";
};

const getStatusCopy = (status: ProjectStatusModel) => {
  if (status === "planned") {
    return "This project is planned. Want updates or to shape the roadmap?";
  }

  if (status === "in-progress") {
    return "This project is in progress. Want a walkthrough or early preview?";
  }

  return "This project is not publicly available yet.";
};

export default function ProjectTeaserOverlay({
  isOpen,
  onRequestClose,
  projectTitle,
  projectStatus,
  projectSlug,
}: ProjectTeaserOverlayProps) {
  const { openChatPanel, setChatContext } = useChatPanel();

  useEffect(() => {
    if (!isOpen) return;
    trackEvent("teaser_opened", {
      label: projectTitle,
      slug: projectSlug,
      source: "project_teaser",
    });
  }, [isOpen, projectSlug, projectTitle]);

  if (!isOpen) {
    return null;
  }

  const statusLabel = getStatusLabel(projectStatus);
  const statusCopy = getStatusCopy(projectStatus);

  const handleChatCta = () => {
    trackEvent("teaser_cta_clicked", {
      label: projectTitle,
      slug: projectSlug,
      source: "project_teaser",
    });
    setChatContext({ projectName: projectTitle, source: "project_teaser" });
    openChatPanel();
    onRequestClose();
  };

  return (
    <Floating
      id={`project-teaser-${projectSlug}`}
      title={`${projectTitle} teaser`}
      onRequestClose={onRequestClose}
    >
      <div
        className="project-teaser-overlay"
        data-testid="project-teaser-overlay"
      >
        <div className="project-teaser-overlay__header">
          <span className="project-teaser-overlay__status">{statusLabel}</span>
          <button
            type="button"
            className="project-teaser-overlay__close"
            onClick={onRequestClose}
            aria-label={`Close teaser for ${projectTitle}`}
            data-testid="project-teaser-overlay-close"
          >
            Close
          </button>
        </div>

        <h3 className="project-teaser-overlay__title">{projectTitle}</h3>
        <p className="project-teaser-overlay__copy">{statusCopy}</p>

        <div className="project-teaser-overlay__actions">
          <button
            type="button"
            className="project-teaser-overlay__cta"
            onClick={handleChatCta}
            data-testid="project-teaser-overlay-cta"
          >
            Start a project chat
          </button>
        </div>
      </div>
    </Floating>
  );
}
