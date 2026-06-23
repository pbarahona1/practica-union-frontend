import { Link } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import { useCart } from "../hooks/UseCart";

function Home() {
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10 lg:flex-row lg:items-center lg:gap-14">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-sm font-medium text-amber-900">
            MegaPaca en linea
          </span>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Ve nuestro catalogo y realiza las compras en linea
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Explora el catálogo sin iniciar sesión, arma tu carrito y finaliza
              la compra cuando tengas tu cuenta activa.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-medium">
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
              {isAuthenticated
                ? `Sesión activa: ${user?.email ?? "usuario"}`
                : "Sesión no iniciada"}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
              Autenticación centralizada en contexto
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700">
              Interfaz construida con Tailwind
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Ver catálogo
            </Link>
            <Link
              to="/carrito"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:text-amber-900"
            >
              Carrito ({cartCount})
            </Link>
            <Link
              to="/ordenes"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:text-amber-900"
            >
              Historial
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:text-amber-900"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:text-amber-900"
            >
              Crear cuenta
            </Link>
          </div>
        </div>

        <aside className="w-full max-w-md rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
                Qué puedes hacer
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Explora el catálogo, crea tu cuenta y completa tu pedido.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Contexto</p>
                <p className="mt-1 font-semibold text-slate-900">
                  AuthProvider
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">Ruta</p>
                <p className="mt-1 font-semibold text-slate-900">/catalogo</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Home;
