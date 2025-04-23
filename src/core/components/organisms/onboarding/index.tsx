import { OnboardingCompleted } from "../../../../views/pricing/completed";
import { useOnboarding } from "../../../hooks/use-onboarding";
import { OnboardingLayout } from "./onboarding-layout";

export const Onboarding = () => {
  const {
    steps,
    currentStep: { component: CurrentStepComponent },
    currentStepIndex,
    completed,
    next,
    prev,
  } = useOnboarding();

  return (
    <OnboardingLayout steps={steps}>
      {completed ? (
        <OnboardingCompleted />
      ) : (
        <CurrentStepComponent
          ticker={`step ${currentStepIndex + 1} of ${steps.length}`}
          onNext={next}
          onPrev={prev}
        />
      )}
    </OnboardingLayout>
  );
};
