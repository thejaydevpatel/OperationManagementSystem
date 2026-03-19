export const textField = (
  value: string,
  required = false,
  minLength?: number,
  maxLength?: number
) => {
  if (required && (!value || value.trim() === "")) {
    return "This field is required";
  }

  if (minLength && value.length < minLength) {
    return `Minimum ${minLength} characters required`;
  }

  if (maxLength && value.length > maxLength) {
    return `Maximum ${maxLength} characters allowed`;
  }

  return true;
};