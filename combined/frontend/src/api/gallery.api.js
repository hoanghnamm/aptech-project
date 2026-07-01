import http from "./axios";

/** Upload an image; backend auto-tags it with the AI breed model. */
export const uploadGalleryImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await http.post("/api/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return response.data?.data || response.data;
};

/** List tagged gallery images (optionally filtered by tag). */
export const getGallery = async (tag) => {
  const params = tag ? { tag } : {};
  const response = await http.get("/api/gallery", { params });
  return response.data?.data || response.data;
};
