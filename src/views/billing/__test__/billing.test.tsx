import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Billing } from "..";
import { useOnboardingStore } from "../../../core/lib/onboarding-store";
import { useSampleMutation } from "../../../core/hooks/use-sample-mutation";
import userEvent from "@testing-library/user-event";

vi.mock("../../../core/lib/onboarding-store", () => ({
  useOnboardingStore: vi.fn(),
}));

vi.mock("../../../core/hooks/use-sample-mutation", () => ({
  useSampleMutation: vi.fn(),
}));

describe("Billing", () => {
  const mockSetBilling = vi.fn();
  const mockMutate = vi.fn(() => Promise.resolve());
  const mockOnNext = vi.fn();
  const mockOnPrev = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useOnboardingStore as jest.Mock).mockReturnValue({
      setBilling: mockSetBilling,
      billing: {
        cardHolderName: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        cvc: "",
      },
    });

    (useSampleMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      loading: false,
    });
  });

  it("renders all fields and buttons", () => {
    render(<Billing ticker="Ticker" onNext={mockOnNext} onPrev={mockOnPrev} />);

    expect(screen.getByLabelText("Card Holder Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Credit Card Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("MM")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("YY")).toBeInTheDocument();
    expect(screen.getByLabelText("CVC")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("calls onPrev when Back button is clicked", () => {
    render(<Billing ticker="Ticker" onNext={mockOnNext} onPrev={mockOnPrev} />);
    fireEvent.click(screen.getByText("Back"));
    expect(mockOnPrev).toHaveBeenCalled();
  });

  it("submits form with valid inputs", async () => {
    render(<Billing ticker="Ticker" onNext={mockOnNext} onPrev={mockOnPrev} />);

    fireEvent.input(screen.getByLabelText("Card Holder Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.input(screen.getByLabelText("Credit Card Number"), {
      target: { value: "4111111111111111" },
    });
    fireEvent.input(screen.getByPlaceholderText("MM"), {
      target: { value: "12" },
    });
    fireEvent.input(screen.getByPlaceholderText("YY"), {
      target: { value: "25" },
    });
    fireEvent.input(screen.getByLabelText("CVC"), {
      target: { value: "123" },
    });

    await waitFor(() => {
      expect(screen.getByText("Next")).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(mockSetBilling).toHaveBeenCalledWith({
        cardHolderName: "Jane Doe",
        cardNumber: "4111111111111111",
        expirationMonth: "12",
        expirationYear: "25",
        cvc: "123",
      });

      expect(mockMutate).toHaveBeenCalled();
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  it("displays validation errors when fields are empty", async () => {
    render(<Billing ticker="Ticker" onNext={mockOnNext} onPrev={mockOnPrev} />);

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText(/card holder name/i)).toBeInTheDocument();
      expect(screen.getByText(/credit card number/i)).toBeInTheDocument();
      expect(screen.getByText(/expiration date/i)).toBeInTheDocument();
      expect(screen.getByText(/cvc/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors when fields are touched and left invalid", async () => {
    render(<Billing ticker="ABC" onNext={vi.fn()} onPrev={vi.fn()} />);
    // Simulate typing and clearing each field
    const cardHolderNameInput = screen.getByLabelText("Card Holder Name");
    await userEvent.type(cardHolderNameInput, "Jane Doe");
    await userEvent.clear(cardHolderNameInput);
    expect(
      screen.getByText(/card holder name is required/i)
    ).toBeInTheDocument();

    const cardNumberInput = screen.getByLabelText("Credit Card Number");
    await userEvent.type(cardNumberInput, "1234");
    await userEvent.clear(cardNumberInput);
    expect(
      screen.getByText(/Credit card number must be exactly 16 digits/i)
    ).toBeInTheDocument();

    const expirationMonthInput = screen.getByPlaceholderText("MM");
    await userEvent.type(expirationMonthInput, "1");
    await userEvent.clear(expirationMonthInput);
    expect(
      screen.getByText(/Month must be between 01 and 12/i)
    ).toBeInTheDocument();

    const expirationYearInput = screen.getByPlaceholderText("YY");
    await userEvent.type(expirationYearInput, "2");
    await userEvent.clear(expirationYearInput);
    expect(screen.getByText(/Year must be two digits/i)).toBeInTheDocument();

    const cvcInput = screen.getByLabelText("CVC");
    await userEvent.type(cvcInput, "12");
    await userEvent.clear(cvcInput);
    expect(
      screen.getByText(/CVC must be exactly 3 digits/i)
    ).toBeInTheDocument();

    // Ensure the Next button remains disabled
    expect(screen.getByText("Next")).toBeDisabled();
  });

  it('disables the submit button when the form is invalid', async () => {
    render(<Billing ticker="ABC" onNext={vi.fn()} onPrev={vi.fn()} />);
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Card Holder Name'), 'Jane Doe');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Credit Card Number'), '1234123412341234');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText('MM'), '12');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByPlaceholderText('YY'), '25');
    expect(screen.getByText('Next')).toBeDisabled();
    await userEvent.type(screen.getByLabelText('CVC'), '123');
    expect(screen.getByText('Next')).toBeEnabled();
  });
});
