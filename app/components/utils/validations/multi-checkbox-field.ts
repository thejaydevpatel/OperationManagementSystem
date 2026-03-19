export const multiCheckboxField = (
  value: string[],
  required = false
) => {
  if (required && (!value || value.length === 0)) {
    return "Please select at least one option";
  }

  return true;
};