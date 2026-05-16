import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import cartReducer from "../../features/cart/cartSlice";
import authReducer from "../../features/auth/authSlice";
import ProductCard from "../ProductCard";
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

const mockProduct: Product = {
  id: "test-id-1",
  title: "Test Product",
  price: 29.99,
  category: "electronics",
  description: "A test product description",
  image: "https://via.placeholder.com/150",
  rating: { rate: 4.5, count: 100 },
};

const createTestStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
  });

const renderWithProviders = (ui: React.ReactElement) => {
  const store = createTestStore();
  const queryClient = new QueryClient();
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    </Provider>
  );
};

describe("ProductCard", () => {
  it("renders product information correctly", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("electronics")).toBeInTheDocument();
    expect(screen.getByText("A test product description")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("4.5 / 5")).toBeInTheDocument();
  });

  it("renders add to cart, edit, and delete buttons", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("shows edit form when edit button is clicked", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByDisplayValue("Test Product")).toBeInTheDocument();
    expect(screen.getByDisplayValue("29.99")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

    it("returns to product view when cancel is clicked", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });
});