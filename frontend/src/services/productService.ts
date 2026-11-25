import { queryOptions } from "@tanstack/react-query";
import { api, isBackendConfigured } from "./api";
import { DEV_PRODUCTS } from "@/data/devProducts";
import type { Product } from "@/lib/types";

/** GET /products (contract). Falls back to isolated dev data when no backend is configured. */
export async function getProducts(): Promise<Product[]> {
  if (!isBackendConfigured) return DEV_PRODUCTS;
  const { data } = await api.get<Product[]>("/products");
  return data;
}

/** INTEGRATION PLACEHOLDER: no product-detail endpoint in the contract yet; reads from the list. */
export async function getProduct(id: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.id === id);
}

/** POST /products (contract). Request body shape to be confirmed with backend. */
export async function createListing(payload: FormData): Promise<{ ok: true; devOnly: boolean }> {
  if (!isBackendConfigured) {
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, devOnly: true };
  }
  await api.post("/products", payload);
  return { ok: true, devOnly: false };
}

export const productsQuery = () => queryOptions({ queryKey: ["products"], queryFn: getProducts });
export const productQuery = (id: string) =>
  queryOptions({ queryKey: ["products", id], queryFn: () => getProduct(id) });
