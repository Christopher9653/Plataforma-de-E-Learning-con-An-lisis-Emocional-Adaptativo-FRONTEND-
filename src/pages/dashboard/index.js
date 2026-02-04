import { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "docente") {
        router.replace("/dashboard/docente");
      } else if (user.role === "estudiante") {
        router.replace("/dashboard/estudiante");
      }
    }
  }, [user, loading]);

  return null;
}
