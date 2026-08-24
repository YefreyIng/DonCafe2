import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export interface StoreProduct {
  id: number;
  name: string;
  description: string | null;
  category: string;
  price: number;
  stock: number;
  weight: string;
  image_url: string | null;
  active: boolean;
}

export function useProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      const now = Date.now();
      if (now - lastFetch < 30000) return;
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("id,name,description,category,price,stock,weight,image_url,active")
        .eq("active", true)
        .order("created_at", { ascending: false });
      if (!cancelled) {
        if (fetchError) setError("No fue posible cargar los productos. Intenta nuevamente.");
        else setProducts(data ?? []);
        setLoading(false);
        setLastFetch(now);
      }
    }
    void loadProducts();
    return () => { cancelled = true; };
  }, [lastFetch]);

  return { products, loading, error, refetch: () => setLastFetch(0) };
}
