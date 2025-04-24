import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Plan, PricingPlan } from "../plan";
import { useSampleMutation } from "../../../core/hooks/use-sample-mutation";
import userEvent from "@testing-library/user-event";

// Mock dependencies
vi.mock("../../../core/hooks/use-sample-mutation", () => ({
  useSampleMutation: vi.fn(),
}));

describe("PricingPlan", () => {
  const mockMutate = vi.fn();
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock useSampleMutation
    (useSampleMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      loading: false,
    });
  });

  const plan: Plan = {
    id: "basic",
    title: "Basic Plan",
    description: "A simple plan for beginners.",
    price: 9.99,
    features: ["Feature 1", "Feature 2", "Feature 3"],
    bestOffer: true,
  };

  it("renders the pricing plan correctly", () => {
    render(<PricingPlan plan={plan} onSelect={mockOnSelect} />);

    // Verify the title
    expect(screen.getByText("Basic Plan")).toBeInTheDocument();

    // Verify the price
    expect(screen.getByText("$9.99")).toBeInTheDocument();
    expect(screen.getByText("/month")).toBeInTheDocument();

    // Verify the description
    expect(
      screen.getByText("A simple plan for beginners.")
    ).toBeInTheDocument();

    // Verify the button
    expect(screen.getByText("Continue with Basic Plan")).toBeInTheDocument();

    // Verify the features
    plan.features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it("applies correct styles for the best offer plan", () => {
    render(<PricingPlan plan={plan} onSelect={mockOnSelect} />);

    // Verify background color for best offer
    const container = screen.getByText(plan.title).closest("div");
    expect(container).toHaveClass("bg-slate-600");

    // Verify text color for dark theme
    const titleElement = screen.getByText(plan.title);
    expect(titleElement).toHaveClass("text-gray-100"); // Adjust based on actual styles
  });

  it("applies correct styles for a non-best offer plan", () => {
    const nonBestOfferPlan = { ...plan, bestOffer: false };
    render(<PricingPlan plan={nonBestOfferPlan} onSelect={mockOnSelect} />);

    // Verify background color for non-best offer
    const container = screen.getByText(nonBestOfferPlan.title).closest("div");
    expect(container).toHaveClass("bg-white");

    // Verify text color for light theme
    const titleElement = screen.getByText(nonBestOfferPlan.title);
    expect(titleElement).toHaveClass("text-gray-900"); // Adjust based on actual styles
  });

  it("calls mutate and onSelect when the button is clicked", async () => {
    render(<PricingPlan plan={plan} onSelect={mockOnSelect} />);

    // Click the button
    await userEvent.click(screen.getByText("Continue with Basic Plan"));

    // Verify that mutate was called
    expect(mockMutate).toHaveBeenCalled();

    // Verify that onSelect was called
    expect(mockOnSelect).toHaveBeenCalled();
  });

  it("disables the button while loading", () => {
    // Mock loading state
    (useSampleMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockMutate,
      loading: true,
    });

    render(<PricingPlan plan={plan} onSelect={mockOnSelect} />);

    // Verify that the button is disabled during loading
    expect(screen.getByText("Continue with Basic Plan")).toBeDisabled();
  });

  it("renders a string price correctly", () => {
    const stringPricePlan = { ...plan, price: "Free" };
    render(<PricingPlan plan={stringPricePlan} onSelect={mockOnSelect} />);

    // Verify the price
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.queryByText("/month")).not.toBeInTheDocument();
  });

  it("renders all features with checkmarks", () => {
    render(<PricingPlan plan={plan} onSelect={mockOnSelect} />);

    // Verify that each feature has a checkmark
    plan.features.forEach((feature) => {
      // Find the container for the feature
      const featureContainer = screen.getByText(feature).closest("div");

      // Find the checkmark within the container
      const checkmark = featureContainer?.querySelector(".min-w-4");
      expect(checkmark).toBeInTheDocument();

      // Verify the checkmark contains an SVG icon
      expect(checkmark?.querySelector("svg")).toBeInTheDocument();
    });
  });
});
