"use client"

import { Controller, Control, FieldValues, Path } from "react-hook-form"
import { Input } from "@/components/ui/input"

type FormInputProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  label?: string
  placeholder?: string
  type?: string
}

export function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-1">
          {label && (
            <label className="text-sm font-medium">{label}</label>
          )}

          <Input
            {...field}
            type={type}
            placeholder={placeholder}
          />

          {fieldState.error && (
            <p className="text-red-500 text-sm">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  )
}
