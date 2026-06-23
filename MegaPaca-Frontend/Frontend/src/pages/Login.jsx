import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

const initialForm = {
  email: "",
  password: "",
};

function Login() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const result = await login(form);

      if (!result.ok) {
        setStatus({ type: "error", message: result.message });
        return;
      }

      setStatus({ type: "success", message: result.message });
      navigate(redirectTo, { replace: true });
    } catch {
      setStatus({
        type: "error",
        message: "No se pudo conectar con el servidor",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-between gap-8 border-b border-slate-200 bg-slate-100 p-8 text-slate-900 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-sm font-medium text-amber-900">
              Acceso seguro
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Inicia sesión para continuar con tu pedido.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                El acceso valida la sesión con el backend y deja listo el flujo
                para pedidos, carrito e historial de órdenes.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Autenticación</p>
              <p className="mt-1 font-semibold text-slate-900">
                Sesión centralizada
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Protección</p>
              <p className="mt-1 font-semibold text-slate-900">
                Rutas privadas
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Sesión</p>
              <p className="mt-1 font-semibold text-slate-900">Cookie segura</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <form
            className="w-full max-w-md space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Bienvenido de vuelta
              </h2>
              <p className="text-sm text-slate-500">
                Ingresa tus credenciales para continuar.
              </p>
            </div>

            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Correo electrónico
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Contraseña
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>

            {status.message ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                  status.type === "error"
                    ? "border border-red-200 bg-red-50 text-red-700"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Validando sesión..." : "Ingresar"}
            </button>

            <p className="text-center text-xs leading-5 text-slate-500">
              La sesión se valida con el backend y se protege mediante cookie
              segura.
            </p>

            <p className="text-center text-sm text-slate-600">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="font-semibold text-amber-700 hover:text-amber-900"
              >
                Regístrate aquí
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Login;
