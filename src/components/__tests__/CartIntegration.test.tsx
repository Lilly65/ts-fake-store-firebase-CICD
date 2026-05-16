import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cartReducer from "../../features/cart/cartSlice";
import authReducer from "../../features/auth/authSlice";
import { setUser } from "../../features/auth/authSlice";
import ProductCard from "../ProductCard";
import Cart from "../Cart";
import type { Product } from "../../types";

vi.mock("../../hooks/useProducts", () => ({
  useUpdateProduct: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteProduct: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("../../hooks/useOrders", () => ({
  useCreateOrder: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const mockProduct: Product = {
  id: "product-1",
  title: "Integration Test Product",
  price: 49.99,
  category: "electronics",
  description: "A product for integration testing",
  image: "https://via.placeholder.com/150",
  rating: { rate: 4.0, count: 50 },
};

const mockUser = {
  uid: "test-uid",
  email: "test@test.com",
  name: "Test User",
  address: "123 Test St",
};

const createTestStore = () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
  });
  store.dispatch(setUser(mockUser));
  return store;
};

const renderWithProviders = (ui: React.ReactElement) => {
  const store = createTestStore();
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

describe("Cart Integration", () => {
  it("cart is empty before any product is added", () => {
    renderWithProviders(
      <>
        <Cart />
        <ProductCard product={mockProduct} />
      </>
    );

    expect(screen.getByText("Cart is empty.")).toBeInTheDocument();
  });

  it("adds a product to the cart when add to cart button is clicked", () => {
    renderWithProviders(
      <>
        <Cart />
        <ProductCard product={mockProduct} />
      </>
    );

    fireEvent.click(screen.getByText("Add to Cart"));

    expect(screen.getByText("Quantity: 1")).toBeInTheDocument();
    expect(screen.getByText("Total items: 1")).toBeInTheDocument();
    expect(screen.getByText("Total price: $49.99")).toBeInTheDocument();
  });

  it("increments quantity when the same product is added twice", () => {
    renderWithProviders(
      <>
        <Cart />
        <ProductCard product={mockProduct} />
      </>
    );

    fireEvent.click(screen.getByText("Add to Cart"));
    fireEvent.click(screen.getByText("Add to Cart"));

    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText("Total items: 2")).toBeInTheDocument();
    expect(screen.getByText("Total price: $99.98")).toBeInTheDocument();
  });

  it("removes product from cart when remove button is clicked", () => {
    renderWithProviders(
      <>
        <Cart />
        <ProductCard product={mockProduct} />
      </>
    );

    fireEvent.click(screen.getByText("Add to Cart"));
    expect(screen.getByText("Quantity: 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Remove"));
    expect(screen.queryByText("Quantity: 1")).not.toBeInTheDocument();
    expect(screen.getByText("Cart is empty.")).toBeInTheDocument();
  });
});