import { useOnboarding } from "../../../hooks/use-onboarding";
import { OnboardingLayout } from "./onboarding-layout";

export const Onboarding = () => {
  const { steps } = useOnboarding();

  return (
    <OnboardingLayout steps={steps}>
      <></>
    </OnboardingLayout>
  );
};
