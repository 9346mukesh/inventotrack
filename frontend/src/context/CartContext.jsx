import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data.items || []);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    user ? loadCart() : setCart([]);
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, loading, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);