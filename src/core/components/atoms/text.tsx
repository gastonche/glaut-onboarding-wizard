import * as React from "react";
import clsx from "clsx";

type TextVariant =
  | "labelXs"
  | "headingLg"
  | "subheadingSm"
  | "bodyMd"
  | "bodySm"
  | "sidebarTitle"
  | "sidebarDescription";

type ColorMode = "light" | "dark";

interface VariantClassSet {
  common: string;
  light: string;
  dark: string;
}

const variantClasses: Record<TextVariant, VariantClassSet> = {
  labelXs: {
    common: "text-xs uppercase font-medium",
    light: "text-pink-500",
    dark: "text-pink-400",
  },
  headingLg: {
    common: "text-2xl font-bold",
    light: "text-gray-900",
    dark: "text-gray-100",
  },
  subheadingSm: {
    common: "text-sm",
    light: "text-gray-600",
    dark: "text-gray-400",
  },
  bodyMd: {
    common: "text-base font-semibold",
    light: "text-gray-900",
    dark: "text-gray-100",
  },
  bodySm: {
    common: "text-sm",
    light: "text-gray-500",
    dark: "text-gray-400",
  },
  sidebarTitle: {
    common: "text-sm font-semibold",
    light: "text-gray-900",
    dark: "text-gray-100",
  },
  sidebarDescription: {
    common: "text-xs",
    light: "text-gray-500",
    dark: "text-gray-400",
  },
};

// Generic polymorphic component type
type TextProps<T extends React.ElementType> = {
  as?: T;
  variant: TextVariant;
  mode?: ColorMode;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export const Text = <T extends React.ElementType = "p">({
  as,
  variant,
  mode = "light",
  className,
  children,
  ...props
}: TextProps<T>) => {
  const Component = as || "p";
  const { common, light, dark } = variantClasses[variant];

  return (
    <Component
      className={clsx(common, mode === "light" ? light : dark, className)}
      {...props}
    >
      {children}
    </Component>
  );
};
