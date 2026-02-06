"use client";

import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

import { API_BASE } from "@/utils/constants";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ===============================
  // CARGAR SESION DESDE LOCALSTORAGE
  // ===============================
  useEffect(() => {
    const storedUser = localStorage.getItem("eduemotion_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("eduemotion_user");
      }
    }
    setLoading(false);
  }, []);

  // ===============================
  // LOGIN UNIFICADO (ESTUDIANTE / DOCENTE)
  // ===============================
  const login = async (email, password) => {
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const makeBody = () => new URLSearchParams({ email, password });

    try {
      /* ===============================
         LOGIN ESTUDIANTE
      =============================== */
      let res = await fetch(`${API_BASE}/student-login`, {
        method: "POST",
        headers,
        body: makeBody(),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      // Soporta ambos formatos de backend
      if (res.ok && (data.bool === true || data.id || data.student_id)) {
        const loggedUser = {
          id: data.student_id || data.id,
          role: "estudiante",
          email: data.email || email,
          full_name: data.full_name || "",
        };

        localStorage.setItem("eduemotion_user", JSON.stringify(loggedUser));
        setUser(loggedUser);

        return { success: true, role: "estudiante" };
      }

      /* ===============================
         LOGIN DOCENTE
      =============================== */
      res = await fetch(`${API_BASE}/teacher-login`, {
        method: "POST",
        headers,
        body: makeBody(),
      });

      try {
        data = await res.json();
      } catch {}

      if (res.ok && (data.bool === true || data.id || data.teacher_id)) {
        const loggedUser = {
          id: data.teacher_id || data.id,
          role: "docente",
          email: data.email || email,
          full_name: data.full_name || "",
        };

        localStorage.setItem("eduemotion_user", JSON.stringify(loggedUser));
        setUser(loggedUser);

        return { success: true, role: "docente" };
      }

      return {
        success: false,
        message:
          data.message || data.error || "Correo o contrasena incorrectos",
      };
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Error de conexion con el servidor",
      };
    }
  };

  // ===============================
  // REGISTRO
  // ===============================
  const register = async (payload) => {
    try {
      const endpoint =
        payload.role === "docente"
          ? `${API_BASE}/teacher/`
          : `${API_BASE}/student/`;

      let cleanPayload = {};
      if (payload.role === "docente") {
        const {
          fullname,
          email,
          password,
          qualification,
          mobile_no,
          skills,
        } = payload;
        cleanPayload = {
          fullname,
          email,
          password,
          qualification,
          mobile_no,
          skills,
        };
      } else {
        const {
          fullname,
          email,
          password,
          username,
          interseted_categories,
        } = payload;
        cleanPayload = {
          fullname,
          email,
          password,
          username,
          interseted_categories,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {}

      if (!res.ok || data.ok === false) {
        console.error("Registro backend:", data);
        return {
          success: false,
          message: data.message || data.error || "Error al registrar",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error en registro:", error);
      return {
        success: false,
        message: "Error de conexion",
      };
    }
  };

  // ===============================
  // LOGOUT
  // ===============================
  const logout = () => {
    localStorage.removeItem("eduemotion_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
