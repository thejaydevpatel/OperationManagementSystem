export const phoneNumberField = (
  value: string,
  required = false
) => {
  if (required && !value) {
    return "Phone number is required";
  }

  const phoneRegex = /^[0-9]{10}$/;

  if (value && !phoneRegex.test(value)) {
    return "Invalid phone number";
  }

  return true;
};