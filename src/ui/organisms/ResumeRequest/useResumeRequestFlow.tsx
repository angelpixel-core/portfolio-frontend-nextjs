import { useCallback, useMemo, useState, type ReactElement } from "react";
import ContextStep from "./steps/ContextStep";
import RoleStep from "./steps/RoleStep";
import NotesStep from "./steps/NotesStep";

export interface ResumeRequestAnswers {
  context?: string;
  role?: string;
  notes?: string;
}

interface ResumeRequestStepRenderProps {
  answers: ResumeRequestAnswers;
  onAnswer: <Key extends keyof ResumeRequestAnswers>(
    _key: Key,
    _value: ResumeRequestAnswers[Key]
  ) => void;
}

export interface ResumeRequestStep {
  id: keyof ResumeRequestAnswers;
  title: string;
  subtitle: string;
  isOptional: boolean;
  render: (_props: ResumeRequestStepRenderProps) => ReactElement;
}

const useResumeRequestFlow = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<ResumeRequestAnswers>({});

  const steps = useMemo<ResumeRequestStep[]>(
    () => [
      {
        id: "context",
        title: "What is this request for?",
        subtitle: "Optional context helps me respond with the right version.",
        isOptional: true,
        render: ({ answers: currentAnswers, onAnswer }) => (
          <ContextStep
            value={currentAnswers.context}
            onChange={(value) => onAnswer("context", value)}
          />
        ),
      },
      {
        id: "role",
        title: "Which role or project is this for?",
        subtitle: "Optional details help highlight the most relevant work.",
        isOptional: true,
        render: ({ answers: currentAnswers, onAnswer }) => (
          <RoleStep
            value={currentAnswers.role}
            onChange={(value) => onAnswer("role", value)}
          />
        ),
      },
      {
        id: "notes",
        title: "Any extra notes?",
        subtitle: "Optional notes help me prep before I send it over.",
        isOptional: true,
        render: ({ answers: currentAnswers, onAnswer }) => (
          <NotesStep
            value={currentAnswers.notes}
            onChange={(value) => onAnswer("notes", value)}
          />
        ),
      },
    ],
    []
  );

  const currentStep = steps[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  const setAnswer = useCallback(
    <Key extends keyof ResumeRequestAnswers>(
      key: Key,
      value: ResumeRequestAnswers[Key]
    ) => {
      setAnswers((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const nextStep = useCallback(() => {
    if (!isLastStep) {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }, [isLastStep, steps.length]);

  const previousStep = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const skipStep = useCallback(() => {
    if (!isLastStep) {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  }, [isLastStep, steps.length]);

  const resetFlow = useCallback(() => {
    setStepIndex(0);
    setAnswers({});
  }, []);

  return {
    steps,
    stepIndex,
    currentStep,
    answers,
    setAnswer,
    nextStep,
    previousStep,
    skipStep,
    resetFlow,
    isFirstStep,
    isLastStep,
  };
};

export default useResumeRequestFlow;
