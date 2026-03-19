// import React from "react";
// import {
//   Checkbox,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   ListItemText,
//   FormHelperText,
//   SelectChangeEvent,
// } from "@mui/material";
// import { Controller, Control, FieldErrors } from "react-hook-form";

// interface Props {
//   name: string;
//   label?: string;
//   control: Control<any>;
//   errors?: FieldErrors;
// }

// const RHFWeekdaysCheckbox: React.FC<Props> = ({
//   name,
//   label = "Weekdays",
//   control,
//   errors,
// }) => {
//   const weekdays = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   return (
//     <FormControl fullWidth error={!!errors?.[name]}>
//       <InputLabel>{label}</InputLabel>
//       <Controller
//         name={name}
//         control={control}
//         render={({ field }) => {
//           const selectedDays: string[] = field.value || [];

//           const isAllSelected =
//             weekdays.length > 0 && selectedDays.length === weekdays.length;

//           const handleChange = (event: SelectChangeEvent<string[]>) => {
//             const value = event.target.value as string[];
//             if (value.includes("all")) {
//               // Toggle all
//               field.onChange(isAllSelected ? [] : weekdays);
//             } else {
//               field.onChange(value);
//             }
//           };

//           return (
//             <Select
//               multiple
//               value={selectedDays}
//               onChange={handleChange}
//               renderValue={(selected) => (selected as string[]).join(", ")}
//             >
//               <MenuItem
//                 value="all"
//                 onClick={() => field.onChange(isAllSelected ? [] : weekdays)}
//               >
//                 <Checkbox
//                   checked={isAllSelected}
//                   indeterminate={
//                     selectedDays.length > 0 &&
//                     selectedDays.length < weekdays.length
//                   }
//                 />
//                 <ListItemText primary="All" />
//               </MenuItem>

//               {weekdays.map((day) => {
//                 const isSelected = selectedDays.includes(day);
//                 return (
//                   <MenuItem
//                     key={day}
//                     value={day}
//                     onClick={() =>
//                       field.onChange(
//                         isSelected
//                           ? selectedDays.filter((d) => d !== day)
//                           : [...selectedDays, day]
//                       )
//                     }
//                   >
//                     <Checkbox checked={isSelected} />
//                     <ListItemText primary={day} />
//                   </MenuItem>
//                 );
//               })}
//             </Select>
//           );
//         }}
//       />
//       {errors?.[name] && (
//         <FormHelperText>{errors[name]?.message as string}</FormHelperText>
//       )}
//     </FormControl>
//   );
// };

// export default RHFWeekdaysCheckbox;





"use client";

import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface Props {
  name: string;
  label?: string;
  control: Control<any>;
  errors?: FieldErrors;
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RHFWeekdaysCheckbox: React.FC<Props> = ({
  name,
  label = "Weekdays",
  control,
  errors,
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label>{label}</Label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedDays: string[] = field.value || [];

          const isAllSelected =
            weekdays.length > 0 && selectedDays.length === weekdays.length;

          const toggleDay = (day: string) => {
            if (selectedDays.includes(day)) {
              field.onChange(selectedDays.filter((d) => d !== day));
            } else {
              field.onChange([...selectedDays, day]);
            }
          };

          const toggleAll = () => {
            field.onChange(isAllSelected ? [] : weekdays);
          };

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {selectedDays.length > 0
                    ? selectedDays.join(", ")
                    : "Select weekdays"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[220px] space-y-2">
                {/* Select All */}
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={toggleAll}
                >
                  <Checkbox
                    checked={isAllSelected}
                  />
                  <span className="text-sm">All</span>
                </div>

                {/* Weekdays */}
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => toggleDay(day)}
                  >
                    <Checkbox checked={selectedDays.includes(day)} />
                    <span className="text-sm">{day}</span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          );
        }}
      />

      {errors?.[name] && (
        <p className="text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default RHFWeekdaysCheckbox;