

"use client";

import * as React from "react";
import { Controller, Control } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Option {
  ddlId: number | string;
  label: string;
}

interface RHFAutocompleteProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
}

export const RHFAutocomplete: React.FC<RHFAutocompleteProps> = ({
  control,
  name,
  label,
  placeholder = "Search...",
  options,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const selected = options.find(
          (opt) => opt.ddlId === field.value
        );

        return (
          <div className="flex flex-col gap-2 w-full">

            <label className="text-sm font-medium">
              {label}
            </label>

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disabled}
                  className="justify-between"
                >
                  {selected ? selected.label : "Select option"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>

                  <CommandInput placeholder={placeholder} />

                  <CommandEmpty>
                    No option found.
                  </CommandEmpty>

                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.ddlId}
                        value={option.label}
                        onSelect={() => {
                          field.onChange(option.ddlId);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            option.ddlId === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>

                </Command>
              </PopoverContent>
            </Popover>

            {fieldState.error && (
              <p className="text-sm text-red-500">
                {fieldState.error.message}
              </p>
            )}

          </div>
        );
      }}
    />
  );
};