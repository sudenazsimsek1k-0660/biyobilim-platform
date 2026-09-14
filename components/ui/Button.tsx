import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded font-semibold text-sm transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green",
  {
    variants: {
      variant: {
        solid: "bg-green text-white hover:bg-[#356a45] hover:-translate-y-px hover:shadow-lg",
        blue: "bg-blue text-white hover:bg-blue-deep",
        outline: "border border-line text-ink hover:bg-bg-alt",
        outlineBlue: "border border-blue text-blue hover:bg-blue hover:text-white",
        ghost: "text-ink hover:bg-bg-alt",
        danger: "bg-red text-white hover:opacity-90",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-5 py-2.5",
        lg: "px-7 py-3.5 text-base",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";
