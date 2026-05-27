"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type ConfirmSubmitButtonProps = {
  message: string;
  children: ReactNode;
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function ConfirmSubmitButton({ message, children, variant = "danger", size = "sm" }: ConfirmSubmitButtonProps) {
  return (
    <Button
      type="submit"
      variant={variant}
      size={size}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </Button>
  );
}
