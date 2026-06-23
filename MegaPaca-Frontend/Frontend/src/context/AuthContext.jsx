import { createContext, useCallback, useEffect, useState } from "react";

// Creamos el contexto global de autenticación.
// Usar contexto evita "prop drilling" (pasar props por muchos niveles).
const AuthContext = createContext(null);

const API_URL = "http://localhost:4000/api";
const SESSION_STORAGE_KEY = "megapaca:auth-session";

/**
 * Lee la sesión guardada en localStorage.
 *
 * ¿Por qué existe esta función?
 * Porque al recargar la página, el estado de React se reinicia.
 * Entonces usamos localStorage para recuperar una sesión mínima.
 *
 * @returns {object|null} Objeto de sesión parseado o null si no existe/está dañado.
 */
function readStoredSession() {
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);

    return storedSession ? JSON.parse(storedSession) : null;
  } catch {
    // Buena práctica: si el JSON está corrupto, limpiamos la clave
    // para evitar errores repetitivos en futuros renders.
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return null;
  }
}

/**
 * Proveedor de autenticación para toda la aplicación.
 *
 * ¿Qué recibe?
 * @param {object} props
 * @param {React.ReactNode} props.children Componentes hijos que usarán el contexto.
 *
 * ¿Qué expone?
 * user, loading, isAuthenticated y funciones de auth (login, register, logout, etc.).
 */
export function AuthProvider({ children }) {
  // user almacena una versión mínima del usuario (por ahora, email).
  const [user, setUser] = useState(null);
  // loading indica si aún estamos recuperando sesión al iniciar la app.
  const [loading, setLoading] = useState(true);

  /**
   * Efecto de inicialización.
   *
   * ¿Por qué useEffect con []?
   * Porque queremos ejecutar esta lógica solo una vez al montar el provider.
   */
  useEffect(() => {
    const storedSession = readStoredSession();

    if (storedSession?.user) {
      setUser(storedSession.user);
    }

    setLoading(false);
  }, []);

  /**
   * Guarda o limpia la sesión en estado + localStorage.
   *
   * @param {object|null} nextUser Usuario a persistir o null para cerrar sesión.
   * @returns {void}
   *
   * Tip de buenas prácticas:
   * Mantener esta lógica en una sola función evita duplicación de código
   * y reduce errores al sincronizar estado con almacenamiento local.
   */
  const persistSession = useCallback((nextUser) => {
    if (!nextUser) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setUser(null);
      return;
    }

    const session = {
      user: nextUser,
      authenticatedAt: new Date().toISOString(),
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    setUser(nextUser);
  }, []);

  /**
   * Inicia sesión contra el backend.
   *
   * @param {{email: string, password: string}} credentials Credenciales del formulario.
   * @returns {Promise<{ok: boolean, message: string}>} Resultado para la UI.
   *
   * Nota didáctica:
   * - Usamos credentials: "include" para permitir envío/recepción de cookies.
   * - Devolvemos un objeto controlado (ok + message) para que la vista
   *   decida cómo mostrar feedback sin mezclar lógica de red con UI.
   */
  const login = useCallback(
    async ({ email, password }) => {
      const response = await fetch(`${API_URL}/loginCustomers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Estandarizamos errores para que el componente no dependa
        // del formato exacto del backend.
        return {
          ok: false,
          message: payload.message || "No se pudo iniciar sesión",
        };
      }

      persistSession({ email });

      return {
        ok: true,
        message: payload.message || "Sesión iniciada correctamente",
      };
    },
    [persistSession],
  );

  /**
   * Paso 1 de registro: envía datos y solicita código de verificación.
   *
   * @param {object} registrationData Datos del formulario de registro.
   * @returns {Promise<{ok: boolean, message: string}>}
   */
  const register = useCallback(async (registrationData) => {
    const response = await fetch(`${API_URL}/registerCustomer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(registrationData),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        message: payload.message || "No se pudo iniciar el registro",
      };
    }

    return {
      ok: true,
      message: payload.message || "Código de verificación enviado",
    };
  }, []);

  /**
   * Paso 2 de registro: valida el código enviado por correo.
   *
   * @param {{verificationCodeRequest: string}} payloadCode Código ingresado por el usuario.
   * @returns {Promise<{ok: boolean, message: string}>}
   */
  const verifyRegistrationCode = useCallback(
    async ({ verificationCodeRequest }) => {
      const response = await fetch(
        `${API_URL}/registerCustomer/verifyCodeEmail`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ verificationCodeRequest }),
        },
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          ok: false,
          message: payload.message || "No se pudo verificar el código",
        };
      }

      return {
        ok: true,
        message: payload.message || "Cuenta registrada correctamente",
      };
    },
    [],
  );

  /**
   * Cierra sesión en backend y frontend.
   *
   * @returns {Promise<void>}
   *
   * Tip de buenas prácticas:
   * Se usa try/finally para asegurar que la sesión local se limpie incluso
   * si la petición de logout falla (por red o servidor).
   */
  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      persistSession(null);
    }
  }, [persistSession]);

  // value reúne todo lo que otros componentes necesitan del contexto.
  // isAuthenticated se deriva del estado para no repetir esa lógica en cada vista.
  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    verifyRegistrationCode,
    logout,
    clearSession: () => persistSession(null),
    apiUrl: API_URL,
  };

  // El Provider "inyecta" este valor a toda la app hija.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
export default AuthContext;
