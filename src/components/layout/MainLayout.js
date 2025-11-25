import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import NavbarAuth from "./NavbarAuth";
import Navbar from "./Navbar"; // navbar público

export default function MainLayout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {user ? <NavbarAuth /> : <Navbar />}

      <main>{children}</main>
    </div>
  );
}
