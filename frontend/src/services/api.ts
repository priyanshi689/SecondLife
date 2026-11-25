import axios from "axios";

/** Centralized Axios instance. Set VITE_API_BASE_URL to connect the backend. */
export const API_BASE_URL = import.meta.env["VITE_API_BASE_URL"] as string | undefined;
export const isBackendConfigured = Boolean(API_BASE_URL);

export const api = axios.create({ baseURL: API_BASE_URL ?? "", timeout: 15000 });

// INTEGRATION: auth token format is owned by the backend team. Attach it here.
api.interceptors.request.use((config) => config);
