import api from "./api";

export const crearClase = (courseId, data, onProgress) =>
  api.post(`/course-chapters/${courseId}`, data, {
    onUploadProgress: (e) => {
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    },
  });
