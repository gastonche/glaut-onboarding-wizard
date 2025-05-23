import clsx from "clsx";
import { Loader } from "lucide-react";
import { FC, PropsWithChildren, ReactNode } from "react";

const variants = {
  primary: "bg-pink-500 text-white disabled:bg-pink-300",
  neutral: "bg-slate-500 text-white disabled:bg-slate-300",
  "neutral-text": "text-slate-900 bg-transparent disabled:text-slate-500 hover:bg-slate-100",
  "neutral-outline": "border border-slate-900 text-slate-900 bg-transparent disabled:border-slate-300",
  "primary-outline": "border border-pink-500 text-pink-500 bg-transparent disabled:border-pink-300",
  "primary-text": "text-pink-500 bg-transparent disabled:text-pink-300 hover:bg-pink-100",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  className,
  variant = "primary",
  size = "sm",
  loading = false,
  icon,
  iconEnd,
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-md cursor-pointer",
        className,
        variants[variant],
        sizes[size]
      )}
    >
      {loading ? <Loader className="w-4 h-4 animate-spin" size={20} /> : <></>}
      {icon}
      {children}
      {iconEnd}
    </button>
  );
};
