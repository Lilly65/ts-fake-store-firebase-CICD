import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/config";
import { store } from "./app/store";
import { setUser, setInitialized } from "./features/auth/authSlice";
import type { UserProfile } from "./types";
import App from "./App";

const queryClient = new QueryClient();

onAuthStateChanged(auth, async (firebaseUser) => {
  if (firebaseUser) {
    const docRef = doc(db, "users", firebaseUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      store.dispatch(setUser(docSnap.data() as UserProfile));
    }
  } else {
    store.dispatch(setUser(null));
  }
  store.dispatch(setInitialized());
});

import { seedProducts } from "./utils/seedProducts";
seedProducts().catch(console.error);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);