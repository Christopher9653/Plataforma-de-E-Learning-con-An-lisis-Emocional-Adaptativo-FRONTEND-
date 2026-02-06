// ===============================
// API
// ===============================
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://edumotion-backend1.onrender.com/api";

// ===============================
// ROLES
// ===============================
export const ROLES = {
  DOCENTE: "docente",
  ESTUDIANTE: "estudiante",
};

// ===============================
// STORAGE KEYS
// ===============================
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

// ===============================
// DEFAULTS
// ===============================
export const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?background=0D8ABC&color=fff";

// ===============================
// PAGINATION
// ===============================
export const PAGINATION = {
  PAGE_SIZE: 10,
};

// ===============================
// STATUS
// ===============================
export const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};
