// src/core/hooks/__test__/use-onboarding.test.ts
import { renderHook, act } from "@testing-library/react";
import { useOnboarding } from "../use-onboarding";
import { vi, describe, it, expect, beforeEach } from "vitest";
import * as OnboardingStore from "../../lib/onboarding-store";

const mockSetCurrentStep = vi.fn();
const mockSetCompleted = vi.fn();

describe("useOnboarding", () => {
  // helper to set up the store mock
  const setup = (currentStep: string, completed = false) => {
    vi.spyOn(OnboardingStore, "useOnboardingStore").mockReturnValue({
      currentStep,
      completed,
      setCurrentStep: mockSetCurrentStep,
      setCompleted: mockSetCompleted,
    });
    return renderHook(() => useOnboarding());
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initial state: steps array, current flags, done flags, currentStep & index", () => {
    const { result } = setup("pricing", false);
    const { steps, currentStep, currentStepIndex } = result.current;

    // 3 steps with correct IDs
    expect(steps).toHaveLength(3);
    expect(steps.map((s) => s.id)).toEqual(["pricing", "billing", "invites"]);

    // first step is current, none are done
    expect(steps[0].current).toBe(true);
    expect(steps[0].done).toBe(false);
    expect(steps[1].done).toBe(false);
    expect(steps[2].done).toBe(false);

    // currentStep & index reflect "pricing"
    expect(currentStep.id).toBe("pricing");
    expect(currentStepIndex).toBe(0);
  });

  it("next() advances to the next step when not on the last step", () => {
    const { result } = setup("pricing", false);

    act(() => {
      result.current.next();
    });

    // should call setCurrentStep with "billing"
    expect(mockSetCurrentStep).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentStep).toHaveBeenCalledWith("billing");
    expect(mockSetCompleted).not.toHaveBeenCalled();
  });

  it("next() marks completed when on the last step", () => {
    const { result } = setup("invites", false);

    act(() => {
      result.current.next();
    });

    // should call setCompleted(true) and not change step
    expect(mockSetCompleted).toHaveBeenCalledTimes(1);
    expect(mockSetCompleted).toHaveBeenCalledWith(true);
    expect(mockSetCurrentStep).not.toHaveBeenCalled();
  });

  it("prev() moves back one step when in the middle", () => {
    const { result } = setup("billing", false);

    act(() => {
      result.current.prev();
    });

    // should call setCurrentStep with "pricing"
    expect(mockSetCurrentStep).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentStep).toHaveBeenCalledWith("pricing");
  });

  it("prev() does nothing when on the first step", () => {
    const { result } = setup("pricing", false);

    act(() => {
      result.current.prev();
    });

    expect(mockSetCurrentStep).not.toHaveBeenCalled();
  });

  it("done flags are set for steps before the current one", () => {
    const { result } = setup("billing", false);
    const { steps } = result.current;

    // pricing (index 0) should be done
    expect(steps[0].done).toBe(true);

    // billing (current) not done
    expect(steps[1].current).toBe(true);
    expect(steps[1].done).toBe(false);

    // invites (after) not done
    expect(steps[2].done).toBe(false);
  });

  it("all steps are marked done when completed === true", () => {
    const { result } = setup("billing", true);
    const { steps } = result.current;

    expect(steps.every((s) => s.done)).toBe(true);
  });
});
