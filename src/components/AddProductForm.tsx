import { useState } from "react";
import { useAddProduct } from "../hooks/useProducts";

function AddProductForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const addProduct = useAddProduct();

  const handleSubmit = () => {
    setError("");

    if (!title || !price || !description || !category) {
      setError("Title, price, description, and category are required.");
      return;
    }

    addProduct.mutate(
      {
        title,
        price: Number(price),
        description,
        category,
        image: image || "https://via.placeholder.com/150",
        rating: { rate: 0, count: 0 },
      },
      {
        onSuccess: () => {
          setTitle("");
          setPrice("");
          setDescription("");
          setCategory("");
          setImage("");
          setIsOpen(false);
        },
        onError: (err) => {
          if (err instanceof Error) setError(err.message);
        },
      }
    );
  };

  if (!isOpen) {
    return <button onClick={() => setIsOpen(true)}>Add New Product</button>;
  }

  return (
    <div>
      <h2>Add New Product</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button onClick={handleSubmit}>Save Product</button>
      <button onClick={() => setIsOpen(false)}>Cancel</button>
    </div>
  );
}

export default AddProductForm;