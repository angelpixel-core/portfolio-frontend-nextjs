import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
} from "react";
import ProjectTypeStep from "./steps/ProjectTypeStep";
import BudgetStep from "./steps/BudgetStep";
import TimelineStep from "./steps/TimelineStep";
import ContactStep from "./steps/ContactStep";
import NotesStep from "./steps/NotesStep";

export interface HireFlowAnswers {
  projectType?: string;
  budget?: string;
  timeline?: string;
  contactEmail?: string;
  notes?: string;
}

interface HireFlowStepRenderProps {
  answers: HireFlowAnswers;
  onAnswer: <Key extends keyof HireFlowAnswers>(
    _key: Key,
    _value: HireFlowAnswers[Key]
  ) => void;
  showError: boolean;
}

interface HireFlowStep {
  id: keyof HireFlowAnswers;
  title: string;
  subtitle: string;
  isValid: (_answers: HireFlowAnswers) => boolean;
  render: (_props: HireFlowStepRenderProps) => ReactElement;
}

const emailRegex = /^.{1,40}@([^.\s]+\.){1}[^.\s]+(\.[^.\s]+)?$/;
const HIRE_FLOW_ANSWERS_KEY = "hire_flow_answers";

const loadHireFlowAnswers = (): HireFlowAnswers => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(HIRE_FLOW_ANSWERS_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};

    const normalized: HireFlowAnswers = {};
    const keys: (keyof HireFlowAnswers)[] = [
      "projectType",
      "budget",
      "timeline",
      "contactEmail",
      "notes",
    ];

    keys.forEach((key) => {
      const value = parsed[key];
      if (typeof value === "string") {
        normalized[key] = value;
      }
    });

    return normalized;
  } catch {
    localStorage.removeItem(HIRE_FLOW_ANSWERS_KEY);
    return {};
  }
};

interface UseHireFlowOptions {
  initialEmail?: string;
}

const useHireFlow = ({ initialEmail }: UseHireFlowOptions = {}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<HireFlowAnswers>(() => {
    const storedAnswers = loadHireFlowAnswers();

    if (initialEmail && !storedAnswers.contactEmail) {
      return { ...storedAnswers, contactEmail: initialEmail };
    }

    return storedAnswers;
  });
  const [touchedSteps, setTouchedSteps] = useState<Record<string, boolean>>({});

  const steps = useMemo<HireFlowStep[]>(
    () => [
      {
        id: "projectType",
        title: "What do you want to build?",
        subtitle: "Pick the closest match to your project.",
        isValid: (currentAnswers) => Boolean(currentAnswers.projectType),
        render: ({ answers: currentAnswers, onAnswer, showError }) => (
          <ProjectTypeStep
            value={currentAnswers.projectType}
            onChange={(value) => onAnswer("projectType", value)}
            showError={showError}
          />
        ),
      },
      {
        id: "budget",
        title: "What budget range fits best?",
        subtitle: "A quick range helps shape the scope.",
        isValid: (currentAnswers) => Boolean(currentAnswers.budget),
        render: ({ answers: currentAnswers, onAnswer, showError }) => (
          <BudgetStep
            value={currentAnswers.budget}
            onChange={(value) => onAnswer("budget", value)}
            showError={showError}
          />
        ),
      },
      {
        id: "timeline",
        title: "When do you want to start?",
        subtitle: "Choose a window that feels realistic.",
        isValid: (currentAnswers) => Boolean(currentAnswers.timeline),
        render: ({ answers: currentAnswers, onAnswer, showError }) => (
          <TimelineStep
            value={currentAnswers.timeline}
            onChange={(value) => onAnswer("timeline", value)}
            showError={showError}
          />
        ),
      },
      {
        id: "contactEmail",
        title: "Where should I reach you?",
        subtitle: "Share a reliable email address.",
        isValid: (currentAnswers) => {
          const trimmed = currentAnswers.contactEmail?.trim() ?? "";
          return trimmed.length > 0 && emailRegex.test(trimmed);
        },
        render: ({ answers: currentAnswers, onAnswer, showError }) => (
          <ContactStep
            value={currentAnswers.contactEmail}
            onChange={(value) => onAnswer("contactEmail", value)}
            showError={showError}
          />
        ),
      },
      {
        id: "notes",
        title: "Anything else to share?",
        subtitle: "Optional notes help me prep before we connect.",
        isValid: () => true,
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
  const isCurrentStepValid = currentStep.isValid(answers);
  const showError = Boolean(touchedSteps[currentStep.id]);

  const setAnswer = useCallback(
    <Key extends keyof HireFlowAnswers>(
      key: Key,
      value: HireFlowAnswers[Key]
    ) => {
      setAnswers((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  useEffect(() => {
    if (!initialEmail) return;
    setAnswers((prev) =>
      prev.contactEmail ? prev : { ...prev, contactEmail: initialEmail }
    );
  }, [initialEmail]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(HIRE_FLOW_ANSWERS_KEY, JSON.stringify(answers));
    } catch {
      // localStorage full or unavailable — fail silently
    }
  }, [answers]);

  const nextStep = useCallback(() => {
    const isValid = currentStep.isValid(answers);
    if (!isValid) {
      setTouchedSteps((prev) => ({
        ...prev,
        [currentStep.id]: true,
      }));
      return false;
    }

    if (!isLastStep) {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }

    return true;
  }, [answers, currentStep, isLastStep, steps.length]);

  const previousStep = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const resetFlow = useCallback(() => {
    setStepIndex(0);
    setAnswers(initialEmail ? { contactEmail: initialEmail } : {});
    setTouchedSteps({});
  }, [initialEmail]);

  const clearStoredAnswers = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(HIRE_FLOW_ANSWERS_KEY);
    } catch {
      // fail silently
    }
  }, []);

  return {
    steps,
    stepIndex,
    currentStep,
    answers,
    setAnswer,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    isCurrentStepValid,
    showError,
    resetFlow,
    clearStoredAnswers,
  };
};

export default useHireFlow;
