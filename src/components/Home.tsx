import { useState } from "react";
import { useProducts, useCategories } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import AddProductForm from "./AddProductForm";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: products, isLoading, isError } = useProducts();
  const { data: categories } = useCategories();

  const filtered =
    selectedCategory === "all"
      ? products
      : products?.filter((p) => p.category === selectedCategory);

  return (
    <div>
      <h1>Fake Store</h1>
      <AddProductForm />
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories?.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {isLoading && <p>Loading products...</p>}
      {isError && <p>Failed to load products.</p>}
      {filtered?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default Home;