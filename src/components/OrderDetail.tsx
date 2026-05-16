import { useOrder } from "../hooks/useOrders";

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
}

function OrderDetail({ orderId, onBack }: OrderDetailProps) {
  const { data: order, isLoading, isError } = useOrder(orderId);

  if (isLoading) return <p>Loading order...</p>;
  if (isError) return <p>Failed to load order.</p>;
  if (!order) return null;

  return (
    <div>
      <button onClick={onBack}>Back to Order History</button>
      <h2>Order Details</h2>
      <p>Order ID: {order.id}</p>
      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      {order.items.map((item) => (
        <div key={item.productId}>
          <img src={item.image} alt={item.title} width={60} />
          <p>{item.title}</p>
          <p>Quantity: {item.quantity}</p>
          <p>${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      ))}
      <p>Total: ${order.totalPrice.toFixed(2)}</p>
    </div>
  );
}

export default OrderDetail;