import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva("inline-block px-2.5 py-1 text-[10.5px] font-bold tracking-wide", {
  variants: {
    tone: {
      green: "bg-green/10 text-green",
      blue: "bg-blue/10 text-blue",
      amber: "bg-amber/10 text-amber",
      red: "bg-red/10 text-red",
      gray: "bg-bg-alt text-ink-muted",
    },
  },
  defaultVariants: { tone: "gray" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
