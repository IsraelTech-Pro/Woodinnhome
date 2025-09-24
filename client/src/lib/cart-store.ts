import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    images: string[];
    inStock: boolean;
  };
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  getItemCount: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setOpen: (open) => set({ isOpen: open }),
      getItemCount: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalAmount: () => {
        const items = get().items;
        return items.reduce((total, item) => {
          return total + (parseFloat(item.product.price) * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'woodinn-cart',
    }
  )
);
