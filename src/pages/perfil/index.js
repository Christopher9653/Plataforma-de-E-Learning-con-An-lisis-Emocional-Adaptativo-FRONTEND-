// src/pages/perfil/index.js
import MainLayout from "@/components/layout/MainLayout";
import useAuth from "@/hooks/useAuth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

import LoaderSpinner from "@/components/ui/LoaderSpinner";
import ProfileAvatar from "@/components/profile/ProfileAvatar";
import ProfileInfoForm from "@/components/profile/ProfileInfoForm";
import ProfileSecurity from "@/components/profile/ProfileSecurity";

export default function PerfilPage() {
  // useAuth puede proteger la ruta o devolver user; si tu hook devuelve user, lo usamos
  // por compatibilidad usamos también AuthContext directamente
  const authHookUser = useAuth ? useAuth() : null; // algunos useAuth devuelven user o hacen redirect
  const { user: contextUser, login, logout, updateUser, setUser } = useContext(AuthContext) || {};

  // Preferir contextUser (desde AuthContext) si existe, sino intentar usar authHookUser.user
  const initialUser = contextUser || (authHookUser && authHookUser.user) || null;

  const [user, setLocalUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  // Mantener sincronía si context cambia
  useEffect(() => {
    if (contextUser) {
      setLocalUser(contextUser);
      setLoading(false);
    } else {
      // intentar recuperar desde localStorage (por si authContext tarda)
      const stored = typeof window !== "undefined" ? localStorage.getItem("eduemotion_user") : null;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setLocalUser(parsed);
          setLoading(false);
        } catch (e) {
          setLocalUser(null);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
  }, [contextUser]);

  // Guardar avatar/file and profile changes
  const handleSaveProfile = async ({ name, email, avatarBase64 }) => {
    // crear copia del usuario y actualizar
    const updated = {
      ...(user || {}),
      name,
      email,
      avatar: avatarBase64 || (user && user.avatar) || null,
    };

    // Si AuthContext provee una función para actualizar: usarla
    if (typeof updateUser === "function") {
      await updateUser(updated);
      setLocalUser(updated);
      return;
    }

    if (typeof setUser === "function") {
      // si tu contexto aún expone setUser
      setUser(updated);
      localStorage.setItem("eduemotion_user", JSON.stringify(updated));
      setLocalUser(updated);
      return;
    }

    // fallback: actualizar localStorage y notificar
    localStorage.setItem("eduemotion_user", JSON.stringify(updated));
    // disparar evento de storage para otras pestañas
    window.dispatchEvent(new Event("storage"));
    // actualizar local state
    setLocalUser(updated);

    // intenta refrescar para que el AuthProvider vuelva a leer localStorage (opcional)
    // location.reload(); // comentar si no quieres recargar
  };

  // Cambiar contraseña
  const handleChangePassword = async ({ current, newPassword }) => {
    // Recuperar current password guardada (si existe)
    const stored = localStorage.getItem("eduemotion_user");
    let storedUser = null;
    if (stored) {
      try {
        storedUser = JSON.parse(stored);
      } catch (e) {}
    }

    // Si hay una contraseña almacenada, validarla (simulación)
    if (storedUser && storedUser.password) {
      if (storedUser.password !== current) {
        throw new Error("La contraseña actual no coincide.");
      }
    }
    // Actualizar el usuario con nueva contraseña
    const updated = {
      ...(user || {}),
      password: newPassword,
    };

    // Usar updateUser / setUser si existen
    if (typeof updateUser === "function") {
      await updateUser(updated);
      setLocalUser(updated);
      return;
    }
    if (typeof setUser === "function") {
      setUser(updated);
      localStorage.setItem("eduemotion_user", JSON.stringify(updated));
      setLocalUser(updated);
      return;
    }

    // fallback
    localStorage.setItem("eduemotion_user", JSON.stringify(updated));
    setLocalUser(updated);
    return;
  };

  // Avatar change callback (file -> base64)
  const handleAvatarChange = (file, base64) => {
    // no guardamos aun; solo actualizamos vista y dejaremos que el usuario haga "Guardar cambios"
    setLocalUser((p) => ({ ...(p || {}), avatar: base64 }));
  };

  // Guardar datos (contiene avatar en user.avatar ya)
  const handleSave = async (info) => {
    setLoading(true);
    try {
      const avatarBase64 = (user && user.avatar) || null;
      await handleSaveProfile({ ...info, avatarBase64 });
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handlePasswordChange = async ({ current, newPassword }) => {
    setLoading(true);
    try {
      await handleChangePassword({ current, newPassword });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <LoaderSpinner size={64} message="Cargando perfil..." />
        </div>
      </MainLayout>
    );
  }

  // Si sigue sin user -> mostrar mensaje
  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-700 mb-4">No se encontró información de usuario.</p>
            <button onClick={() => (typeof login === "function" ? login() : null)} className="px-4 py-2 bg-blue-600 text-white rounded">
              Ir a iniciar sesión
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-10 bg-gray-50 min-h-screen">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600">Mi Perfil</h1>
          <p className="text-gray-600 mt-2">
            Información personal y ajustes de tu cuenta
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="bg-white p-6 rounded-lg shadow">
            <ProfileAvatar avatar={user.avatar} onChange={handleAvatarChange} />
          </div>

          {/* Info + Security */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información personal</h2>

              <ProfileInfoForm
                initial={{ name: user.name || "", email: user.email || "" }}
                onSave={async (data) => {
                  await handleSave(data);
                }}
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Seguridad</h2>

              <ProfileSecurity
                userPassword={(user && user.password) || null}
                onChangePassword={async ({ current, newPassword }) => {
                  await handlePasswordChange({ current, newPassword });
                }}
              />
            </div>
          </div>
        </div>

        {/* Opciones */}
        <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Puede editar su información y cambiar su contraseña desde aquí.</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                // Guardar cambios rápidos: guardamos lo que hay en local state `user`
                handleSave({ name: user.name || "", email: user.email || "" });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Guardar todo
            </button>

            {/* <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cerrar sesión
            </button> */}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
