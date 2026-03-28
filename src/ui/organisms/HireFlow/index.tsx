"use client";

import "./styles.css";

import { AnimatePresence } from "framer-motion";
import HireFlowModal from "./HireFlowModal";
import HireFlowController from "./HireFlowController";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useHireFlowPanel from "@/state/slices/hireFlowPanel/hooks";

const HireFlow = () => {
  const { isOpen, closeHireFlow } = useHireFlowPanel();
  const { user } = useAuthPanel();

  return (
    <>
      <HireFlowController />
      <AnimatePresence mode="wait">
        {isOpen && (
          <HireFlowModal
            key="hire-flow-modal"
            isOpen={isOpen}
            onClose={closeHireFlow}
            initialEmail={user?.email}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HireFlow;
export { HireFlowModal };
