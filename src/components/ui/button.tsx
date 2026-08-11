import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

type ButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "default" | "ghost" | "outline" | "danger";
  size?: "default" | "icon";
};

export function Button({
  asChild,
  variant = "default",
  size = "default",
  className,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn("ui-button", className)}
      {...props}
    />
  );
}
