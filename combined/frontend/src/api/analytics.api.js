import http from "./axios";

// A stable per-browser session id (no login needed) stored in localStorage.
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

/** Fire-and-forget event tracking (never blocks the UI). */
export const trackEvent = (type, payload = {}) => {
  try {
    http.post("/api/analytics/track", {
      sessionId: getSessionId(),
      type,
      ...payload,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
};

export const trackPageView = (page) => trackEvent("page_view", { page });
export const trackBreedView = (breedName) => trackEvent("breed_view", { breedName });

export const getPersonalized = async () => {
  const response = await http.get("/api/analytics/personalized", {
    params: { sessionId: getSessionId() },
  });
  return response.data?.data || response.data;
};

export const getTrending = async () => {
  const response = await http.get("/api/analytics/trending");
  return response.data?.data || response.data;
};
