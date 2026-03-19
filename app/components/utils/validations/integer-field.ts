export const integerField = (
  value: number | string,
  required = false
) => {
  if (required && (value === "" || value === null || value === undefined)) {
    return "This field is required";
  }

  if (value !== "" && !Number.isInteger(Number(value))) {
    return "Must be a valid integer";
  }

  return true;
};