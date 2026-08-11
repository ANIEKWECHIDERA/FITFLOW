import * as React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"article">) {
  return (
    <article data-slot="card" className={cn("ui-card", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("ui-card-content", className)}
      {...props}
    />
  );
}
