// import React from "react";
// import { Controller } from "react-hook-form";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import Checkbox from "@mui/material/Checkbox";
// import { ListItemText } from "@mui/material";

// type Option = { label: string; value: any };

// type MultiCheckboxAutocompleteProps = {
//   control: any;
//   name: string;
//   options: Option[];
//   label: string;
//   error?: boolean;
//   helperText?: string;
//   withSelectAll?: boolean; // ✅ new prop
// };

// const RHFMultiCheckboxAutocomplete: React.FC<
//   MultiCheckboxAutocompleteProps
// > = ({ control, name, options, label, error, helperText, withSelectAll }) => {
//   // Add "Select All" option if enabled
//   const enhancedOptions = withSelectAll
//     ? [{ label: "Select All", value: "__all__" }, ...options]
//     : options;

//   return (
//     <Controller
//       control={control}
//       name={name}
//       render={({ field: { onChange, value = [] }, fieldState }) => {
//         const isAllSelected =
//           value.length === options.length && options.length > 0;

//         const handleChange = (_: any, newValue: Option[]) => {
//           // If "Select All" was clicked
//           if (withSelectAll) {
//             const hasAll = newValue.some((item) => item.value === "__all__");
//             if (hasAll) {
//               onChange(isAllSelected ? [] : options.map((opt) => opt.value));
//               return;
//             }
//           }
//           onChange(newValue.map((item) => item.value));
//         };

//         return (
//           <Autocomplete
//             multiple
//             options={enhancedOptions}
//             disableCloseOnSelect
//             getOptionLabel={(option) => option.label}
//             value={options.filter((opt) => value.includes(opt.value))}
//             onChange={handleChange}
//             renderOption={(props, option, { selected }) => {
//               if (option.value === "__all__") {
//                 return (
//                   <li {...props}>
//                     <Checkbox
//                       checked={isAllSelected}
//                       indeterminate={
//                         value.length > 0 && value.length < options.length
//                       }
//                       style={{ marginRight: 8 }}
//                     />
//                     <ListItemText primary="Select All" />
//                   </li>
//                 );
//               }

//               return (
//                 <li {...props}>
//                   <Checkbox checked={selected} style={{ marginRight: 8 }} />
//                   <ListItemText primary={option.label} />
//                 </li>
//               );
//             }}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label={label}
//                 error={!!fieldState.error || error}
//                 helperText={fieldState.error?.message || helperText}
//               />
//             )}
//           />
//         );
//       }}
//     />
//   );
// };

// export default RHFMultiCheckboxAutocomplete;



"use client";

import * as React from "react";
import { Controller,  } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type Option = { label: string; value: any };

type MultiCheckboxAutocompleteProps = {
  control: any;
  name: string;
  options: Option[];
  label: string;
  error?: boolean;
  helperText?: string;
  withSelectAll?: boolean;
};

const RHFMultiCheckboxAutocomplete: React.FC<
  MultiCheckboxAutocompleteProps
> = ({ control, name, options, label, error, helperText, withSelectAll }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value = [] }, fieldState }) => {

        const isAllSelected =
          value.length === options.length && options.length > 0;

        const toggleOption = (val: any) => {
          if (value.includes(val)) {
            onChange(value.filter((v: any) => v !== val));
          } else {
            onChange([...value, val]);
          }
        };

        const toggleAll = () => {
          if (isAllSelected) {
            onChange([]);
          } else {
            onChange(options.map((o) => o.value));
          }
        };

        const selectedLabels = options
          .filter((o) => value.includes(o.value))
          .map((o) => o.label);

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
                  className="justify-between"
                >
                  {selectedLabels.length
                    ? selectedLabels.join(", ")
                    : "Select options"}

                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>

              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>

                  <CommandInput placeholder="Search..." />

                  <CommandEmpty>No option found</CommandEmpty>

                  <CommandGroup>

                    {withSelectAll && (
                      <CommandItem
                        onSelect={() => toggleAll()}
                      >
                        <Checkbox
                          checked={isAllSelected}
                          className="mr-2"
                        />
                        Select All
                      </CommandItem>
                    )}

                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        onSelect={() =>
                          toggleOption(option.value)
                        }
                      >
                        <Checkbox
                          checked={value.includes(option.value)}
                          className="mr-2"
                        />

                        {option.label}

                        {value.includes(option.value) && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </CommandItem>
                    ))}

                  </CommandGroup>

                </Command>
              </PopoverContent>

            </Popover>

            {(fieldState.error || error) && (
              <p className="text-sm text-red-500">
                {fieldState.error?.message || helperText}
              </p>
            )}

          </div>
        );
      }}
    />
  );
};

export default RHFMultiCheckboxAutocomplete;