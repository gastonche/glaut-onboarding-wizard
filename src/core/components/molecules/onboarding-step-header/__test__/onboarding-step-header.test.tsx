import { render, screen } from "@testing-library/react";
import { OnboardingStepHeader } from "../";
import { describe, it, expect } from "vitest";

describe("OnboardingStepHeader", () => {
  const props = {
    title: "Choose your plan",
    subtitle: "Select the plan that best suits your team",
    ticker: "Step 1 of 3",
  };

  it("renders the ticker with correct variant", () => {
    render(<OnboardingStepHeader {...props} />);
    const ticker = screen.getByText(props.ticker);
    expect(ticker).toBeInTheDocument();
    expect(ticker).toHaveClass("text-xs", "uppercase", "font-medium");
  });

  it("renders the title with headingLg variant styles", () => {
    render(<OnboardingStepHeader {...props} />);
    const title = screen.getByText(props.title);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-2xl", "font-bold");
  });

  it("renders the subtitle with subheadingSm variant styles", () => {
    render(<OnboardingStepHeader {...props} />);
    const subtitle = screen.getByText(props.subtitle);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass("text-sm");
  });

  it("adds margin to the title text", () => {
    render(<OnboardingStepHeader {...props} />);
    const title = screen.getByText(props.title);
    expect(title).toHaveClass("my-4");
  });
});
