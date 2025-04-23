// invites.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Invites } from "../";
import { useOnboardingStore } from "../../../core/lib/onboarding-store";
import { useSampleMutation } from "../../../core/hooks/use-sample-mutation";
import userEvent from "@testing-library/user-event";

// Mock dependencies
vi.mock("../../../core/lib/onboarding-store", () => ({
  useOnboardingStore: vi.fn(),
}));

vi.mock("../../../core/hooks/use-sample-mutation", () => ({
  useSampleMutation: vi.fn(),
}));

describe("Invites", () => {
  const mockSetInvites = vi.fn();
  const mockMutate = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnPrev = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock useOnboardingStore
    (useOnboardingStore as jest.Mock).mockReturnValue({
      invites: ["test1@example.com", "test2@example.com"],
      setInvites: mockSetInvites,
    });

    // Mock useSampleMutation
    (useSampleMutation as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      loading: false,
    });
  });

  it("renders the OnboardingStepHeader and form elements", () => {
    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);
    expect(screen.getByText("Invite Teammates")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add your team members by entering their email addresses so they can collaborate with you inside the platform right after onboarding."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Invite team mates by email")
    ).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Finish")).toBeInTheDocument();
  });

  it("adds an invite when the form is submitted", async () => {
    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Simulate typing into the email input field
    await userEvent.type(
      screen.getByLabelText("Invite team mates by email"),
      "newuser@example.com"
    );
    await userEvent.click(screen.getByText("Add another"));

    // Verify that setInvites was called with the new email
    expect(mockSetInvites).toHaveBeenCalledWith([
      "test1@example.com",
      "test2@example.com",
      "newuser@example.com",
    ]);
  });

  it("removes an invite when the trash icon is clicked", async () => {
    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Find all trash buttons
    const trashButtons = screen.getAllByRole("button", {
      name: "Remove invite",
    });

    // Click the trash button for the first invite
    await userEvent.click(trashButtons[0]);

    // Verify that setInvites was called without the removed email
    expect(mockSetInvites).toHaveBeenCalledWith(["test2@example.com"]);
  });

  it("disables the Finish button when there are no invites", () => {
    // Mock an empty invites array
    (useOnboardingStore as jest.Mock).mockReturnValue({
      invites: [],
      setInvites: mockSetInvites,
    });

    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Verify that the Finish button is disabled
    expect(screen.getByText("Finish")).toBeDisabled();
  });

  it("calls onNext after clicking the Finish button", async () => {
    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Click the Finish button
    await userEvent.click(screen.getByText("Finish"));

    // Verify that mutate and onNext were called
    expect(mockMutate).toHaveBeenCalled();
    expect(mockOnNext).toHaveBeenCalled();
  });

  it("calls onPrev when the Back button is clicked", async () => {
    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Click the Back button
    await userEvent.click(screen.getByText("Back"));

    // Verify that onPrev was called
    expect(mockOnPrev).toHaveBeenCalled();
  });

  it("displays all existing invites from the store", () => {
    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Verify that all existing invites are displayed
    expect(screen.getByText("test1@example.com")).toBeInTheDocument();
    expect(screen.getByText("test2@example.com")).toBeInTheDocument();
  });

  it("displays a separator between invites", () => {
    render(<Invites ticker="Step 4" onNext={mockOnNext} onPrev={mockOnPrev} />);

    // Verify that a separator is displayed between the invites
    const separators = screen.getAllByRole("separator");
    expect(separators.length).toBe(1); // Only one separator between two invites
  });
});
