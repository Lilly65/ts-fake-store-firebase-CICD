import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cartReducer from "../../features/cart/cartSlice";
import authReducer from "../../features/auth/authSlice";
import { setUser } from "../../features/auth/authSlice";
import Cart from "../Cart";
import type { CartItem } from "../../types";

vi.mock("../../hooks/useOrders", () => ({
  useCreateOrder: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const mockUser = {
  uid: "test-uid",
  email: "test@test.com",
  name: "Test User",
  address: "123 Test St",
};

const mockCartItem: CartItem = {
  id: "product-1",
  title: "Test Product",
  price: 29.99,
  category: "electronics",
  description: "A test product",
  image: "https://via.placeholder.com/150",
  rating: { rate: 4.5, count: 100 },
  quantity: 2,
};

const createTestStore = (withItems: boolean = false) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
  });

  store.dispatch(setUser(mockUser));

  if (withItems) {
    store.dispatch({
      type: "cart/addToCart",
      payload: { ...mockCartItem, quantity: 1 },
    });
    store.dispatch({
      type: "cart/addToCart",
      payload: { ...mockCartItem, quantity: 1 },
    });
  }

  return store;
};

const renderWithProviders = (ui: React.ReactElement, withItems: boolean = false) => {
  const store = createTestStore(withItems);
  const queryClient = new QueryClient();
  return {
    store,
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {ui}
        </QueryClientProvider>
      </Provider>
    ),
  };
};

describe("Cart", () => {
  it("renders empty cart message when cart has no items", () => {
    renderWithProviders(<Cart />);

    expect(screen.getByText("Cart is empty.")).toBeInTheDocument();
  });

  it("renders cart items when items are present", () => {
    renderWithProviders(<Cart />, true);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText("$59.98")).toBeInTheDocument();
  });

  it("displays correct total items and total price", () => {
    renderWithProviders(<Cart />, true);

    expect(screen.getByText("Total items: 2")).toBeInTheDocument();
    expect(screen.getByText("Total price: $59.98")).toBeInTheDocument();
  });

  it("removes item from cart when remove button is clicked", () => {
    renderWithProviders(<Cart />, true);

    fireEvent.click(screen.getByText("Remove"));

    expect(screen.queryByText("Test Product")).not.toBeInTheDocument();
    expect(screen.getByText("Cart is empty.")).toBeInTheDocument();
  });
});