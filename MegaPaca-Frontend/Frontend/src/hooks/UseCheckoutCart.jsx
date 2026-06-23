import { useCallback, useState } from "react";
import { useAuth } from "./UseAuth";
import { useCart } from "./UseCart";

export function useCheckoutCart() {
  const { user, apiUrl } = useAuth();
  const { cartItems, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const placeOrder = useCallback(async () => {
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      if (!user?.email) {
        throw new Error("No se encontró una sesión válida para el cliente.");
      }

      if (cartItems.length === 0) {
        throw new Error("No hay productos en el carrito.");
      }

      const customersResponse = await fetch(`${apiUrl}/customers`, {
        method: "GET",
        credentials: "include",
      });

      if (!customersResponse.ok) {
        throw new Error("No se pudo validar el cliente autenticado.");
      }

      const customers = await customersResponse.json();
      const customer = Array.isArray(customers)
        ? customers.find((item) => item.email === user.email)
        : null;

      if (!customer?._id) {
        throw new Error("No se encontró el cliente asociado a la sesión.");
      }

      const payload = {
        customerId: customer._id,
        products: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        status: "pending",
      };

      const orderResponse = await fetch(`${apiUrl}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const responseData = await orderResponse.json().catch(() => ({}));

      if (!orderResponse.ok) {
        throw new Error(
          responseData.message || "No se pudo finalizar el pedido.",
        );
      }

      clearCart();
      setMessage(responseData.message || "Pedido finalizado correctamente.");
      return true;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Error inesperado al finalizar el pedido.",
      );
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [apiUrl, cartItems, clearCart, user?.email]);

  return {
    placeOrder,
    submitting,
    message,
    error,
  };
}

export default useCheckoutCart;
