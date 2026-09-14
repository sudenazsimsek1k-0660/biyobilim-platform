import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, ...props }, ref) => (
    <input
      ref={ref}
      id={id}
      className={cn(
        "w-full border border-line bg-bg px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink-muted/60 focus:border-green focus:bg-white focus:outline-none",
        error && "border-red focus:border-red",
        className
      )}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
  )
);
Input.displayName = "Input";
