"use client";

import { type TextareaHTMLAttributes, useId } from "react";
import { type FieldValues, type Path, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ControlledTextareaProps<T extends FieldValues> =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    name: Path<T>;
    label?: string;
    className?: string;
  };

const ControlledTextarea = <T extends FieldValues>({
  name,
  label,
  className,
  ...rest
}: ControlledTextareaProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const uniqueId = useId();
  const textareaId = `${name}-${uniqueId}`;
  const errorId = `${name}-error-${uniqueId}`;
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <Label htmlFor={textareaId} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <Textarea
        id={textareaId}
        {...register(name)}
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

export { ControlledTextarea };
