import { cn } from "@/lib/utils";
import { EyeOff, Eye, Lock } from "lucide-react";
// import type { Input } from "postcss";
import React from "react";
import { Button } from "./button";
import { Input } from "./input";

interface PasswordInputProps extends Omit<React.ComponentProps<typeof Input>, 'type'> {
    error?: boolean;
  }
  
  const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, error, ...props }, ref) => {
      const [showPassword, setShowPassword] = React.useState(false);
  
      return (
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            <Lock className="h-4 w-4" />
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            className={cn(
              "pl-10 pr-12",
              error && "border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100",
              className
            )}
            ref={ref}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-md"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-[#6B7280]" />
            ) : (
              <Eye className="h-4 w-4 text-[#6B7280]" />
            )}
          </Button>
        </div>
      );
    }
  );
  PasswordInput.displayName = "PasswordInput";

  export { PasswordInput };