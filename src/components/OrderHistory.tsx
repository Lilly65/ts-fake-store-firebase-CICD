import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import { useOrders } from "../hooks/useOrders";

interface OrderHistoryProps {
  onSelectOrder: (orderId: string) => void;
}

function OrderHistory({ onSelectOrder }: OrderHistoryProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: orders, isLoading, isError } = useOrders(user?.uid ?? "");

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Failed to load orders.</p>;

  if (!orders || orders.length === 0) {
    return <p>No orders yet.</p>;
  }

  return (
    <div>
      <h2>Order History</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          <p>Total: ${order.totalPrice.toFixed(2)}</p>
          <button onClick={() => onSelectOrder(order.id)}>View Details</button>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;