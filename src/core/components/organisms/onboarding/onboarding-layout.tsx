import { ReactNode } from "react";
import { Text } from "../../atoms/text";
import { Check } from "lucide-react";
import clsx from "clsx";

interface OnboardingLayout {
  steps: {
    icon: ReactNode;
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
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-slate-50">
      <div className="rounded-lg shadow flex flex-1 w-full overflow-hidden">
        <div className="min-w-[400px] w-[400px] bg-slate-100 p-4">
          <img
            src="https://cdn.prod.website-files.com/65bd57f97ae819ec48160896/67db3423118f745eb1ee9afb_1-Glaut-Positive.png"
            alt="Glaut"
            className="h-12 w-auto"
          />
          <div className="px-8 mt-6">
            <Text variant="subheadingSm" className="mb-8">
              Complete these steps to start running research
            </Text>
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={clsx("mb-12 flex items-start gap-4 relative", {
                  "opacity-50": !step.current && !step.done,
                })}
              >
                {step.done ? (
                  <div className="min-w-6 aspect-square bg-green-500 rounded-full relative">
                    <Check
                      className="absolute top-[50%] left-[50%] -translate-[50%] w-3 h-3 rounded-full text-white"
                      size={20}
                    />
                  </div>
                ) : step.current ? (
                  <div className="min-w-6 aspect-square bg-pink-500 rounded-full relative">
                    <div className="absolute top-[50%] left-[50%] -translate-[50%] w-3 h-3 rounded-full bg-white"></div>
                  </div>
                ) : (
                  step.icon
                )}
                {index < steps.length - 1 ? (
                  <div className="w-px absolute left-3 top-9 h-full bg-gray-300"></div>
                ) : (
                  <></>
                )}
                <div className="flex flex-col gap-2">
                  <Text variant="sidebarTitle" as="h1">
                    {step.title}
                  </Text>
                  <Text variant="sidebarDescription">{step.description}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto bg-white p-8 flex-1">{children}</div>
      </div>
    </div>
  );
};
