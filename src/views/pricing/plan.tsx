import { Check } from "lucide-react";
import { Text } from "../../core/components/atoms/text";
import { Button } from "../../core/components/atoms/button";
import clsx from "clsx";
import { useSampleMutation } from "../../core/hooks/use-sample-mutation";

export interface Plan {
  id: string;
  title: string;
  description: string;
  price: string | number;
  features: string[];
  bestOffer?: boolean;
}

export const PricingPlan = ({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: () => void;
}) => {
  const { mutate, loading } = useSampleMutation();

  return (
    <div
      key={plan.id}
      className={clsx(
        "flex flex-col justify-start rounded-lg py-8 px-4 cursor-pointer max-w-[300px]",
        {
          "bg-slate-600": plan.bestOffer,
          "bg-white": !plan.bestOffer,
        }
      )}
    >
      <Text
        variant="headingLg"
        className="opacity-50 text-lg"
        mode={plan.bestOffer ? "dark" : "light"}
      >
        {plan.title}
      </Text>
      <div className="mb-4 flex gap-1 items-end">
        {typeof plan.price === "string" ? (
          <Text
            variant="bodyMd"
            className="!text-3xl"
            mode={plan.bestOffer ? "dark" : "light"}
          >
            {plan.price}
          </Text>
        ) : (
          <>
            <Text
              variant="bodyMd"
              className="!text-3xl"
              mode={plan.bestOffer ? "dark" : "light"}
            >
              ${plan.price}
            </Text>
            <Text variant="bodySm" mode={plan.bestOffer ? "dark" : "light"}>
              /month
            </Text>
          </>
        )}
      </div>
      <Text variant="subheadingSm" mode={plan.bestOffer ? "dark" : "light"}>
        {plan.description}
      </Text>
      <Button
        className="my-4"
        onClick={async () => {
          await mutate();
          onSelect();
        }}
        loading={loading}
      >
        Continue with {plan.title}
      </Button>
      <div className="mt-4 flex flex-col gap-4">
        {plan.features.map((feature) => (
          <Text
            variant="bodySm"
            key={feature}
            className="flex items-center gap-2"
            mode={plan.bestOffer ? "dark" : "light"}
          >
            <span className="min-w-4 h-4 rounded-full bg-slate-400 flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </span>
            {feature}
          </Text>
        ))}
      </div>
    </div>
  );
};
