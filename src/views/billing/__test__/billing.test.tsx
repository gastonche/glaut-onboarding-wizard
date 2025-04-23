// billing.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Billing } from "..";
import { useSampleMutation } from "../../../core/hooks/use-sample-mutation";
import { useOnboardingStore } from "../../../core/lib/onboarding-store";
import userEvent from "@testing-library/user-event";

// Mock dependencies
vi.mock("../../../core/hooks/use-sample-mutation", () => ({
  useSampleMutation: vi.fn(),
}));

vi.mock("../../../core/lib/onboarding-store", () => ({
  useOnboardingStore: vi.fn(),
}));

describe("Billing", () => {
  const mockSetBilling = vi.fn();
  const mockMutate = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrev = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock useOnboardingStore
    (useOnboardingStore as jest.Mock).mockReturnValue({
      setBilling: mockSetBilling,
      billing: {
        cardHolderName: "John Doe",
        cardNumber: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "25",
        cvc: "123",
      },
    });

    // Mock useSampleMutation
    (useSampleMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      loading: false,
    });
  });

  it("renders the OnboardingStepHeader and CardForm components", () => {
    render(<Billing ticker="Step 3" onNext={mockOnNext} onPrev={mockOnPrev} />);
    expect(screen.getByText("Set Up Billing")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your credit card details securely to enable billing, recurring payments, and proper invoicing through our trusted gateway."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("calls setBilling and mutate when form is submitted", async () => {
    render(<Billing ticker="Step 3" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Simulate filling out the form
    const cardHolderNameInput = screen.getByLabelText("Card Holder Name");
    await userEvent.clear(cardHolderNameInput);
    await userEvent.type(screen.getByLabelText("Card Holder Name"), "Mary Doe");
    await userEvent.type(
      screen.getByLabelText("Credit Card Number"),
      "4111111111111111"
    );
    await userEvent.type(screen.getByPlaceholderText("MM"), "12");
    await userEvent.type(screen.getByPlaceholderText("YY"), "25");
    await userEvent.type(screen.getByLabelText("CVC"), "123");

    // Submit the form
    await userEvent.click(screen.getByText("Next"));

    // Verify that setBilling was called with the correct data
    expect(mockSetBilling).toHaveBeenCalledWith({
      cardHolderName: "Mary Doe",
      cardNumber: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "25",
      cvc: "123",
    });

    // Verify that mutate was called
    expect(mockMutate).toHaveBeenCalled();

    // Verify that onNext was called
    expect(mockOnNext).toHaveBeenCalled();
  });

  it("disables the Next button while submitting", async () => {
    // Mock loading state
    (useSampleMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      loading: true,
    });

    render(<Billing ticker="Step 3" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Verify that the Next button is disabled during submission
    expect(screen.getByText("Submitting...")).toBeInTheDocument();
    expect(screen.getByText("Submitting...")).toBeDisabled();
  });

  it("calls onPrev when Back button is clicked", async () => {
    render(<Billing ticker="Step 3" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Click the Back button
    await userEvent.click(screen.getByText("Back"));

    // Verify that onPrev was called
    expect(mockOnPrev).toHaveBeenCalled();
  });

  it("pre-fills the form with default values from the store", () => {
    render(<Billing ticker="Step 3" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Verify that the form fields are pre-filled with default values
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("4111111111111111")).toBeInTheDocument();
    expect(screen.getByDisplayValue("12")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();
  });
});
