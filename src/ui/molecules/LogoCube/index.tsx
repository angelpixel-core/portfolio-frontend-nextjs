"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import {
  applyCubeAction,
  initialOrientation,
  type CubeFaceConfig,
  type CubeAction,
  type CubeOrientation,
  type FacePosition,
} from "./cube-orientation";
import { getFaceTransform } from "./cube-transforms";
import "./styles.css";

interface LogoCubeProps {
  className?: string;
  faces?: CubeFaceConfig;
  size?: number;
}

const DISPLAY_SEQUENCE = ["A", "P", "I", "X", "E", "L"] as const;

const IDLE_TRANSITION_INTERVAL_MS = 2500;
const INTERMEDIATE_STEP_DELAY_MS = 250;

const ACTION_ROTATION: Record<CubeAction, { x: number; y: number }> = {
  rotateUp: { x: -90, y: 0 },
  rotateDown: { x: 90, y: 0 },
  rotateLeft: { x: 0, y: -90 },
  rotateRight: { x: 0, y: 90 },
  rotateHalfY: { x: 0, y: 180 },
};

const FACE_POSITIONS: FacePosition[] = [
  "front",
  "back",
  "top",
  "bottom",
  "left",
  "right",
];

const planActionsToTarget = (
  orientation: CubeOrientation,
  target: string
): CubeAction[] => {
  if (String(orientation.front) === target) return [];
  if (String(orientation.top) === target) return ["rotateUp"];
  if (String(orientation.bottom) === target) return ["rotateDown"];
  if (String(orientation.left) === target) return ["rotateRight"];
  if (String(orientation.right) === target) return ["rotateLeft"];
  if (String(orientation.back) === target) return ["rotateHalfY"];

  return [];
};

const getNextTarget = (frontValue: string): string => {
  const currentIndex = DISPLAY_SEQUENCE.indexOf(
    frontValue as (typeof DISPLAY_SEQUENCE)[number]
  );

  if (currentIndex === -1) return DISPLAY_SEQUENCE[0];

  return DISPLAY_SEQUENCE[(currentIndex + 1) % DISPLAY_SEQUENCE.length];
};

const resolveOrientation = (faces?: CubeFaceConfig): CubeOrientation => ({
  front: faces?.front ?? initialOrientation.front,
  back: faces?.back ?? initialOrientation.back,
  top: faces?.top ?? initialOrientation.top,
  bottom: faces?.bottom ?? initialOrientation.bottom,
  left: faces?.left ?? initialOrientation.left,
  right: faces?.right ?? initialOrientation.right,
});

const LogoCube = ({
  className = "",
  faces,
  size = 30,
}: LogoCubeProps): React.JSX.Element => {
  const baseOrientation = useMemo(
    () => resolveOrientation(faces),
    [
      faces?.front,
      faces?.back,
      faces?.top,
      faces?.bottom,
      faces?.left,
      faces?.right,
    ]
  );
  const shouldReduceMotion = useReducedMotion();
  const [orientation, setOrientation] = useState(baseOrientation);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [rotationStep, setRotationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pendingActionRef = useRef<CubeAction | null>(null);
  const pendingQueueRef = useRef<CubeAction[]>([]);
  const orientationRef = useRef<CubeOrientation>(baseOrientation);
  const followUpTimeoutRef = useRef<number | null>(null);

  const startAction = useCallback((action: CubeAction): void => {
    pendingActionRef.current = action;
    setIsAnimating(true);
    setRotation(ACTION_ROTATION[action]);
  }, []);

  useEffect(() => {
    pendingActionRef.current = null;
    pendingQueueRef.current = [];
    orientationRef.current = baseOrientation;
    if (followUpTimeoutRef.current !== null) {
      window.clearTimeout(followUpTimeoutRef.current);
      followUpTimeoutRef.current = null;
    }
    setIsAnimating(false);
    setIsResetting(false);
    setRotation({ x: 0, y: 0 });
    setRotationStep(0);
    setOrientation(baseOrientation);
  }, [baseOrientation]);

  const triggerAction = useCallback(
    (action: CubeAction) => {
      if (isAnimating || isResetting) return;

      if (shouldReduceMotion) {
        setOrientation((current) => applyCubeAction(current, action));
        setRotationStep((current) => current + 1);
        return;
      }

      startAction(action);
    },
    [isAnimating, isResetting, shouldReduceMotion, startAction]
  );

  const runPlannedActions = useCallback(
    (actions: CubeAction[]) => {
      if (actions.length === 0 || isAnimating || isResetting) return;

      if (shouldReduceMotion) {
        let nextOrientation = orientationRef.current;

        actions.forEach((action) => {
          nextOrientation = applyCubeAction(nextOrientation, action);
          setRotationStep((current) => current + 1);
        });

        orientationRef.current = nextOrientation;
        setOrientation(nextOrientation);
        return;
      }

      const [firstAction, ...restActions] = actions;
      pendingQueueRef.current = restActions;
      triggerAction(firstAction);
    },
    [isAnimating, isResetting, shouldReduceMotion, triggerAction]
  );

  const triggerNextSequenceStep = useCallback(() => {
    const currentFront = String(orientationRef.current.front);
    if (
      !DISPLAY_SEQUENCE.includes(
        currentFront as (typeof DISPLAY_SEQUENCE)[number]
      )
    ) {
      runPlannedActions(["rotateHalfY"]);
      return;
    }

    const nextTarget = getNextTarget(currentFront);
    const actions = planActionsToTarget(orientationRef.current, nextTarget);

    runPlannedActions(actions);
  }, [runPlannedActions]);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      if (isAnimating || isResetting || isHovered) return;

      triggerNextSequenceStep();
    }, IDLE_TRANSITION_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    isAnimating,
    isHovered,
    isResetting,
    shouldReduceMotion,
    triggerNextSequenceStep,
  ]);

  const handleTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLSpanElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.propertyName !== "transform") return;

      if (!isAnimating || !pendingActionRef.current) return;

      // Keep logic and visual state decoupled:
      // 1) commit logical orientation, 2) reset temporary visual rotation.
      const nextAction = pendingActionRef.current;
      pendingActionRef.current = null;

      const nextOrientation = applyCubeAction(
        orientationRef.current,
        nextAction
      );
      orientationRef.current = nextOrientation;
      setOrientation(nextOrientation);
      setRotationStep((current) => current + 1);
      setIsAnimating(false);
      setIsResetting(true);
      setRotation({ x: 0, y: 0 });

      window.requestAnimationFrame(() => {
        setIsResetting(false);

        const nextQueuedAction = pendingQueueRef.current.shift();
        if (nextQueuedAction) {
          followUpTimeoutRef.current = window.setTimeout(() => {
            followUpTimeoutRef.current = null;
            startAction(nextQueuedAction);
          }, INTERMEDIATE_STEP_DELAY_MS);
        }
      });
    },
    [isAnimating, startAction]
  );

  useEffect(
    () => () => {
      if (followUpTimeoutRef.current !== null) {
        window.clearTimeout(followUpTimeoutRef.current);
      }
    },
    []
  );

  const cubeStyle = useMemo(
    () => ({
      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
    }),
    [rotation.x, rotation.y]
  );

  const faceTransformStyle = useMemo(
    () =>
      Object.fromEntries(
        FACE_POSITIONS.map((position) => [
          position,
          { transform: getFaceTransform(position, size) },
        ])
      ) as Record<FacePosition, React.CSSProperties>,
    [size]
  );

  const cubeContainerStyle = useMemo(
    () => ({ "--cube-size": `${size}px` }) as React.CSSProperties,
    [size]
  );

  return (
    <span
      className={[
        "logo-cube",
        rotationStep % 2 === 1 ? "logo-cube--inverted" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={cubeContainerStyle}
      aria-hidden="true"
      onMouseEnter={() => {
        setIsHovered(true);
        triggerNextSequenceStep();
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className={`logo-cube__body ${
          isAnimating ? "logo-cube__body--animating" : ""
        }`.trim()}
        style={cubeStyle}
        onTransitionEnd={handleTransitionEnd}
      >
        {FACE_POSITIONS.map((position) => (
          <span
            key={position}
            className={`logo-cube__face logo-cube__face--${position}`}
            data-letter={orientation[position]}
            style={faceTransformStyle[position]}
          >
            {orientation[position]}
          </span>
        ))}
      </span>
    </span>
  );
};

export default LogoCube;
