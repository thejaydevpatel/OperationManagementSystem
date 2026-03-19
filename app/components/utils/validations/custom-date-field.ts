export const customDateField = (value: string, required = false) => {
  if (required && !value) {
    return "Date is required";
  }

  if (value && isNaN(Date.parse(value))) {
    return "Invalid date";
  }

  return true;
};