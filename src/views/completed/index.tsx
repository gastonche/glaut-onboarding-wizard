import { useEffect } from "react";
import { Button } from "../../core/components/atoms/button";
import { Text } from "../../core/components/atoms/text";
import {
  clearSession,
  useOnboardingStore,
} from "../../core/lib/onboarding-store";

export const OnboardingCompleted = () => {
  const { plan, billing, invites } = useOnboardingStore();

  useEffect(() => {
    console.log("completed");
    console.log(plan, billing, invites);
    clearSession();
  }, [billing, invites, plan]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      <img
        src="/welcome.svg"
        alt="Glaut welcome"
        className="max-w-full aspect-video object-contain absolute inset-0 opacity-10 w-full"
      />
      <Text variant="headingLg" className="mb-4">
        Welcome to Glaut!
      </Text>
      <Text variant="subheadingSm" className="mb-8 max-w-[550px] text-center">
        You’re all set up and ready to start collaborating with your team. We’ll
        send you an email with a link to access your account. If you have any
        questions, please don’t hesitate to reach out to us.
      </Text>
      <Button variant="primary-outline">Start researching</Button>
    </div>
  );
};
