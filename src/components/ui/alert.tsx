import { cn } from "@/lib/utils";
import React from "react";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "destructive";
  }
  
  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = "default", ...props }, ref) => (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          variant === "destructive"
            ? "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive bg-destructive/5"
            : "border-border bg-background",
          className
        )}
        {...props}
      />
    )
  );
  Alert.displayName = "Alert";
  
  const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  ));
  AlertDescription.displayName = "AlertDescription";

  const AlertTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
  >(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-lg font-medium", className)}
      {...props}
    />
  ));
  AlertTitle.displayName = "AlertTitle";

  export{Alert, AlertTitle, AlertDescription}