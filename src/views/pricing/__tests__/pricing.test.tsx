import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pricing } from "../";
import { useOnboardingStore } from "../../../core/lib/onboarding-store";
import { useSampleMutation } from "../../../core/hooks/use-sample-mutation";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";

// Mock dependencies
vi.mock("../../../core/lib/onboarding-store", () => ({
  useOnboardingStore: vi.fn(),
}));

vi.mock("../../../core/hooks/use-sample-mutation", () => ({
  useSampleMutation: vi.fn(),
}));

describe("Pricing", () => {
  const mockSetSelectedPlan = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock useOnboardingStore
    (useOnboardingStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      setSelectedPlan: mockSetSelectedPlan,
    });

    // Mock useSampleMutation
    (useSampleMutation as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: vi.fn().mockResolvedValue(undefined), // Ensure mutate resolves successfully
      loading: false,
    });
  });

  it("renders the OnboardingStepHeader and all pricing plans", () => {
    render(<Pricing ticker="Step 2" onNext={mockOnNext} onPrev={() => {}} />);

    // Verify the header
    expect(screen.getByText("Choose a Plan")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select the research plan that best matches your team's needs, including pricing, features, and usage limits for future growth."
      )
    ).toBeInTheDocument();

    // Verify each plan's title is rendered
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Professional")).toBeInTheDocument();
    expect(screen.getByText("Business")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
  });

  it("calls setSelectedPlan and onNext when a plan is selected", async () => {
    render(<Pricing ticker="Step 2" onNext={mockOnNext} onPrev={() => {}} />);

    // Click the "Continue with Business" button
    const businessPlanButton = screen.getByText("Continue with Business");
    await userEvent.click(businessPlanButton);

    // Verify setSelectedPlan was called with the correct plan ID
    expect(mockSetSelectedPlan).toHaveBeenCalledWith("business");

    // Verify onNext was called
    expect(mockOnNext).toHaveBeenCalled();
  });

  it("applies correct styles for the best offer plan (Business)", () => {
    render(<Pricing ticker="Step 2" onNext={mockOnNext} onPrev={() => {}} />);

    // Verify the Business plan has the best offer styling
    const businessPlanContainer = screen.getByText("Business").closest("div");
    expect(businessPlanContainer).toHaveClass("bg-slate-600");
  });

  it("renders a string price correctly for the Enterprise plan", () => {
    render(<Pricing ticker="Step 2" onNext={mockOnNext} onPrev={() => {}} />);

    // Find the Enterprise plan container
    const enterprisePlan = screen.getByText("Enterprise").closest("div");
    if (!enterprisePlan) throw new Error("Enterprise plan container not found");

    // Verify the price for the Enterprise plan
    expect(within(enterprisePlan).getByText("Contact us")).toBeInTheDocument();

    // Ensure '/month' is not present in the Enterprise plan
    expect(
      within(enterprisePlan).queryByText("/month")
    ).not.toBeInTheDocument();
  });

  it("renders all features for each plan", () => {
    render(<Pricing ticker="Step 2" onNext={mockOnNext} onPrev={() => {}} />);

    // Verify features for the Basic plan
    const basicPlan = screen.getByText("Basic").closest("div");
    if (!basicPlan) throw new Error("Basic plan container not found");
    const basicFeatures = [
      "Up to 50 interviews per month",
      "AI‑moderated voice interviews",
      "Real‑time open‑ended response coding",
      "Basic export to CSV",
      "Email support",
    ];
    basicFeatures.forEach((feature) => {
      expect(within(basicPlan).getByText(feature)).toBeInTheDocument();
    });

    // Verify features for the Professional plan
    const professionalPlan = screen.getByText("Professional").closest("div");
    if (!professionalPlan)
      throw new Error("Professional plan container not found");
    const professionalFeatures = [
      "Up to 250 interviews per month",
      "All Basic features",
      "Advanced analytics dashboard",
      "Multilingual support (up to 10 languages)",
      "Priority email support",
    ];
    professionalFeatures.forEach((feature) => {
      expect(within(professionalPlan).getByText(feature)).toBeInTheDocument();
    });

    // Verify features for the Business plan
    const businessPlan = screen.getByText("Business").closest("div");
    if (!businessPlan) throw new Error("Business plan container not found");
    const businessFeatures = [
      "Unlimited interviews",
      "All Professional features",
      "Custom branding and white‑label reports",
      "Multilingual support (up to 25 languages)",
      "Dedicated account manager",
    ];
    businessFeatures.forEach((feature) => {
      expect(within(businessPlan).getByText(feature)).toBeInTheDocument();
    });

    // Verify features for the Enterprise plan
    const enterprisePlan = screen.getByText("Enterprise").closest("div");
    if (!enterprisePlan) throw new Error("Enterprise plan container not found");
    const enterpriseFeatures = [
      "Unlimited interviews",
      "All Business features",
      "Custom integration and API access",
      "Multilingual support (50+ languages)",
      "24/7 phone & Slack support",
      "Dedicated solutions architect",
    ];
    enterpriseFeatures.forEach((feature) => {
      expect(within(enterprisePlan).getByText(feature)).toBeInTheDocument();
    });
  });
});
