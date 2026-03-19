


"use client"

import { Controller, Control, FieldErrors, get } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface RHFTextFieldProps {
  name: string
  control: Control<any>
  errors: FieldErrors<any>
  label: string
  type?: string
  step?: string
  multiline?: boolean
  multilineRows?: number
}

export function RHFTextField({
  name,
  control,
  errors,
  label,
  step,
  type = "text",
  multiline = false,
  multilineRows = 3,
}: RHFTextFieldProps) {

  const error = get(errors, name)?.message as string | undefined

  return (
    <div className="flex flex-col gap-1.5 w-full">
      
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) =>
          multiline ? (
            <Textarea
              id={name}
              {...field}
              rows={multilineRows}
              className="mt-1"
            />
          ) : (
            <Input
              id={name}
              type={type}
              step={step}
              {...field}
              className="mt-1"
            />
          )
        }
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      
    </div>
  )
}