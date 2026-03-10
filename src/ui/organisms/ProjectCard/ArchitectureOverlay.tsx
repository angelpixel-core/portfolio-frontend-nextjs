"use client";

import Image from "next/image";
import Floating from "@/overlays/Floating";
import type { ProjectArchitectureModel } from "@/domains/project/model/schema";

interface ArchitectureOverlayProps {
  architecture: ProjectArchitectureModel;
  isOpen: boolean;
  onRequestClose: () => void;
  projectTitle: string;
}

export default function ArchitectureOverlay({
  architecture,
  isOpen,
  onRequestClose,
  projectTitle,
}: ArchitectureOverlayProps) {
  if (!isOpen) {
    return null;
  }

  const dialogTitle = `${projectTitle} architecture`;
  const imageAlt =
    architecture.alt || `Architecture diagram for ${projectTitle}`;

  return (
    <Floating
      id="project-architecture"
      title={dialogTitle}
      onRequestClose={onRequestClose}
    >
      <div
        className="project-architecture-overlay"
        data-testid="project-architecture-overlay"
      >
        <div className="project-architecture-overlay__header">
          <h3 className="project-architecture-overlay__title">Architecture</h3>
          <button
            type="button"
            className="project-architecture-overlay__close"
            onClick={onRequestClose}
            aria-label={`Close architecture view for ${projectTitle}`}
            data-testid="project-architecture-overlay-close"
          >
            Close
          </button>
        </div>

        <figure className="project-architecture-overlay__figure">
          <Image
            src={architecture.image}
            alt={imageAlt}
            width={1280}
            height={720}
            className="project-architecture-overlay__image"
            sizes="(max-width: 800px) 100vw, 60vw"
          />
          {architecture.caption ? (
            <figcaption className="project-architecture-overlay__caption">
              {architecture.caption}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </Floating>
  );
}
