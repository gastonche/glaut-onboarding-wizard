import { Text } from "../../atoms/text";

interface OnboardingStepHeader {
  title: string;
  subtitle: string;
  ticker: string;
}

export const OnboardingStepHeader = ({
  title,
  subtitle,
  ticker,
}: OnboardingStepHeader) => {
  return (
    <>
      <Text variant="labelXs">{ticker}</Text>
      <Text variant="headingLg" className="my-4">
        {title}
      </Text>
      <Text variant="subheadingSm">{subtitle}</Text>
    </>
  );
};
