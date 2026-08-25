import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request 401s, try refreshing the access token once before giving up.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh/`, { refresh });
          localStorage.setItem("access", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      }
    }
    return Promise.reject(error);
  }
);

export const auth = {
  async register(username, email, password) {
    await api.post("/auth/register/", { username, email, password });
    return auth.login(username, password);
  },
  async login(username, password) {
    const { data } = await api.post("/auth/login/", { username, password });
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("username", username);
    return data;
  },
  logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
  },
  isLoggedIn() {
    return Boolean(localStorage.getItem("access"));
  },
  username() {
    return localStorage.getItem("username");
  },
};

export const snippets = {
  list(params = {}) {
    return api.get("/snippets/", { params }).then((r) => r.data);
  },
  get(slug) {
    return api.get(`/snippets/${slug}/`).then((r) => r.data);
  },
  create(payload) {
    return api.post("/snippets/", payload).then((r) => r.data);
  },
  update(slug, payload) {
    return api.patch(`/snippets/${slug}/`, payload).then((r) => r.data);
  },
  remove(slug) {
    return api.delete(`/snippets/${slug}/`);
  },
};

export const comments = {
  list(slug) {
    return api.get(`/snippets/${slug}/comments/`).then((r) => r.data);
  },
  create(slug, body) {
    return api.post(`/snippets/${slug}/comments/`, { body }).then((r) => r.data);
  },
  remove(id) {
    return api.delete(`/comments/${id}/`);
  },
};

export default api;
