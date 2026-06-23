import { useCart } from "../hooks/UseCart";
import toast from "react-hot-toast";

function CardMegaPaca({ MegaPaca }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(MegaPaca);
    toast.success(`${MegaPaca.name} agregada al carrito`);
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5">
      <div className="flex h-44 items-end justify-between border-b border-slate-200 bg-slate-100 p-5 text-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
            Ropa Ecologica
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-tight">
            {MegaPaca.name}
          </h3>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Precio
          </p>
          <p className="text-xl font-extrabold">
            ${Number(MegaPaca.price || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {MegaPaca.description || "Sin descripción disponible para esta megapaca."}
        </p>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Stock disponible</span>
          <span className="font-bold text-slate-950">{MegaPaca.stock ?? 0}</span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={(MegaPaca.stock ?? 0) <= 0}
          className="mt-auto inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:hover:bg-slate-200 disabled:hover:text-slate-500"
        >
          {(MegaPaca.stock ?? 0) <= 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}

export default CardMegaPaca;
