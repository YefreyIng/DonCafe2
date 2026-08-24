import { AlertCircle, ChevronDown, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart, formatCurrency } from "../../context/CartContext";
import { useProducts, type StoreProduct } from "../../hooks/useProducts";

export default function Products() {
  const { products, loading, error } = useProducts();
  const { addItem } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("recent");

  const categories = useMemo(() => {
    const cats = new Set(products.map((p: StoreProduct) => p.category));
    return Array.from(cats).sort() as string[];
  }, [products]);

  const filtered = useMemo(() => {
    let result = products;
    if (search) result = result.filter((p: StoreProduct) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== "all") result = result.filter((p: StoreProduct) => p.category === category);
    if (sort === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, search, category, sort]);

  return (
    <section
      id="productos"
      className="relative z-10 border-t border-white/5 px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-28 xl:px-10 2xl:px-12"
      style={{
        background: "linear-gradient(180deg, #171512 0%, #0f0e0c 100%)",
        scrollMarginTop: "5rem",
      }}
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="mb-12 text-center sm:mb-16">
          <h2
            className="font-serif text-[var(--gold)]"
            style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)", lineHeight: 1.15 }}
          >
            Nuestra Selección Premium
          </h2>
          <div className="mx-auto mt-6 h-px w-12 bg-[#C89A3C]" />
        </div>

        {error && (
          <div className="mx-auto mb-8 max-w-2xl rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-200 flex items-center justify-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {!error && (
          <div className="mb-8 grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#c9bbb0] mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-[#594333] bg-[#2a1c15] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#C89A3C]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#c9bbb0] mb-2">
                Categoría
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#594333] bg-[#2a1c15] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#C89A3C]"
                >
                  <option value="all">Todas</option>
                  {categories.map((cat: string) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9bbb0]" size={16} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#c9bbb0] mb-2">
                Ordenar
              </label>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#594333] bg-[#2a1c15] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#C89A3C]"
                >
                  <option value="recent">Más recientes</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[#c9bbb0]" size={16} />
              </div>
            </div>
            <div className="text-xs text-[#8f8f8f] h-10 flex items-end">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {loading && (
          <div className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-3 xl:gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-[#3A3026] bg-[#1E1B18] overflow-hidden">
                <div className="h-64 bg-[#24211d]" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-[#3A3026] rounded w-3/4" />
                  <div className="h-3 bg-[#3A3026] rounded" />
                  <div className="h-10 bg-[#3A3026] rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="mx-auto max-w-md rounded-xl border border-[#594333] bg-[#2a1c15] p-12 text-center">
            <div className="text-4xl mb-4">☕</div>
            <h3 className="font-serif text-xl mb-2">Aún no hay productos disponibles</h3>
            <p className="text-sm text-[#c9bbb0]">
              {search || category !== "all" ? "No encontramos productos que coincidan con tu búsqueda." : "Vuelve pronto para nuestra colección de cafés especiales."}
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-3 xl:gap-10">
            {filtered.map((product: StoreProduct) => (
              <ProductCard key={product.id} product={product} onAdd={addItem} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, onAdd }: { product: StoreProduct; onAdd: (item: any) => void }) {
  const outOfStock = product.stock <= 0;
  const handleAdd = () => {
    if (!outOfStock) {
      onAdd({
        id: String(product.id),
        name: product.name,
        profile: `${product.category} · ${product.weight}`,
        price: product.price,
        image: product.image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%2324211d' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%238f8f8f' text-anchor='middle' dy='.3em'%3E☕%3C/text%3E%3C/svg%3E",
      });
    }
  };

  return (
    <article
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-[#3A3026] bg-[#1E1B18] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.38)]"
    >
      {outOfStock && (
        <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
          <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Agotado</span>
        </div>
      )}
      <div className="bg-[#24211d] relative" style={{ aspectRatio: "4 / 3", padding: "1rem" }}>
        <img
          src={product.image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%2324211d' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%238f8f8f' text-anchor='middle' dy='.3em'%3E☕%3C/text%3E%3C/svg%3E"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-serif text-xl leading-tight text-white truncate">{product.name}</h3>
            <p className="mt-1 text-xs text-[#8f8f8f]">{product.category}</p>
          </div>
          <strong className="whitespace-nowrap text-xl font-bold text-[#C89A3C]">
            {formatCurrency(product.price)}
          </strong>
        </div>
        {product.description && <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{product.description}</p>}
        <div className="flex items-center gap-4 text-xs text-[#c9bbb0]">
          <span>{product.weight}</span>
          <span className={outOfStock ? "text-red-400" : "text-[#5C8A3D]"}>
            Stock: {product.stock}
          </span>
        </div>
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#5a4933] bg-transparent px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:shadow-[0_8px_20px_rgba(92,138,61,0.24)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#5a4933] disabled:hover:bg-transparent disabled:hover:shadow-none"
        >
          <ShoppingCart size={15} />
          {outOfStock ? "No disponible" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}
