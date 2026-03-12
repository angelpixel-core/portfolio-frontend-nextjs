import type { FacePosition } from "./cube-orientation";

export const getFaceTransform = (
  position: FacePosition | string,
  size: number
): string => {
  const half = size / 2;

  // Geometric source of truth for face placement.
  // Keeping this mapping centralized avoids drift between CSS and component logic.
  switch (position) {
    case "front":
      return `translateZ(${half}px)`;
    case "back":
      return `rotateY(180deg) translateZ(${half}px)`;
    case "right":
      return `rotateY(90deg) translateZ(${half}px)`;
    case "left":
      return `rotateY(-90deg) translateZ(${half}px)`;
    case "top":
      return `rotateX(90deg) translateZ(${half}px)`;
    case "bottom":
      return `rotateX(-90deg) translateZ(${half}px)`;
    default:
      // Safe fallback for unknown input. Keep face in a neutral plane
      // so render remains stable and does not break header layout.
      return "translateZ(0px)";
  }
};

export default getFaceTransform;
