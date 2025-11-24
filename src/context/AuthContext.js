import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage al iniciar la app
  useEffect(() => {
    const storedUser = localStorage.getItem("eduemotion_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Guardar usuario en localStorage
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

    // Guardar usuario en contexto
    setUser(foundUser);

    // Guardar en localStorage
    localStorage.setItem("eduemotion_user", JSON.stringify(foundUser));

    return { success: true, user: foundUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("eduemotion_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

