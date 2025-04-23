import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";
import { vi, describe, it, expect } from "vitest";

describe("Button component", () => {
  it("renders default primary button with children", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("bg-pink-500", "text-white");
  });

  it("applies custom className, variant, and size", () => {
    render(
      <Button variant="neutral-text" size="sm" className="my-custom">
        Test
      </Button>
    );
    const btn = screen.getByRole("button", { name: /test/i });
    expect(btn).toHaveClass("my-custom");
    expect(btn).toHaveClass("text-slate-900", "hover:bg-slate-100");
    expect(btn).toHaveClass("px-4", "py-2", "text-sm");
  });

  it("renders start and end icons correctly", () => {
    const StartIcon = () => <span data-testid="start">S</span>;
    const EndIcon = () => <span data-testid="end">E</span>;
    render(
      <Button icon={<StartIcon />} iconEnd={<EndIcon />}>
        IconBtn
      </Button>
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("shows loader and disables button when loading", () => {
    render(<Button loading>Loading</Button>);
    const btn = screen.getByRole("button", { name: /loading/i });
    expect(btn).toBeDisabled();
    expect(btn.querySelector("svg")).toBeInTheDocument();
    expect(btn.querySelector("svg")).toHaveClass("animate-spin");
  });

  it("is disabled when disabled prop is true", () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        NoClick
      </Button>
    );
    const btn = screen.getByRole("button", { name: /noclick/i });
    expect(btn).toBeDisabled();
    userEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("calls onClick when clicked and not disabled/loading", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Press</Button>);
    const btn = screen.getByRole("button", { name: /press/i });
    await userEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
