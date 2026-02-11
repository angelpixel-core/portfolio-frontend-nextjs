/**
 * Shared framer-motion mock for Jest tests.
 *
 * This mock provides:
 * - motion and m components (div, span, a, button, ul, li, nav, header, section, p)
 * - forwardRef support for all components
 * - LazyMotion passthrough (renders children)
 * - AnimatePresence passthrough
 * - useReducedMotion hook mock
 *
 * Usage in tests:
 * ```typescript
 * // At the top of your test file (before component imports)
 * jest.mock("framer-motion", () =>
 *   require("@/test-utils/framer-motion-mock")
 * );
 * ```
 *
 * If you also need to mock useReducedMotion from @/hooks:
 * ```typescript
 * jest.mock("@/hooks", () => ({
 *   ...jest.requireActual("@/hooks"),
 *   useReducedMotion: () => false, // or true to simulate prefers-reduced-motion
 * }));
 * ```
 */

import React, { forwardRef } from "react";

// Filter out framer-motion specific props that shouldn't be passed to DOM
const filterMotionProps = <T extends Record<string, unknown>>(props: T): T => {
  const motionProps = [
    "initial",
    "animate",
    "exit",
    "transition",
    "variants",
    "whileHover",
    "whileTap",
    "whileFocus",
    "whileDrag",
    "whileInView",
    "drag",
    "dragConstraints",
    "dragElastic",
    "dragMomentum",
    "dragTransition",
    "dragPropagation",
    "dragControls",
    "dragListener",
    "dragDirectionLock",
    "dragSnapToOrigin",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "layout",
    "layoutId",
    "onLayoutAnimationStart",
    "onLayoutAnimationComplete",
    "layoutDependency",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onPan",
    "onPanStart",
    "onPanEnd",
    "onTap",
    "onTapStart",
    "onTapCancel",
    "onHoverStart",
    "onHoverEnd",
    "transformTemplate",
    "custom",
    "inherit",
    // Note: "style" is intentionally NOT filtered - it's passed through to DOM
  ];

  const filtered = { ...props };
  motionProps.forEach((prop) => {
    delete (filtered as Record<string, unknown>)[prop];
  });

  return filtered;
};

/**
 * Creates a mock motion component for a given HTML/SVG tag.
 * Supports forwardRef for components that need ref access.
 */
const createMotionComponent = <T extends Element>(tag: string) => {
  return forwardRef<
    T,
    React.HTMLAttributes<T> & { children?: React.ReactNode }
  >(function MockMotionComponent({ children, ...props }, ref) {
    const filteredProps = filterMotionProps(props);
    return React.createElement(tag, { ...filteredProps, ref }, children);
  });
};

/**
 * Wraps a custom component to make it a "motion" component.
 * Used for motion(CustomComponent) pattern like motion(Image).
 */
const wrapCustomComponent = (Component: React.ComponentType<unknown>) => {
  return forwardRef<unknown, Record<string, unknown>>(
    function MockMotionWrapper(props, ref) {
      const filteredProps = filterMotionProps(props);
      // Pass ref as part of props for custom components
      return React.createElement(Component, { ...filteredProps, ref } as Record<
        string,
        unknown
      >);
    }
  );
};

// Motion components with forwardRef support
// Make motion callable as both function and object with element properties
type MotionFunction = {
  // eslint-disable-next-line no-unused-vars
  <T extends React.ComponentType<unknown>>(component: T): T;
  div: ReturnType<typeof createMotionComponent>;
  span: ReturnType<typeof createMotionComponent>;
  a: ReturnType<typeof createMotionComponent>;
  button: ReturnType<typeof createMotionComponent>;
  ul: ReturnType<typeof createMotionComponent>;
  li: ReturnType<typeof createMotionComponent>;
  nav: ReturnType<typeof createMotionComponent>;
  header: ReturnType<typeof createMotionComponent>;
  section: ReturnType<typeof createMotionComponent>;
  p: ReturnType<typeof createMotionComponent>;
  h1: ReturnType<typeof createMotionComponent>;
  h2: ReturnType<typeof createMotionComponent>;
  h3: ReturnType<typeof createMotionComponent>;
  img: ReturnType<typeof createMotionComponent>;
  main: ReturnType<typeof createMotionComponent>;
  footer: ReturnType<typeof createMotionComponent>;
  article: ReturnType<typeof createMotionComponent>;
  aside: ReturnType<typeof createMotionComponent>;
  figure: ReturnType<typeof createMotionComponent>;
  // SVG elements
  svg: ReturnType<typeof createMotionComponent>;
  circle: ReturnType<typeof createMotionComponent>;
  path: ReturnType<typeof createMotionComponent>;
  g: ReturnType<typeof createMotionComponent>;
  rect: ReturnType<typeof createMotionComponent>;
  line: ReturnType<typeof createMotionComponent>;
  polyline: ReturnType<typeof createMotionComponent>;
  polygon: ReturnType<typeof createMotionComponent>;
};

// Create the motion function that can be called with custom components
const motionFunc = (Component: React.ComponentType<unknown>) =>
  wrapCustomComponent(Component);

// Attach element-specific components as properties
const motionComponents = {
  div: createMotionComponent<HTMLDivElement>("div"),
  span: createMotionComponent<HTMLSpanElement>("span"),
  a: createMotionComponent<HTMLAnchorElement>("a"),
  button: createMotionComponent<HTMLButtonElement>("button"),
  ul: createMotionComponent<HTMLUListElement>("ul"),
  li: createMotionComponent<HTMLLIElement>("li"),
  nav: createMotionComponent<HTMLElement>("nav"),
  header: createMotionComponent<HTMLElement>("header"),
  section: createMotionComponent<HTMLElement>("section"),
  p: createMotionComponent<HTMLParagraphElement>("p"),
  h1: createMotionComponent<HTMLHeadingElement>("h1"),
  h2: createMotionComponent<HTMLHeadingElement>("h2"),
  h3: createMotionComponent<HTMLHeadingElement>("h3"),
  img: createMotionComponent<HTMLImageElement>("img"),
  main: createMotionComponent<HTMLElement>("main"),
  footer: createMotionComponent<HTMLElement>("footer"),
  article: createMotionComponent<HTMLElement>("article"),
  aside: createMotionComponent<HTMLElement>("aside"),
  figure: createMotionComponent<HTMLElement>("figure"),
  // SVG elements (Story 3.4)
  svg: createMotionComponent<SVGSVGElement>("svg"),
  circle: createMotionComponent<SVGCircleElement>("circle"),
  path: createMotionComponent<SVGPathElement>("path"),
  g: createMotionComponent<SVGGElement>("g"),
  rect: createMotionComponent<SVGRectElement>("rect"),
  line: createMotionComponent<SVGLineElement>("line"),
  polyline: createMotionComponent<SVGPolylineElement>("polyline"),
  polygon: createMotionComponent<SVGPolygonElement>("polygon"),
};

export const motion = Object.assign(
  motionFunc,
  motionComponents
) as MotionFunction;

// m is the LazyMotion-compatible alias for motion
export const m = Object.assign(motionFunc, motionComponents) as MotionFunction;

/**
 * LazyMotion mock - renders children without loading features
 */
export const LazyMotion: React.FC<{
  children?: React.ReactNode;
  features: unknown;
  strict?: boolean;
}> = ({ children }) => React.createElement(React.Fragment, null, children);

/**
 * domAnimation mock - placeholder for the features bundle
 */
export const domAnimation = {};

/**
 * AnimatePresence mock - renders children without animation logic
 */
export const AnimatePresence: React.FC<{
  children?: React.ReactNode;
  mode?: "sync" | "wait" | "popLayout";
  initial?: boolean;
  onExitComplete?: () => void;
}> = ({ children }) => React.createElement(React.Fragment, null, children);

/**
 * useReducedMotion hook mock - returns false by default (no reduced motion)
 * Override this in your test if you need to test reduced motion behavior
 */
export const useReducedMotion = () => false;

/**
 * useInView hook mock - returns true by default (element is in view)
 */
export const useInView = () => true;

/**
 * useScroll hook mock - returns static values
 */
export const useScroll = () => ({
  scrollX: { get: () => 0, set: () => {} },
  scrollY: { get: () => 0, set: () => {} },
  scrollXProgress: { get: () => 0, set: () => {} },
  scrollYProgress: { get: () => 0, set: () => {} },
});

/**
 * useTransform hook mock - returns the input value
 */
export const useTransform = <T>(value: T): T => value;

/**
 * useSpring hook mock - returns the input value
 */
export const useSpring = <T>(value: T): T => value;

/**
 * useMotionValue hook mock - returns an object with get/set
 */
export const useMotionValue = <T>(initial: T) => ({
  get: () => initial,
  set: () => {},
  onChange: () => () => {},
});

/**
 * useAnimation hook mock - returns control methods
 */
export const useAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
});

// Default export for convenience when using require()
const framerMotionMock = {
  motion,
  m,
  LazyMotion,
  domAnimation,
  AnimatePresence,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimation,
};

export default framerMotionMock;
