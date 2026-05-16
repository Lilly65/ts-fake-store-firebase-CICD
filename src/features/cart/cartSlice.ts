import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../../types";

const loadCartFromStorage = (): CartItem[] => {
  const stored = sessionStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
};

const saveCartToStorage = (cart: CartItem[]): void => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
        state.items = state.items.filter((item) => item.id !== action.payload);
        saveCartToStorage(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;