import { create } from "zustand";
import { CardFormData } from "../../views/billing/card-form";

interface OnboardingStore {
  currentStep: string;
  plan: string;
  billing?: CardFormData;
  invites: string[];
  setSelectedPlan: (plan: string) => void;
  setCurrentStep: (step: string) => void;
  setBilling: (billing: CardFormData) => void;
  setInvites: (invites: string[]) => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: "pricing",
  plan: "",
  billing: undefined,
  invites: [],
  setSelectedPlan: (plan) => set({ plan }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setBilling: (billing) => set({ billing }),
  setInvites: (invites) => set({ invites }),
}));
