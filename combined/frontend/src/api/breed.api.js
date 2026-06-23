import http from "./axios";

/**
 * Gửi ảnh lên backend để nhận diện giống chó (backend sẽ forward sang Python AI service).
 * @param {File} file - file ảnh từ input
 * @returns {Promise<object>} response.data từ backend
 */
export const identifyBreed = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await http.post("/api/breed/identify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return response.data;
};

/**
 * List breeds from the encyclopedia (DB-driven).
 * @param {{search?:string, size?:string, page?:number, limit?:number}} params
 */
export const getBreeds = async (params = {}) => {
  const response = await http.get("/api/breeds", { params });
  return response.data?.data || response.data;
};

/** Get one breed by id or name. */
export const getBreed = async (idOrName) => {
  const response = await http.get(`/api/breeds/${encodeURIComponent(idOrName)}`);
  return response.data?.data || response.data;
};
