"use client";

import { FieldValues, Path, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, useId } from "react";

type ControlledInputProps<T extends FieldValues> =
  InputHTMLAttributes<HTMLInputElement> & {
    name: Path<T>;
    label?: string;
    className?: string;
    sanitize?: (value: string) => string;
  };

const ControlledInput = <T extends FieldValues>({
  name,
  label,
  className,
  sanitize,
  ...rest
}: ControlledInputProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const uniqueId = useId();
  const inputId = `${name}-${uniqueId}`;
  const errorId = `${name}-error-${uniqueId}`;
  const error = errors[name]?.message as string | undefined;

  const registration = register(name);

  return (
    <div className="space-y-1.5">
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Input
        id={inputId}
        {...registration}
        onChange={(e) => {
          if (sanitize) {
            e.target.value = sanitize(e.target.value);
          }
          registration.onChange(e);
        }}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive/40",
          className,
        )}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p
          id={errorId}
          className="text-xs font-medium text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export { ControlledInput };
