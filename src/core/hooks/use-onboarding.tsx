import { FC } from "react";
import { useOnboardingStore } from "../lib/onboarding-store";
import { Pricing } from "../../views/pricing";
import { Billing } from "../../views/billing";
import { Invites } from "../../views/invites";

interface Step {
  id: string;
  title: string;
  description: string;
  component: FC<{ onNext: () => void; onPrev: () => void }>;
}

const STEPS: Step[] = [
  {
    id: "plan",
    title: "Choose a Plan",
    description:
      "Select the SaaS plan that best matches your team's needs, including pricing, features, and usage limits for future growth.",
    component: Pricing,
  },
  {
    id: "billing",
    title: "Set Up Billing",
    description:
      "Enter your credit card details securely to enable billing, recurring payments, and proper invoicing through our trusted gateway.",
    component: Billing,
  },
  {
    id: "invitees",
    title: "Invite Teammates",
    description:
      "Add your team members by entering their email addresses so they can collaborate with you inside the platform right after onboarding.",
    component: Invites,
  },
];

const getStepIndex = (stepId: string) => {
  return STEPS.findIndex((step) => step.id === stepId);
};

export const useOnboarding = () => {
  const onboarding = useOnboardingStore();

  const next = () => {
    const nextStepIndex = getStepIndex(onboarding.currentStep) + 1;

    if (nextStepIndex < STEPS.length) {
      onboarding.setCurrentStep(STEPS[nextStepIndex].id);
    }
  };

  const prev = () => {
    const prevStepIndex = getStepIndex(onboarding.currentStep) - 1;

    if (prevStepIndex >= 0) {
      onboarding.setCurrentStep(STEPS[prevStepIndex].id);
    }
  };

  const steps = STEPS.map((step) => ({
    ...step,
    current: step.id === onboarding.currentStep,
    done: getStepIndex(step.id) < getStepIndex(onboarding.currentStep),
  }));

  return {
    ...onboarding,
    steps,
    currentStep: steps[getStepIndex(onboarding.currentStep)],
    next,
    prev,
  };
};
