export const richTextField = (
  value: string,
  required = false
) => {
  if (required && (!value || value.trim() === "")) {
    return "This field is required";
  }

  return true;
};