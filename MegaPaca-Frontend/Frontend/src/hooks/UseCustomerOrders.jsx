import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./UseAuth";

const EMPTY_ORDERS_STATE = {
  orders: [],
  loading: true,
  error: "",
  refetch: () => {},
};

export function useCustomerOrders() {
  const { user, apiUrl } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!user?.email) {
        throw new Error("No se encontró una sesión válida.");
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

      const cartsResponse = await fetch(`${apiUrl}/cart`, {
        method: "GET",
        credentials: "include",
      });

      if (!cartsResponse.ok) {
        throw new Error("No se pudo cargar el historial de pedidos.");
      }

      const carts = await cartsResponse.json();
      const filteredOrders = Array.isArray(carts)
        ? carts.filter(
            (cart) =>
              String(cart.customerId?._id || cart.customerId) ===
              String(customer._id),
          )
        : [];

      setOrders(filteredOrders);
    } catch (fetchError) {
      setOrders([]);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Error inesperado al cargar el historial.",
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user?.email]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}

export default useCustomerOrders;

