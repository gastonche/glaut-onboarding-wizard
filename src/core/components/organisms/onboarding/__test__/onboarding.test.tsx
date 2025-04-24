import React, { PropsWithChildren } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { Onboarding } from "../";
import { BillingProps } from "../../../../../views/billing";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mockedUseOnboardingReturn: any;

vi.mock("../../../../hooks/use-onboarding", () => ({
  useOnboarding: () => mockedUseOnboardingReturn,
}));

vi.mock("../../../../../views/completed", () => ({
  OnboardingCompleted: () => (
    <div data-testid="completed-screen">Completed</div>
  ),
}));

vi.mock("../onboarding-layout", () => ({
  OnboardingLayout: ({ children }: PropsWithChildren) => (
    <div data-testid="layout">{children}</div>
  ),
}));

const mockNext = vi.fn();
const mockPrev = vi.fn();
const mockSteps = [{ name: "Step 1" }, { name: "Step 2" }];

// 📦 Fake component to stand in for current step
const MockStepComponent = ({ ticker, onNext, onPrev }: BillingProps) => (
  <div data-testid="step">
    {ticker}
    <button onClick={onNext}>Next</button>
    <button onClick={onPrev}>Back</button>
  </div>
);

describe("Onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders current step when not completed", () => {
    mockedUseOnboardingReturn = {
      steps: mockSteps,
      currentStep: { component: MockStepComponent },
      currentStepIndex: 0,
      completed: false,
      next: mockNext,
      prev: mockPrev,
    };

    render(<Onboarding />);

    expect(screen.getByTestId("layout")).toBeInTheDocument();
    expect(screen.getByTestId("step")).toHaveTextContent("step 1 of 2");

    fireEvent.click(screen.getByText("Next"));
    fireEvent.click(screen.getByText("Back"));

    expect(mockNext).toHaveBeenCalled();
    expect(mockPrev).toHaveBeenCalled();
  });

  it("renders completed screen when completed is true", () => {
    mockedUseOnboardingReturn = {
      steps: mockSteps,
      currentStep: { component: MockStepComponent },
      currentStepIndex: 1,
      completed: true,
      next: mockNext,
      prev: mockPrev,
    };

    render(<Onboarding />);
    expect(screen.getByTestId("completed-screen")).toBeInTheDocument();
  });
});
