import {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  const CartContext = createContext(null);
  
  const CART_STORAGE_KEY = "megapaca:cart";
  
  function readStoredCart() {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
  }
  
  export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => readStoredCart());
  
    useEffect(() => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }, [cartItems]);
  
    const addItem = useCallback((megapaca) => {
      if (!megapaca?._id) {
        return;
      }
  
      setCartItems((currentItems) => {
        const existingItem = currentItems.find((item) => item._id === megapaca._id);
  
        if (existingItem) {
          return currentItems.map((item) =>
            item._id === megapaca._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
  
        return [
          ...currentItems,
          {
            ...megapaca,
            quantity: 1,
          },
        ];
      });
    }, []);
  
    const removeItem = useCallback((megapacaId) => {
      setCartItems((currentItems) =>
        currentItems.filter((item) => item._id !== megapacaId),
      );
    }, []);
  
    const increaseQuantity = useCallback((megapacaId) => {
      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item._id === megapacaId ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    }, []);
  
    const decreaseQuantity = useCallback((megapacaId) => {
      setCartItems((currentItems) =>
        currentItems
          .map((item) =>
            item._id === megapacaId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    }, []);
  
    const clearCart = useCallback(() => {
      setCartItems([]);
    }, []);
  
    const cartCount = useMemo(
      () => cartItems.reduce((total, item) => total + item.quantity, 0),
      [cartItems],
    );
  
    const cartTotal = useMemo(
      () =>
        cartItems.reduce(
          (total, item) => total + Number(item.price || 0) * item.quantity,
          0,
        ),
      [cartItems],
    );
  
    const value = {
      cartItems,
      cartCount,
      cartTotal,
      addItem,
      removeItem,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    };
  
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
  }
  
  export { CartContext };
  export default CartContext;
  