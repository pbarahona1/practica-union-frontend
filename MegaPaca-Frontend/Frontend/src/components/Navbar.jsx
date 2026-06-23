import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";

const baseLinkClass =
  "rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-white";

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const linkClassName = ({ isActive }) =>
    `${baseLinkClass} ${
      isActive
        ? "bg-slate-950 text-white"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-black tracking-tight text-amber-950 transition hover:border-amber-300 hover:bg-amber-100"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-950 text-xs text-white">
              PZ
            </span>
            MegaPaca en línea
          </Link>

          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 lg:hidden">
            Carrito {cartCount}
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={linkClassName}>
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={linkClassName}>
            Catálogo
          </NavLink>
          <NavLink to="/carrito" className={linkClassName}>
            Carrito ({cartCount})
          </NavLink>
          {isAuthenticated ? (
            <NavLink to="/ordenes" className={linkClassName}>
              Historial
            </NavLink>
          ) : null}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={linkClassName}>
                Ingresar
              </NavLink>
              <NavLink to="/register" className={linkClassName}>
                Registro
              </NavLink>
            </>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 md:block">
                {user?.email ?? "Sesión activa"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
