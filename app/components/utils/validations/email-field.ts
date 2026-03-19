export const emailField = (
  value: string,
  required = false
) => {
  if (required && !value) {
    return "Email is required";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value && !emailRegex.test(value)) {
    return "Invalid email address";
  }

  return true;
};