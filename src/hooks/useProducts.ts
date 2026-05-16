import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { Product } from "../types";

const toProduct = (id: string, data: Record<string, unknown>): Product => {
  const { id: _ignored, ...rest } = data;
  return { id, ...rest } as Product;
};

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "products"));
      return snapshot.docs.map((d) =>
        toProduct(d.id, d.data() as Omit<Product, "id">)
      );
    },
  });
}

export function useCategories() {
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const categories = snapshot.docs.map(
        (d) => (d.data() as Omit<Product, "id">).category
      );
      return ["all", ...Array.from(new Set(categories))];
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      await addDoc(collection(db, "products"), product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Omit<Product, "id">> }) => {
      await updateDoc(doc(db, "products", id), updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "products", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}