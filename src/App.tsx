import { useSelector } from "react-redux";
import { useState } from "react";
import { signOut } from "firebase/auth";
import type { RootState } from "./app/store";
import { auth } from "./firebase/config";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import UserProfile from "./components/UserProfile";
import OrderHistory from "./components/OrderHistory";
import OrderDetail from "./components/OrderDetail";

type View = "store" | "profile" | "orders" | "orderDetail";

function App() {
  const { user, isInitialized } = useSelector((state: RootState) => state.auth);
  const [showRegister, setShowRegister] = useState(false);
  const [view, setView] = useState<View>("store");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  if (!isInitialized) return <p>Loading...</p>;

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setView("orderDetail");
  };

  return (
    <div>
      <nav>
        <button onClick={() => setView("store")}>Store</button>
        <button onClick={() => setView("profile")}>Profile</button>
        <button onClick={() => setView("orders")}>Order History</button>
        <button onClick={() => signOut(auth)}>Logout</button>
      </nav>
      {view === "store" && (
        <>
          <Cart />
          <Home />
        </>
      )}
      {view === "profile" && <UserProfile />}
      {view === "orders" && (
        <OrderHistory onSelectOrder={handleSelectOrder} />
      )}
      {view === "orderDetail" && selectedOrderId && (
        <OrderDetail
          orderId={selectedOrderId}
          onBack={() => setView("orders")}
        />
      )}
    </div>
  );
}

export default App;