import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// 1. Cambiar a 'useAuth' con 'u' minúscula aquí:
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// 2. Cambiar a 'useAuth' con 'u' minúscula aquí también:
export default useAuth;