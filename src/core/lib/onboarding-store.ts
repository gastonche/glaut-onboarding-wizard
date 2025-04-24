import { create } from "zustand";
import { CardFormData } from "../../views/billing";

interface OnboardingStore {
  currentStep: string;
  plan: string;
  billing?: CardFormData;
  invites: string[];
  completed: boolean;
  setSelectedPlan: (plan: string) => void;
  setCompleted: (completed: boolean) => void;
  setCurrentStep: (step: string) => void;
  setBilling: (billing: CardFormData) => void;
  setInvites: (invites: string[]) => void;
}

const getOrCreateSessionId = () => {
  const sessionId = localStorage.getItem("onboarding");
  if (sessionId) {
    return sessionId;
  }
  const newSessionId = Date.now().toString();
  localStorage.setItem("onboarding", newSessionId);
  return newSessionId;
};

export const clearSession = () => {
  localStorage.removeItem(`onboarding-${getOrCreateSessionId()}`);
  localStorage.removeItem("onboarding");
};

const persistSession = ({
  plan,
  billing,
  invites,
  completed,
}: Pick<OnboardingStore, "plan" | "billing" | "invites" | "completed">) => {
  localStorage.setItem(
    `onboarding-${getOrCreateSessionId()}`,
    JSON.stringify({ plan, billing, invites, completed })
  );
};

const getSessionData = () => {
  const sessionId = getOrCreateSessionId();
  const sessionData = localStorage.getItem(`onboarding-${sessionId}`);
  if (!sessionData) {
    return {
      plan: "",
      billing: undefined,
      invites: [],
      completed: false,
      currentStep: "pricing",
    };
  }
  const data = JSON.parse(sessionData);
  const currentStep = !data.plan
    ? "pricing"
    : !data.billing
    ? "billing"
    : "invites";
  return {
    ...data,
    currentStep,
    completed: data.completed
  };
};

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  ...getSessionData(),
  setSelectedPlan: (plan) => set({ plan }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setBilling: (billing) => set({ billing }),
  setInvites: (invites) => set({ invites }),
  setCompleted: (completed) => set({ completed }),
}));

useOnboardingStore.subscribe((state) => persistSession(state));
