export const validateFileField = (
  value: File | null,
  required = false,
  maxSizeMB = 5
) => {
  if (required && !value) {
    return "File is required";
  }

  if (value) {
    const maxSize = maxSizeMB * 1024 * 1024;
    if (value.size > maxSize) {
      return `File size must be less than ${maxSizeMB}MB`;
    }
  }

  return true;
};