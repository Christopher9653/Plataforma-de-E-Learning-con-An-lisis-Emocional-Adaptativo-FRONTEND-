import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/context/AuthContext";

export default function AuthGuard({ role, children }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (role && user.role !== role) router.push("/");
  }, [user]);

  if (!user) return null;
  return children;
}
