"use client"

import {
  Control,
  Controller,
  FieldValues,
  Path,
} from "react-hook-form"

import { Input } from "@/components/ui/input"
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"

interface RHFTextFieldProps<T extends FieldValues> {
  name: Path<T>
  label: string
  control: Control<T>
  type?: string
}

export function RHFTextField<T extends FieldValues>({
  name,
  label,
  control,
  type = "text",
}: RHFTextFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}