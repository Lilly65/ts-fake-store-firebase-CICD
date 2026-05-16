import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import type { Product } from "../types";
import { addToCart } from "../features/cart/cartSlice";
import { useUpdateProduct, useDeleteProduct } from "../hooks/useProducts";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [imgSrc, setImgSrc] = useState(product.image);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(product.price);
  const [description, setDescription] = useState(product.description);

  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  const handleImageError = () => {
    setImgSrc("https://via.placeholder.com/150");
  };

  const handleUpdate = () => {
    updateProduct.mutate({
      id: product.id,
      updates: { title, price, description },
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteProduct.mutate(product.id);
  };

  if (isEditing) {
    return (
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Price"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button onClick={handleUpdate}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      <img src={imgSrc} alt={product.title} onError={handleImageError} />
      <h2>{product.title}</h2>
      <p>{product.category}</p>
      <p>{product.description}</p>
      <p>{product.rating.rate} / 5</p>
      <p>${product.price.toFixed(2)}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}

export default ProductCard;