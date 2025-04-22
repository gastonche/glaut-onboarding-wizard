import { FC } from "react";
import { BillingProps } from "../billing";
import { OnboardingStepHeader } from "../../core/components/molecules/onboarding-step-header";
import { Plan, PricingPlan } from "./plan";
import { useOnboardingStore } from "../../core/lib/onboarding-store";

const plans: Plan[] = [
  {
    id: "basic",
    title: "Basic",
    description:
      "Ideal for small teams getting started with AI‑moderated interviews.",
    price: 49,
    features: [
      "Up to 50 interviews per month",
      "AI‑moderated voice interviews",
      "Real‑time open‑ended response coding",
      "Basic export to CSV",
      "Email support",
    ],
  },
  {
    id: "professional",
    title: "Professional",
    description: "For growing teams that need advanced insights and reporting.",
    price: 199,
    features: [
      "Up to 250 interviews per month",
      "All Basic features",
      "Advanced analytics dashboard",
      "Multilingual support (up to 10 languages)",
      "Priority email support",
    ],
  },
  {
    id: "business",
    title: "Business",
    description: "Best for mid‑sized organizations requiring custom workflows.",
    price: 499,
    features: [
      "Unlimited interviews",
      "All Professional features",
      "Custom branding and white‑label reports",
      "Multilingual support (up to 25 languages)",
      "Dedicated account manager",
    ],
    bestOffer: true,
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description:
      "Tailored solutions with enterprise‑grade security and support.",
    price: "Contact us",
    features: [
      "Unlimited interviews",
      "All Business features",
      "Custom integration and API access",
      "Multilingual support (50+ languages)",
      "24/7 phone & Slack support",
      "Dedicated solutions architect",
    ],
  },
];

export const Pricing: FC<BillingProps> = ({ ticker, onNext }) => {
  const { setSelectedPlan } = useOnboardingStore();
  return (
    <>
      <OnboardingStepHeader
        title="Choose a Plan"
        subtitle="Select the research plan that best matches your team's needs, including pricing, features, and usage limits for future growth."
        ticker={ticker}
      />
      <div className="flex flex-wrap gap-4 mt-8">
        {plans.map((plan) => (
          <PricingPlan
            key={plan.id}
            plan={plan}
            onSelect={() => {
              setSelectedPlan(plan.id);
              onNext();
            }}
          />
        ))}
      </div>
    </>
  );
};
