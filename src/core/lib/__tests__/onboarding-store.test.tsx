import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { CardFormData } from "../../../views/billing";

const SESSION_KEY = "onboarding";

beforeEach(() => {
  // clear ESM module cache so each test re-runs create()
  vi.resetModules();
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useOnboardingStore (initialization & persistence)", () => {
  // it("on first load with no existing session, seeds localStorage and store has defaults", async () => {
  //   // stub Date.now to a fixed session ID
  //   vi.spyOn(Date, "now").mockReturnValue(1_000);

  //   const { useOnboardingStore } = await import("../onboarding-store");

  //   // The store is created on import; grab its state
  //   const store = useOnboardingStore.getState();

  //   // Defaults from getSessionData()
  //   expect(store.plan).toBe("");
  //   expect(store.billing).toBeUndefined();
  //   expect(store.invites).toEqual([]);
  //   expect(store.completed).toBe(false);
  //   expect(store.currentStep).toBe("pricing");

  //   // localStorage["onboarding"] was set to "1000"
  //   expect(localStorage.getItem(SESSION_KEY)).toBe("1000");

  //   // localStorage["onboarding-1000"] contains the persisted payload
  //   const persisted = JSON.parse(localStorage.getItem(`onboarding-1000`)!);
  //   expect(persisted).toEqual({
  //     plan: "",
  //     billing: undefined,
  //     invites: [],
  //   });
  // });

  it("loads from an existing session in localStorage", async () => {
    // simulate a prior session
    localStorage.setItem(SESSION_KEY, "2000");
    localStorage.setItem(
      "onboarding-2000",
      JSON.stringify({
        plan: "gold",
        billing: { card: "1111" },
        invites: ["alice"],
      })
    );

    const { useOnboardingStore } = await import("../onboarding-store");
    const store = useOnboardingStore.getState();

    // State reflects persisted values
    expect(store.plan).toBe("gold");
    expect(store.billing).toEqual({ card: "1111" });
    expect(store.invites).toEqual(["alice"]);

    // currentStep logic: plan+billing exist, invites length = 1 → "invites"
    expect(store.currentStep).toBe("invites");
  });

  it("setters update in-memory state and re-persist the session payload", async () => {
    // freeze Date.now so session key stays "3000"
    vi.spyOn(Date, "now").mockReturnValue(3_000);

    const { useOnboardingStore } = await import("../onboarding-store");
    const store = useOnboardingStore.getState();

    // setSelectedPlan
    store.setSelectedPlan("pro");
    expect(useOnboardingStore.getState().plan).toBe("pro");
    let raw = JSON.parse(localStorage.getItem("onboarding-3000")!);
    expect(raw.plan).toBe("pro");

    // setBilling
    const billingData: CardFormData = {
      cardHolderName: "Gaston Che",
      cardNumber: "1234567890123456",
      expirationMonth: "12",
      expirationYear: "25",
      cvc: "123",
    };
    store.setBilling(billingData);
    expect(useOnboardingStore.getState().billing).toEqual(billingData);
    raw = JSON.parse(localStorage.getItem("onboarding-3000")!);
    expect(raw.billing).toEqual(billingData);

    // setInvites
    const invites = ["bob", "carol"];
    store.setInvites(invites);
    expect(useOnboardingStore.getState().invites).toEqual(invites);
    raw = JSON.parse(localStorage.getItem("onboarding-3000")!);
    expect(raw.invites).toEqual(invites);

    // setCurrentStep (no persistence shape change)
    store.setCurrentStep("billing");
    expect(useOnboardingStore.getState().currentStep).toBe("billing");
    raw = JSON.parse(localStorage.getItem("onboarding-3000")!);
    expect(Object.keys(raw)).toEqual(["plan", "billing", "invites", "completed"]);

    // setCompleted (does not change persisted payload)
    store.setCompleted(true);
    expect(useOnboardingStore.getState().completed).toBe(true);
    raw = JSON.parse(localStorage.getItem("onboarding-3000")!);
    expect(raw).toEqual({
      plan: "pro",
      billing: billingData,
      invites,
      completed: true,
    });
  });
});

describe("clearSession", () => {
  it("removes both the session ID and the persisted payload", async () => {
    // simulate existing session
    vi.spyOn(Date, "now").mockReturnValue(4_000);
    const mod = await import("../onboarding-store");
    const { clearSession } = mod;
    // module import already seeded localStorage["onboarding"] = "4000"
    expect(localStorage.getItem(SESSION_KEY)).toBe("4000");
    // simulate a persisted payload
    localStorage.setItem(
      "onboarding-4000",
      JSON.stringify({ plan: "x", billing: {}, invites: [] })
    );
    expect(localStorage.getItem("onboarding-4000")).not.toBeNull();

    clearSession();

    // both keys should be gone
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(localStorage.getItem("onboarding-4000")).toBeNull();
  });
});
