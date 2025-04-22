
import { ReactNode } from "react";

interface OnboardingLayout {
  steps: {
    id: string;
    title: string;
    description: string;
    current: boolean;
    done: boolean;
  }[];
  children: ReactNode;
}

export const OnboardingLayout = ({ steps, children }: OnboardingLayout) => {
  return (
    <div className="m-2 rounded-md shadow-md grid grid-cols-5">
      <div className="col-span-2">
        {steps.map((step) => (
          <div>{step.title}</div>
        ))}
      </div>
      <div className="col-span-3">{children}</div>
    </div>
  );
};
