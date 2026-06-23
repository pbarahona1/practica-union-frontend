import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

const initialForm = {
  name: "",
  lastName: "",
  birthdate: "",
  email: "",
  password: "",
};

function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const { register, verifyRegistrationCode } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleStartRegistration = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const result = await register({
        ...form,
        isVerified: false,
        loginAttemps: 0,
        timeOut: null,
      });

      if (!result.ok) {
        setStatus({ type: "error", message: result.message });
        return;
      }

      setStatus({ type: "success", message: result.message });
      setStep(2);
    } catch {
      setStatus({
        type: "error",
        message: "No se pudo conectar con el servidor",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyCode = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const result = await verifyRegistrationCode({
        verificationCodeRequest: code,
      });

      if (!result.ok) {
        setStatus({ type: "error", message: result.message });
        return;
      }

      setStatus({ type: "success", message: result.message });
      navigate("/login", { replace: true });
    } catch {
      setStatus({ type: "error", message: "No se pudo verificar el código" });
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
              Crear cuenta
            </span>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Registra tu cuenta en dos pasos.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Primero enviamos el código de verificación a tu correo y después
                confirmamos la cuenta para que puedas iniciar sesión.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Paso 1</p>
              <p className="mt-1 font-semibold text-slate-900">
                Datos personales
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Paso 2</p>
              <p className="mt-1 font-semibold text-slate-900">
                Código por correo
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm text-slate-500">Resultado</p>
              <p className="mt-1 font-semibold text-slate-900">
                Acceso al inicio de sesión
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          {step === 1 ? (
            <form
              className="w-full max-w-md space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              onSubmit={handleStartRegistration}
            >
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  Crear cuenta
                </h2>
                <p className="text-sm text-slate-500">
                  Completa tus datos para enviar el código de verificación.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 sm:col-span-1">
                  <span className="text-sm font-medium text-slate-700">
                    Nombre
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="block space-y-2 sm:col-span-1">
                  <span className="text-sm font-medium text-slate-700">
                    Apellido
                  </span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Fecha de nacimiento
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  type="date"
                  name="birthdate"
                  value={form.birthdate}
                  onChange={handleChange}
                />
              </label>

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
                  required
                />
              </label>

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
                {submitting ? "Enviando código..." : "Enviar código"}
              </button>

              <p className="text-center text-sm text-slate-600">
                ¿Ya tienes cuenta?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-amber-700 hover:text-amber-900"
                >
                  Volver al inicio de sesión
                </Link>
              </p>
            </form>
          ) : (
            <form
              className="w-full max-w-md space-y-6 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              onSubmit={handleVerifyCode}
            >
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  Verifica tu correo
                </h2>
                <p className="text-sm text-slate-500">
                  Ingresa el código que te enviamos por email para activar la
                  cuenta.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">
                  Código de verificación
                </span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
                  type="text"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  required
                />
              </label>

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
                {submitting ? "Verificando..." : "Confirmar cuenta"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:text-amber-900"
              >
                Editar datos
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default Register;
