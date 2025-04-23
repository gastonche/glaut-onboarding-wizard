// onboarding-completed.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { OnboardingCompleted } from "..";
import { clearSession, useOnboardingStore } from "../../../core/lib/onboarding-store";

// Mock dependencies
vi.mock("../../../core/lib/onboarding-store", () => ({
  useOnboardingStore: vi.fn(),
  clearSession: vi.fn(),
}));

describe("OnboardingCompleted", () => {
  const mockClearSession = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock useOnboardingStore
    (useOnboardingStore as jest.Mock).mockReturnValue({
      plan: "Basic",
      billing: {
        cardHolderName: "John Doe",
        cardNumber: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "25",
        cvc: "123",
      },
      invites: ["user1@example.com", "user2@example.com"],
    });

    // Mock clearSession
    (clearSession as jest.Mock) = mockClearSession;
  });

  it("renders the welcome message and button", () => {
    render(<OnboardingCompleted />);

    // Verify the heading
    expect(screen.getByText("Welcome to Glaut!")).toBeInTheDocument();

    // Verify the subheading
    expect(
      screen.getByText(
        "You’re all set up and ready to start collaborating with your team. We’ll send you an email with a link to access your account. If you have any questions, please don’t hesitate to reach out to us."
      )
    ).toBeInTheDocument();

    // Verify the button
    expect(screen.getByText("Start researching")).toBeInTheDocument();
  });

  it("displays the background image correctly", () => {
    render(<OnboardingCompleted />);

    // Verify the background image
    const backgroundImage = screen.getByAltText("Glaut welcome");
    expect(backgroundImage).toBeInTheDocument();
    expect(backgroundImage).toHaveAttribute("src", "/welcome.svg");
    expect(backgroundImage).toHaveClass("opacity-10");
  });

  it("calls clearSession when the component mounts", () => {
    render(<OnboardingCompleted />);

    // Verify that clearSession was called
    expect(mockClearSession).toHaveBeenCalled();
  });

  it("logs plan, billing, and invites to the console on mount", () => {
    const consoleLogSpy = vi.spyOn(console, "log");

    render(<OnboardingCompleted />);

    // Verify that console.log was called with the correct arguments
    expect(consoleLogSpy).toHaveBeenCalledWith("completed");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Basic",
      {
        cardHolderName: "John Doe",
        cardNumber: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "25",
        cvc: "123",
      },
      ["user1@example.com", "user2@example.com"]
    );

    // Restore the original console.log
    consoleLogSpy.mockRestore();
  });
});
