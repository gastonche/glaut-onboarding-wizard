import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Text } from "../text";

const variants = [
  "labelXs",
  "headingLg",
  "subheadingSm",
  "bodyMd",
  "bodySm",
  "sidebarTitle",
  "sidebarDescription",
] as const;

describe("Text component", () => {
  variants.forEach((variant) => {
    it(`renders ${variant} variant correctly in light mode`, () => {
      render(
        <Text variant={variant} mode="light">
          Hello world
        </Text>
      );
      const el = screen.getByText("Hello world");
      expect(el).toBeInTheDocument();
      expect(el.className).toContain("text-");
    });

    it(`renders ${variant} variant correctly in dark mode`, () => {
      render(
        <Text variant={variant} mode="dark">
          Hello world
        </Text>
      );
      const el = screen.getByText("Hello world");
      expect(el).toBeInTheDocument();
      expect(el.className).toContain("text-");
    });
  });

  it("renders as different HTML elements", () => {
    render(
      <>
        <Text variant="bodyMd" as="span">
          Span Text
        </Text>
        <Text variant="bodySm" as="div">
          Div Text
        </Text>
      </>
    );
    expect(screen.getByText("Span Text").tagName).toBe("SPAN");
    expect(screen.getByText("Div Text").tagName).toBe("DIV");
  });

  it("applies additional class names", () => {
    render(
      <Text variant="bodyMd" className="custom-class">
        Custom Text
      </Text>
    );
    const el = screen.getByText("Custom Text");
    expect(el.className).toContain("custom-class");
  });
});
