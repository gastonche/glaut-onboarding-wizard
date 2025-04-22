import { create } from "zustand";

interface OnboardingStore {
  currentStep: string;
  plan: string;
  billing: unknown;
  invites: string[];
  setSelectedPlan: (plan: string) => void;
  setCurrentStep: (step: string) => void;
  setBilling: (billing: unknown) => void;
  setInvites: (invites: string[]) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: "",
  plan: "",
  billing: {},
  invites: [],
  setSelectedPlan: (plan: string) => set({ plan }),
  setCurrentStep: (step: string) => set({ currentStep: step }),
  setBilling: (billing: unknown) => set({ billing }),
  setInvites: (invites: string[]) => set({ invites }),
}));
