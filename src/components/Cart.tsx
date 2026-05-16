import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { removeFromCart, clearCart } from "../features/cart/cartSlice";
import { useCreateOrder } from "../hooks/useOrders";

function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const [checkedOut, setCheckedOut] = useState(false);

  const createOrder = useCreateOrder();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!user) return;

    const orderItems = items.map((item) => ({
      productId: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    createOrder.mutate(
      {
        userId: user.uid,
        items: orderItems,
        totalPrice,
        createdAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          dispatch(clearCart());
          setCheckedOut(true);
        },
      }
    );
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  if (checkedOut && items.length === 0) {
    return <p>Order placed. Cart has been cleared.</p>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <div>
          {items.map((item) => (
            <div key={item.id}>
              <img src={item.image} alt={item.title} width={60} />
              <p>{item.title}</p>
              <p>Quantity: {item.quantity}</p>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          ))}
          <p>Total items: {totalItems}</p>
          <p>Total price: ${totalPrice.toFixed(2)}</p>
          <button onClick={handleCheckout} disabled={createOrder.isPending}>
            {createOrder.isPending ? "Placing order..." : "Checkout"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;