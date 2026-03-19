/**
 * Returns current date in ISO format (YYYY-MM-DD)
 * Useful for default form values and APIs.
 */
// export const getCurrentDate = (): number => {
//   const now = new Date();

//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, "0");
//   const day = String(now.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// };

// /**
//  * Optional helper if you later need full ISO datetime
//  */
// export const getCurrentDateTime = (): string => {
//   return new Date().toISOString();
// };

export const getStartTime = (): number => {
  return Date.now();
};
export const getFormattedDate = (): string => {
  const now = new Date();
  return now.toISOString().split("T")[0];
};