import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import axios from "axios";
import type { Product } from "../types";

export async function seedProducts(): Promise<void> {
  const existing = await getDocs(collection(db, "products"));
  if (!existing.empty) return;

  const response = await axios.get<(Product & { id: number })[]>(
    "https://fakestoreapi.com/products"
  );

  for (const product of response.data) {
    const { id: _ignored, ...productData } = product;
    await addDoc(collection(db, "products"), productData);
  }
}