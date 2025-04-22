import { FC } from "react";
import { OnboardingStepHeader } from "../../core/components/molecules/onboarding-step-header";
import { CardForm } from "./card-form";
import { useSampleMutation } from "../../core/hooks/use-sample-mutation";
import { useOnboardingStore } from "../../core/lib/onboarding-store";

export interface BillingProps {
  onNext: () => void;
  onPrev: () => void;
  ticker: string;
}

export const Billing: FC<BillingProps> = ({ ticker, onNext, onPrev }) => {
  const { setBilling } = useOnboardingStore();
  const { mutate, loading: submitting } = useSampleMutation();
  return (
    <>
      <OnboardingStepHeader
        title="Set Up Billing"
        subtitle="Enter your credit card details securely to enable billing, recurring payments, and proper invoicing through our trusted gateway."
        ticker={ticker}
      />
      <CardForm
        onSubmit={async (cardData) => {
          setBilling(cardData);
          await mutate();
          onNext();
        }}
        submitting={submitting}
        onGoBack={onPrev}
      />
    </>
  );
};
