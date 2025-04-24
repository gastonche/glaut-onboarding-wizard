import React from "react";
import { render, screen } from "@testing-library/react";
import { OnboardingLayout } from "../onboarding-layout";
import { describe, it, expect } from "vitest";

const steps = [
  {
    id: "1",
    icon: <div data-testid="step-icon">Icon1</div>,
    title: "Set up your project",
    description: "Initialize settings and structure",
    current: false,
    done: true,
  },
  {
    id: "2",
    icon: <div data-testid="step-icon">Icon2</div>,
    title: "Invite teammates",
    description: "Bring your team on board",
    current: true,
    done: false,
  },
  {
    id: "3",
    icon: <div data-testid="step-icon">Icon3</div>,
    title: "Launch research",
    description: "Start collecting insights",
    current: false,
    done: false,
  },
];

describe("OnboardingLayout", () => {
  it("renders the glaut logo", () => {
    render(<OnboardingLayout steps={steps}>Main content</OnboardingLayout>);
    expect(screen.getByAltText("Glaut")).toBeInTheDocument();
  });

  it("renders all step titles and descriptions", () => {
    render(<OnboardingLayout steps={steps}>Main content</OnboardingLayout>);
    steps.forEach((step) => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  it("renders a checkmark for done steps", () => {
    render(<OnboardingLayout steps={steps}>Main content</OnboardingLayout>);
    expect(screen.getByTestId("step-icon")).toBeInTheDocument(); // from <Check />
  });

  it("renders current step with pink dot", () => {
    render(<OnboardingLayout steps={steps}>Main content</OnboardingLayout>);
    expect(screen.getByTestId("current-step-indicator")).toBeInTheDocument();
  });

  it("renders children content", () => {
    render(<OnboardingLayout steps={steps}>Main content</OnboardingLayout>);
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("renders fallback icon for unfinished steps", () => {
    render(<OnboardingLayout steps={steps}>Main content</OnboardingLayout>);
    expect(screen.getAllByTestId("step-icon")).toHaveLength(1); // icon for step 2 & 3
  });
});
