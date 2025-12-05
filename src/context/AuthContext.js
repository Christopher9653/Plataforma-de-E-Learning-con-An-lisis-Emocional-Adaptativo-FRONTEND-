import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ============================
  //  CARGAR USUARIO DESDE LOCALSTORAGE
  // ============================
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("eduemotion_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error al parsear usuario:", err);
      setUser(null);
    }
    setLoading(false);
  }, []);

  // ============================
  //  LOGIN CON USUARIOS FALSOS
  // ============================
  const login = (email, password) => {
    const fakeUsers = [
      {
        email: "admin@mail.com",
        password: "123456",
        name: "Administrador",
        role: "admin",
      },
      {
        email: "docente@mail.com",
        password: "123456",
        name: "María",
        role: "docente",
      },
      {
        email: "estudiante@mail.com",
        password: "123456",
        name: "Luis",
        role: "estudiante",
      },
    ];

    const foundUser = fakeUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      return { success: false, message: "Credenciales incorrectas" };
    }

    // Guardar usuario en localStorage + contexto
    localStorage.setItem("eduemotion_user", JSON.stringify(foundUser));
    setUser(foundUser);

    return { success: true, user: foundUser };
  };

  // ============================
  //  CERRAR SESIÓN
  // ============================
  const logout = () => {
    localStorage.removeItem("eduemotion_user");
    setUser(null);
    window.location.href = "/login";
  };

  // ============================
  //  ACTUALIZAR USUARIO
  // ============================
  const updateUser = async (updatedData) => {
    return new Promise((resolve) => {
      const updatedUser = { ...user, ...updatedData };

      localStorage.setItem("eduemotion_user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Notificar cambios globales (otras pestañas)
      window.dispatchEvent(new Event("storage"));

      resolve(updatedUser);
    });
  };

  // ============================
  //  RETORNO DEL CONTEXTO
  // ============================
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        setUser, // por si necesitas manipular manualmente
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
