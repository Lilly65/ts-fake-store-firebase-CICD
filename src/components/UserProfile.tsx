import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../firebase/config";
import type { RootState, AppDispatch } from "../app/store";
import { setUser } from "../features/auth/authSlice";

function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const [name, setName] = useState(user?.name ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [message, setMessage] = useState("");

  if (!user) return null;

  const handleUpdate = async () => {
    setMessage("");
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { name, address });
      dispatch(setUser({ ...user, name, address }));
      setMessage("Profile updated.");
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "users", user.uid));
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>{user.email}</p>
      {message && <p>{message}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      <button onClick={handleUpdate}>Save Changes</button>
      <button onClick={handleDelete}>Delete Account</button>
    </div>
  );
}

export default UserProfile;