import type { Decorator } from "@storybook/react";
import { LazyMotion, domAnimation } from "framer-motion";

const MotionDecorator: Decorator = (Story) => (
  <LazyMotion features={domAnimation} strict>
    <Story />
  </LazyMotion>
);

export default MotionDecorator;
