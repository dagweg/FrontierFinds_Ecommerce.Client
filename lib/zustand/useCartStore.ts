import { useEnvStore } from "@/lib/zustand/useEnvStore";
import { CartItemResult, CartResult } from "@/types/cart.types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface CartState {
  cart: CartResult;
  isLoading: boolean; // Add loading state
  error: string | null; // Add error state
  addToCart: (productId: string) => void;
  updateCart: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  initializeCart: () => Promise<void>; // Initializer function
  markItemAsSeen: (cartItemId: string) => void;
  rate: number;
  setRate: (rate: number) => void;
}

// Initial State (before fetching)
// const initialState: {
//   cart: CartResult;
//   isLoading: boolean;
//   error: string | null;
// } = {
//   cart: {
//     items: [],
//     totalItems: 0,
//     totalItemsFetched: 0,
//     totalPrice: 0,
//     get NotSeenCount(): number {
//       return this.items.reduce((acc, cur) => acc + (!cur.seen ? 1 : 0), 0);
//     },
//   },
//   isLoading: false,
//   error: null,
// };

const apiBaseUrl = useEnvStore.getState().apiBaseUrl;

export const useCartStore = create<CartState>((set, get) => {
  const cart: CartResult = {
    items: [],
    totalItems: 0,
    totalItemsFetched: 0,
    totalPrice: 0,
    notSeenCount: 0,
  };

  return {
    cart,
    // set: (state) => set(state),
    isLoading: false,
    error: null,
    notSeenItemCount: 0,
    rate: 1,
    setRate: (rate) => set({ rate: Math.max(1, Math.min(100, rate)) }), // Setter for rate
    initializeCart: async () => {
      set({ isLoading: true, error: null }); // Start loading
      try {
        const r = await fetch(`${apiBaseUrl}/me/cart`, {
          method: "GET", // Correct method for fetching the cart
          credentials: "include",
        });

        if (!r.ok) {
          throw new Error(`Failed to fetch cart: ${r.status} ${r.statusText}`); // Better error handling
        }

        const cartData: CartResult = await r.json();

        set({
          cart: cartData,
          isLoading: false,
        }); // Update with fetched data
      } catch (error: any) {
        console.error("Error initializing cart:", error);
        set({
          isLoading: false,
          error: error.message || "An error occurred",
        }); // Set error state
      }
    },

    addToCart: async (productId) => {
      if (get().cart.items.some((x) => x.product.productId == productId))
        return;

      set({ isLoading: true, error: null }); // Set loading state during add
      const req = {
        productId,
        quantity: 1,
      };

      try {
        const r = await fetch(`${apiBaseUrl}/me/cart`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" }, // Add Content-Type header
          body: JSON.stringify([req]),
        });

        if (!r.ok) {
          throw new Error(`Failed to add to cart: ${r.status} ${r.statusText}`);
        }

        const updatedCart = await r.json(); //  Expect a single item

        set((state) => ({
          ...state,
          cart: updatedCart,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error("Error adding to cart:", error);
        set({
          isLoading: false,
          error: error.message || "An error occurred",
        });
      }
    },
    updateCart: async (cartItemId, quantity) => {
      set({ isLoading: true, error: null });
      var req = {
        cartItemId,
        quantity,
      };
      try {
        const r = await fetch(`${apiBaseUrl}/me/cart`, {
          method: "PATCH", // Use PATCH for updating
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req),
        });

        if (!r.ok) {
          throw new Error(
            `Failed to update cart item: ${r.status} ${r.statusText}`
          );
        }

        const b = await r.json();

        //

        // Optimistically update the cart
        set((state) => ({
          cart: b,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error("Error updating cart item:", error);
        set({
          isLoading: false,
          error: error.message || "An error occurred",
        });
      }
    },

    removeFromCart: async (cartItemId) => {
      set({ isLoading: true, error: null });

      try {
        const r = await fetch(`${apiBaseUrl}/me/cart/${cartItemId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!r.ok) {
          throw new Error(
            `Failed to remove item from cart: ${r.status} ${r.statusText}`
          );
        }

        const b = await r.json();

        set((state) => ({
          cart: b,
          isLoading: false,
        }));
      } catch (error: any) {
        console.error("Error removing item from cart: ", error);
        set({
          isLoading: false,
          error: error.message || "An error occurred",
        });
      }
    },
    clearCart: async () => {
      if (get().cart.items.length === 0) return;
      set({ isLoading: true, error: null });

      try {
        const r = await fetch(`${apiBaseUrl}/me/cart`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!r.ok) {
          throw new Error(
            `Failed to clear the cart: ${r.status} ${r.statusText}`
          );
        }

        set((state) => ({
          ...state,
          cart,
          isLoading: false,
          error: null,
        }));
      } catch (error: any) {
        console.error("Error clearing cart: ", error);
        set({
          isLoading: false,
          error: error.message || "An error occurred",
        });
      }
    },
    markItemAsSeen: async (cartItemId: string) => {
      const item = get().cart.items.find((item) => item.id === cartItemId);
      if (!item) return;
      const req = {
        cartItemId,
        quantity: item.quantity,
        seen: true,
      };

      if (item.seen) return;

      const r = await fetch(`${apiBaseUrl}/me/cart`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(req),
        headers: { "Content-Type": "application/json" },
      });

      const b = await r.json();

      console.log(b);
      console.log(req);

      if (r.ok) {
        set((state) => ({
          ...state,
          cart: {
            ...state.cart,
            notSeenCount: state.cart.notSeenCount - 1 || 0,
            items: state.cart.items.map((item) =>
              item.id === cartItemId ? { ...item, seen: true } : item
            ),
          },
        }));
      }
    },
  };
});
