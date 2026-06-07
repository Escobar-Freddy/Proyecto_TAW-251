import axios from "axios";

// 🔒 URL hardcodeada directamente al backend en Render
const API_BASE_URL = "https://proyecto-taw-251.onrender.com";

console.log("🔗 Backend URL configurada:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Servicios de Usuarios
export const usuariosService = {
  getAll: () => api.get("/usuarios"),
  getOne: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post("/usuarios", data),
  update: (id, data) => api.patch(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

// Servicios de Cuentas
export const cuentasService = {
  getAll: () => api.get("/cuentas"),
  getTree: () => api.get("/cuentas/tree"),
  getPrincipales: () => api.get("/cuentas/principales"),
  getByTipo: (tipo) => api.get(`/cuentas/tipo/${tipo}`),
  getOne: (id) => api.get(`/cuentas/${id}`),
  create: (data) => api.post("/cuentas", data),
  update: (id, data) => api.patch(`/cuentas/${id}`, data),
  delete: (id) => api.delete(`/cuentas/${id}`),
};

// Servicios de Movimientos
export const movimientosService = {
  getAll: (params) => api.get("/movimientos", { params }),
  getOne: (id) => api.get(`/movimientos/${id}`),
  create: (data) => api.post("/movimientos", data),
  update: (id, data) => api.patch(`/movimientos/${id}`, data),
  delete: (id) => api.delete(`/movimientos/${id}`),
  getResumen: (fecha_inicio, fecha_fin) =>
    api.get("/movimientos/resumen", { params: { fecha_inicio, fecha_fin } }),
  getResumenPorCuenta: (fecha_inicio, fecha_fin) =>
    api.get("/movimientos/resumen/cuentas", {
      params: { fecha_inicio, fecha_fin },
    }),
};

// Servicios de Access Logs (solo admin)
export const accessLogsService = {
  getAll: (params) => api.get("/access-logs", { params }),
  getOne: (id) => api.get(`/access-logs/${id}`),
  getEstadisticas: () => api.get("/access-logs/estadisticas"),
  getByUsuario: (idUsuario) => api.get(`/access-logs/usuario/${idUsuario}`),
};

export default api;
