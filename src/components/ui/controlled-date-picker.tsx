"use client";

import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";
import { format, parse } from "date-fns";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

type ControlledDatePickerProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  containerClassName?: string;
  placeholder?: string;
};

function ControlledDatePicker<T extends FieldValues>({
  name,
  label,
  containerClassName,
  placeholder,
}: ControlledDatePickerProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <div className={cn("w-full", containerClassName)}>
      {!!label && (
        <Label className="mb-2" htmlFor={name}>
          {label}
        </Label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const dateValue = value
            ? parse(value as string, "yyyy-MM-dd", new Date())
            : undefined;

          return (
            <>
              <DatePicker
                value={dateValue}
                onChange={(date) => {
                  onChange(date ? format(date, "yyyy-MM-dd") : "");
                }}
                placeholder={placeholder}
              />
              {!!error && (
                <p className="text-destructive text-sm">{error.message}</p>
              )}
            </>
          );
        }}
      />
    </div>
  );
}

export { ControlledDatePicker };
