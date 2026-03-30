"use client";

import "./styles.css";

import { AnimatePresence } from "framer-motion";
import ResumeRequestModal from "./ResumeRequestModal";
import ResumeRequestController from "./ResumeRequestController";
import useResumeRequestPanel from "@/state/slices/resumeRequestPanel/hooks";

const ResumeRequest = () => {
  const { isOpen, closeResumeRequest, activeSource } = useResumeRequestPanel();

  return (
    <>
      <ResumeRequestController />
      <AnimatePresence mode="wait">
        {isOpen && (
          <ResumeRequestModal
            key="resume-request-modal"
            isOpen={isOpen}
            onClose={closeResumeRequest}
            source={activeSource}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ResumeRequest;
export { ResumeRequestModal };
