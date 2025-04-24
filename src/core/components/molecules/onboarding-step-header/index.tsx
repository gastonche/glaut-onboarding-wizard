import { ReactNode } from "react";
import { Text } from "../../atoms/text";

interface OnboardingStepHeader {
  title: string;
  subtitle: string;
  ticker: string;
  controls?: (ticker: ReactNode) => ReactNode;
}

export const OnboardingStepHeader = ({
  title,
  subtitle,
  ticker,
  controls,
}: OnboardingStepHeader) => {
  return (
    <>
      {controls ? (
        controls(<Text variant="labelXs">{ticker}</Text>)
      ) : (
        <Text variant="labelXs">{ticker}</Text>
      )}
      <Text variant="headingLg" className="my-4">
        {title}
      </Text>
      <Text variant="subheadingSm">{subtitle}</Text>
    </>
  );
};
