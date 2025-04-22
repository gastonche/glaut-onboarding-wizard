import { useOnboarding } from "../../../hooks/use-onboarding";
import { OnboardingLayout } from "./onboarding-layout";

export const Onboarding = () => {
  const {
    steps,
    currentStep: { component: CurrentStepComponent },
    currentStepIndex,
    next,
    prev,
  } = useOnboarding();

  return (
    <OnboardingLayout steps={steps}>
      <CurrentStepComponent
        ticker={`step ${currentStepIndex + 1} of ${steps.length}`}
        onNext={next}
        onPrev={prev}
      />
    </OnboardingLayout>
  );
};
