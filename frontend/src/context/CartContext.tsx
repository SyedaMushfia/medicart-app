import React, { createContext, useContext, useState, useEffect } from 'react';
import { Medicine } from '../../../types.ts';
import { toast } from 'sonner';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  addToCart: (medicine: Medicine, quantity?: number) => boolean;
  addItem: (medicine: Medicine, quantity?: number) => boolean;
  updateQuantity: (medicineId: string, quantity: number) => boolean;
  removeFromCart: (medicineId: string) => void;
  removeItem: (medicineId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('medicart_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('medicart_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (medicine: Medicine, quantity: number = 1): boolean => {
    if (medicine.stock_quantity <= 0) {
      toast.error(`${medicine.name} is currently out of stock`);
      return false;
    }

    let success = true;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.medicine.id === medicine.id);
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        const newQty = currentQty + quantity;
        if (newQty > medicine.stock_quantity) {
          toast.warning(`Cannot add more: only ${medicine.stock_quantity} available in stock`);
          success = false;
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        toast.success(`Updated ${medicine.name} quantity in cart (${newQty})`);
        return updated;
      } else {
        if (quantity > medicine.stock_quantity) {
          toast.warning(`Cannot add ${quantity}: only ${medicine.stock_quantity} available in stock`);
          success = false;
          return prev;
        }
        toast.success(`Added ${medicine.name} to cart`);
        return [...prev, { medicine, quantity }];
      }
    });

    return success;
  };

  const updateQuantity = (medicineId: string, quantity: number): boolean => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return true;
    }

    let success = true;
    setItems((prev) => {
      const existing = prev.find((i) => i.medicine.id === medicineId);
      if (!existing) return prev;

      if (quantity > existing.medicine.stock_quantity) {
        toast.warning(
          `Only ${existing.medicine.stock_quantity} units available for ${existing.medicine.name}`
        );
        success = false;
        return prev;
      }

      return prev.map((item) =>
        item.medicine.id === medicineId ? { ...item, quantity } : item
      );
    });

    return success;
  };

  const removeFromCart = (medicineId: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.medicine.id === medicineId);
      if (item) {
        toast.info(`Removed ${item.medicine.name} from cart`);
      }
      return prev.filter((i) => i.medicine.id !== medicineId);
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = Number(
    items.reduce((acc, item) => acc + item.medicine.price * item.quantity, 0).toFixed(2)
  );
  const total = subtotal;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        total,
        addToCart,
        addItem: addToCart,
        updateQuantity,
        removeFromCart,
        removeItem: removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems: itemCount,
        totalAmount: total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
