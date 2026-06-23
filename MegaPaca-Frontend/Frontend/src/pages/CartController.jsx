import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import { useCart } from "../hooks/UseCart";
import { useCheckoutCart } from "../hooks/UseCheckoutCart";

function CartOrderMegaPaca() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { placeOrder, submitting, message, error } = useCheckoutCart();

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    await placeOrder();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-full bg-amber-50 px-4 py-1 text-sm font-medium text-amber-900">
              Carrito de compras
            </span>
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Tu pedido actual
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Revisa cantidades, elimina productos y prepara el flujo para el
                checkout autenticado.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Volver al catálogo
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-amber-300 hover:text-amber-900"
            >
              Vaciar carrito
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-sm font-medium text-slate-500">
                Aún no agregas ropas al carrito.
              </div>
            ) : (
              cartItems.map((item) => (
                <article
                  key={item._id}
                  className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-slate-950">
                      {item.name}
                    </h2>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                      {item.description || "Sin descripción disponible."}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      ${Number(item.price || 0).toFixed(2)} por unidad
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 transition hover:border-amber-300 hover:text-amber-900"
                    >
                      -
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => increaseQuantity(item._id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-700 transition hover:border-amber-300 hover:text-amber-900"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      className="inline-flex items-center justify-center rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-700">
              Resumen
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Productos</span>
                <span className="font-semibold text-slate-950">
                  {cartCount}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total</span>
                <span className="text-xl font-black text-slate-950">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0 || submitting}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              {submitting
                ? "Procesando pedido..."
                : isAuthenticated
                  ? "Finalizar pedido"
                  : "Inicia sesión para comprar"}
            </button>

            {message ? (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
}

export default CartOrderMegaPaca;
