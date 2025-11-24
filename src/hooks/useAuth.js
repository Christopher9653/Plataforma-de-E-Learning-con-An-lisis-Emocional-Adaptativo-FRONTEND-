import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function useAuth(requiredRole) {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si aun no cargó el localStorage, espera
    if (user === null) {
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = "/login";
      }

      if (requiredRole && user?.role !== requiredRole) {
        window.location.href = "/";
      }
    }
  }, [loading, user, requiredRole]);

  return { user, loading };
}
