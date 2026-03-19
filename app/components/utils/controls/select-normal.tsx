"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Label } from "@/components/ui/label"
import { Controller, Control, FieldErrors, get } from "react-hook-form"

interface Option {
  value: string | number
  label: string
}

interface RHFSelectProps {
  name: string
  label: string
  control: Control<any>
  errors: FieldErrors<any>
  options: Option[]
  fullWidth?: boolean
}

export function RHFSelect({
  name,
  label,
  control,
  errors,
  options,
  fullWidth = true,
}: RHFSelectProps) {

  const error = get(errors, name)?.message as string | undefined

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
      
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
         <Select
  value={field.value ? String(field.value) : ""}
  onValueChange={(value) => {
    const selected = options.find(o => String(o.value) === value)
    field.onChange(selected?.value)
  }}
>
  <SelectTrigger id={name} className="mt-1 w-full">
    <SelectValue placeholder={`Select ${label}`} />
  </SelectTrigger>

  <SelectContent>
    {options.map((opt) => (
      <SelectItem key={opt.value} value={String(opt.value)}>
        {opt.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
        )}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

    </div>
  )
}