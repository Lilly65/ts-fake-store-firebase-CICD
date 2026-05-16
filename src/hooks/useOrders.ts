import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Order } from "../types";

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: Omit<Order, "id">) => {
      await addDoc(collection(db, "orders"), order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useOrders(userId: string) {
  return useQuery<Order[]>({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Order, "id">),
      }));
    },
    enabled: !!userId,
  });
}

export function useOrder(orderId: string) {
  return useQuery<Order>({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Order not found.");
      return { id: docSnap.id, ...(docSnap.data() as Omit<Order, "id">) };
    },
    enabled: !!orderId,
  });
}