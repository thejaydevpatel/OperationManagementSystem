import axios from "axios";

/**
 * Upload file to common + specific path
 */
export const uploadFiles = async (
  file: File,
  commonPath: string,
  specificPath: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  formData.append("commonPath", commonPath);
  formData.append("specificPath", specificPath);

  const response = await axios.post(
    "/api/upload", // adjust if needed
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data?.filePath;
};