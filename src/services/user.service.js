import { API_BASE } from "@/utils/constants";

export async function getTeacherProfile(id, token) {
  const res = await fetch(`${API_BASE}/teachers/${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo cargar el perfil");
  return await res.json();
}

export async function updateTeacherProfile(id, data, token) {
  const res = await fetch(`${API_BASE}/teachers/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data, // FormData
  });

  if (!res.ok) throw new Error("No se pudo actualizar el perfil");
  return await res.json();
}
