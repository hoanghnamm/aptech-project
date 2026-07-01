import axios from "axios";

const HOST = import.meta.env.VITE_API_URL || "http://localhost:5000";

const http = axios.create({
  baseURL: HOST,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/* ----------------------------- #5 Encyclopedia ---------------------------- */
export const getBreeds = async (params = {}) => {
  const res = await http.get("/api/breeds", { params });
  return res.data?.data || res.data;
};

export const getBreed = async (idOrName) => {
  const res = await http.get(`/api/breeds/${encodeURIComponent(idOrName)}`);
  return res.data?.data || res.data;
};

/* --------------------------- #1 Breed Recognition ------------------------- */
export const identifyBreed = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await http.post("/api/breed/identify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return res.data;
};

/* ------------------------------- #2 Chatbot ------------------------------- */
export const sendChatMessage = async (message, history = []) => {
  const res = await http.post("/api/chatbot", { message, history });
  return res.data?.data || res.data;
};

/* ---------------------------- #3 Recommendation --------------------------- */
export const recommendBreeds = async (prefs) => {
  const res = await http.post("/api/recommendation", prefs);
  return res.data?.data || res.data;
};

/* ----------------------------- #4 Smart Search ---------------------------- */
export const smartSearch = async (q) => {
  const res = await http.get("/api/search", { params: { q } });
  return res.data?.data || res.data;
};

/* ------------------------------ #6 Nutrition ------------------------------ */
export const recommendNutrition = async (payload) => {
  const res = await http.post("/api/nutrition/recommend", payload);
  return res.data;
};

/* ------------------------- #7 Gallery + Auto-tagging ---------------------- */
export const uploadGalleryImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await http.post("/api/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return res.data?.data || res.data;
};

export const getGallery = async (tag) => {
  const res = await http.get("/api/gallery", { params: tag ? { tag } : {} });
  return res.data?.data || res.data;
};

/* --------------------------- #8 Vet Assistance ---------------------------- */
export const getNearbyClinics = async (lat, lng, open24h = false) => {
  const params = {};
  if (lat != null && lng != null) {
    params.lat = lat;
    params.lng = lng;
  }
  if (open24h) params.open24h = true;
  const res = await http.get("/api/vet/nearby", { params });
  return res.data?.data || res.data;
};

/* --------------------- #9 Analytics & Personalization --------------------- */
export const getSessionId = () => {
  let id = localStorage.getItem("pawintel_session");
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("pawintel_session", id);
  }
  return id;
};

export const trackEvent = (type, payload = {}) => {
  try {
    http
      .post("/api/analytics/track", {
        sessionId: getSessionId(),
        type,
        ...payload,
      })
      .catch(() => {});
  } catch {
    /* ignore */
  }
};

export const trackPageView = (page) => trackEvent("page_view", { page });
export const trackBreedView = (breedName) =>
  trackEvent("breed_view", { breedName });

export const getPersonalized = async () => {
  const res = await http.get("/api/analytics/personalized", {
    params: { sessionId: getSessionId() },
  });
  return res.data?.data || res.data;
};

export const getTrending = async () => {
  const res = await http.get("/api/analytics/trending");
  return res.data?.data || res.data;
};

export default http;
