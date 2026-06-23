import CardMegaPaca from "../components/CardMegaPaca";
import { useDataMegaPaca } from "../hooks/MegaPacaProducts";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/UseCart";

function MegaPacaCatalog() {
  const { MegaPaca, loading, error, refetch } = useDataMegaPaca();
  const { cartCount } = useCart();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-4 py-1 text-sm font-medium text-amber-900">
              Catálogo público
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Ropa disponibles
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Datos consumidos con peticiones nativas desde el backend, listos
                para ser conectados después al carrito de compras.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/carrito"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Carrito ({cartCount})
            </Link>
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:text-amber-900"
            >
              Recargar ropa
            </button>
          </div>
        </header>

        {loading ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-medium text-slate-500">
            Cargando catálogo...
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
            {error}
          </div>
        ) : MegaPaca.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-medium text-slate-500">
            No hay ropas disponibles en este momento.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {MegaPaca.map((MegaPaca) => (
              <CardMegaPaca key={MegaPaca._id} MegaPaca={MegaPaca} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MegaPacaCatalog;
