import {
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Coffee,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Tags,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "../lib/supabase";
import "../styles/admin.css";

type Section = "dashboard" | "products" | "categories" | "orders" | "customers" | "settings";
type OrderStatus = "Pendiente" | "Pendiente de verificación de pago" | "Pago confirmado" | "Preparando pedido" | "En camino" | "Entregado" | "Cancelado";
type Product = { id: number; name: string; category: string; price: number; stock: number; weight: string; active: boolean; image_url?: string };
type Order = { id: string; customer: string; phone: string; email: string | null; city: string; total: number; date: string; createdAt: string; status: OrderStatus };

const money = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
const formatDate = (value: string) => new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

function Login({ onLogin }: { onLogin: (email: string, password: string) => Promise<string | null> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError(null);
    const message = await onLogin(email, password);
    if (message) setError(message);
    setLoading(false);
  }

  return <main className="admin-login"><div className="login-art"><div className="login-mark"><Coffee size={22} /> DONCAFÉ</div><div><span>Gestión con intención.</span><h1>Tu café, bajo control.</h1><p>Un espacio claro para cuidar cada pedido, producto y cliente.</p></div><div className="login-foot">COFFEE ADMIN · 2026</div></div><form className="login-form" onSubmit={submit}><div className="login-heading"><div className="admin-logo"><Coffee size={19} /></div><p className="eyebrow">Área privada</p><h2>Bienvenido de vuelta</h2><p>Inicia sesión para entrar al panel de administración.</p></div><label>Correo electrónico<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@doncafe.com" /></label><label>Contraseña<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /></label>{error && <div className="form-error">{error}</div>}<button className="primary-button full-button" disabled={loading}>{loading ? "Verificando..." : "Entrar al panel"}<ChevronRight size={16} /></button><small>Solo administradores autorizados</small></form></main>;
}

function StatCard({ icon: Icon, label, value, detail, tone = "green" }: { icon: typeof Boxes; label: string; value: string; detail: string; tone?: string }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={18} /></div><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>;
}

function Admin() {
  const [session, setSession] = useState<{ email?: string } | null | undefined>(undefined);
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");
  const [query, setQuery] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    async function loadData() {
      setDataLoading(true); setDataError("");
      const [{ data: orderRows, error: ordersError }, { data: productRows, error: productsError }] = await Promise.all([
        supabase.from("orders").select("id,nombre_cliente,telefono,correo,ciudad,total,estado,created_at").order("created_at", { ascending: false }),
        supabase.from("products").select("id,name,category,price,stock,weight,active,image_url").order("created_at", { ascending: false }),
      ]);
      if (cancelled) return;
      if (ordersError && productsError) setDataError("No se pudieron cargar los datos del panel. Revisa las tablas y las políticas RLS en Supabase.");
      if (!ordersError) {
        const loadedOrders = (orderRows ?? []).map((row) => ({ id: `#ORD-${row.id}`, customer: row.nombre_cliente, phone: row.telefono, email: row.correo, city: row.ciudad, total: Number(row.total), date: formatDate(row.created_at), createdAt: row.created_at, status: row.estado as OrderStatus }));
        setOrders(loadedOrders); setSelectedOrder(loadedOrders[0] ?? null);
      }
      if (!productsError) setProducts((productRows ?? []).map((row) => ({ id: Number(row.id), name: row.name, category: row.category, price: Number(row.price), stock: Number(row.stock), weight: row.weight, active: row.active })));
      if (!productsError) setProducts((productRows ?? []).map((row) => ({ id: Number(row.id), name: row.name, category: row.category, price: Number(row.price), stock: Number(row.stock), weight: row.weight, active: row.active, image_url: row.image_url })));
      setDataLoading(false);
    }
    void loadData();
    return () => { cancelled = true; };
  }, [session]);

  async function login(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error?.message ?? null;
  }

  async function logout() { await supabase.auth.signOut(); }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
    setSelectedOrder((current) => current?.id === orderId ? { ...current, status } : current);
    const { error } = await supabase.from("orders").update({ estado: status, updated_at: new Date().toISOString() }).eq("id", orderId.replace("#ORD-", ""));
    setToast(error ? "Estado actualizado localmente" : "Estado guardado en Supabase");
    window.setTimeout(() => setToast(""), 2500);
  }

  async function createProduct(product: Omit<Product, "id">) {
    let imageUrl = product.image_url;
    if (product.image_url && product.image_url.startsWith("data:")) {
      const file = await (await fetch(product.image_url)).blob();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, { contentType: "image/jpeg" });
      if (uploadError) { setToast("No se pudo subir la imagen"); setShowProductForm(false); window.setTimeout(() => setToast(""), 2500); return; }
      const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(uploadData.path);
      imageUrl = publicData.publicUrl;
    }
    const { data, error } = await supabase.from("products").insert({ name: product.name, category: product.category, price: product.price, stock: product.stock, weight: product.weight, active: product.active, image_url: imageUrl }).select("id").single();
    if (error || !data) { setToast("No se pudo guardar el producto en Supabase"); } else { setProducts((current) => [...current, { ...product, id: Number(data.id), image_url: imageUrl }]); setToast("Producto guardado en Supabase"); }
    setShowProductForm(false); window.setTimeout(() => setToast(""), 2500);
  }

  if (session === undefined) return <div className="admin-loading"><Coffee size={26} /> Cargando panel...</div>;
  if (!session) return <Login onLogin={login} />;

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  const nav = [
    ["dashboard", "Dashboard", LayoutDashboard], ["products", "Productos", Boxes], ["categories", "Categorías", Tags],
    ["orders", "Pedidos", ClipboardList], ["customers", "Clientes", Users], ["settings", "Configuración", Settings],
  ] as const;
  const title = nav.find(([key]) => key === section)?.[1] ?? "Dashboard";

  return <div className="admin-shell"><aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}><div className="brand"><div className="brand-icon"><Coffee size={18} /></div><div><strong>DONCAFÉ</strong><span>COFFEE ADMIN</span></div><button className="close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú"><X size={19} /></button></div><button className="new-order" onClick={() => { setSection("orders"); setSidebarOpen(false); }}><Plus size={16} /> Nuevo pedido</button><nav>{nav.map(([key, label, Icon]) => <button key={key} className={section === key ? "active" : ""} onClick={() => { setSection(key); setSidebarOpen(false); }}><Icon size={17} /> {label}</button>)}</nav><div className="sidebar-bottom"><div className="store-status"><span className="status-dot" /> Tienda online <strong>Activa</strong></div><button onClick={logout}><LogOut size={16} /> Cerrar sesión</button></div></aside><div className="admin-main"><header className="admin-topbar"><button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menú"><Menu size={21} /></button><div className="breadcrumb"><Store size={16} /><span>DonCafé</span><ChevronRight size={14} /><strong>{title}</strong></div><div className="top-actions"><label className="global-search"><Search size={15} /><input placeholder="Buscar..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="icon-button" aria-label="Notificaciones"><Bell size={18} /><i /></button><div className="profile"><div className="avatar">{(session.email?.[0] ?? "A").toUpperCase()}</div><span>Admin</span><ChevronDown size={14} /></div></div></header><main className="admin-content"><div className="content-heading"><div><p className="eyebrow">Resumen de actividad</p><h1>{title}</h1><p>Una vista tranquila de lo que está pasando en tu tienda.</p></div>{section === "products" && <button className="primary-button" onClick={() => setShowProductForm(true)}><PackagePlus size={16} /> Agregar producto</button>}</div>{dataError && <div className="form-error">{dataError}</div>}{dataLoading ? <div className="admin-loading"><Coffee size={26} /> Cargando datos reales...</div> : <>{section === "dashboard" && <Dashboard products={products} orders={orders} />}{section === "products" && <ProductsView products={filteredProducts} setProducts={setProducts} onAdd={() => setShowProductForm(true)} />}{section === "categories" && <Categories products={products} />}{section === "orders" && <OrdersView orders={orders} selectedOrder={selectedOrder} onSelect={setSelectedOrder} onStatusChange={updateOrderStatus} />}{section === "customers" && <Customers orders={orders} />}{section === "settings" && <SettingsView />}</>}</main></div>{showProductForm && <ProductModal onClose={() => setShowProductForm(false)} onSave={createProduct} />}{toast && <div className="admin-toast">{toast}</div>}</div>;
}

function Dashboard({ products, orders }: { products: Product[]; orders: Order[] }) {
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const today = new Date().toDateString();
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today).length;
  const pending = orders.filter((order) => order.status === "Pendiente" || order.status === "Pendiente de verificación de pago").length;
  const chartData = orders.slice(0, 8).reverse().map((order) => ({ day: order.date.slice(0, 6), sales: order.total }));
  return <><section className="stats-grid"><StatCard icon={BarChart3} label="Ventas registradas" value={money(totalSales)} detail="Total de pedidos cargados" /><StatCard icon={ClipboardList} label="Pedidos del día" value={String(todayOrders)} detail="Según created_at" tone="gold" /><StatCard icon={ShoppingBag} label="Pedidos pendientes" value={String(pending)} detail="Requieren atención" tone="orange" /><StatCard icon={Boxes} label="Productos registrados" value={String(products.length)} detail="Desde Supabase" tone="blue" /></section><section className="dashboard-grid"><article className="panel sales-panel"><div className="panel-heading"><div><h3>Ventas registradas</h3><p>Pedidos más recientes cargados desde Supabase</p></div><span className="eyebrow">Datos reales</span></div><div className="chart-wrap">{chartData.length > 0 ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData}><defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5b7f45" stopOpacity={0.25} /><stop offset="100%" stopColor="#5b7f45" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8c8c85" }} /><YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8c8c85" }} tickFormatter={(value) => `${value / 1000}k`} /><Tooltip formatter={(value) => money(Number(value))} contentStyle={{ borderRadius: 10, border: "1px solid #e6e0d8", fontSize: 12 }} /><Area type="monotone" dataKey="sales" stroke="#476f32" strokeWidth={2.5} fill="url(#salesFill)" /></AreaChart></ResponsiveContainer> : <div className="admin-loading">Aún no hay ventas registradas.</div>}</div></article><article className="panel top-products"><div className="panel-heading"><div><h3>Productos más vendidos</h3><p>Disponible cuando existan detalles de pedido</p></div></div><div className="admin-loading">Sin datos suficientes.</div></article></section><section className="panel recent-orders"><div className="panel-heading"><div><h3>Últimos pedidos</h3><p>Las órdenes más recientes de tu tienda</p></div><button className="text-button">Ver pedidos <ChevronRight size={14} /></button></div>{orders.length > 0 ? <OrderTable orders={orders.slice(0, 3)} compact /> : <div className="admin-loading">Aún no hay pedidos registrados.</div>}</section></>;
}

function ProductsView({ products, setProducts, onAdd }: { products: Product[]; setProducts: (products: Product[]) => void; onAdd: () => void }) {
  async function toggleProduct(product: Product) { const nextActive = !product.active; const { error } = await supabase.from("products").update({ active: nextActive, updated_at: new Date().toISOString() }).eq("id", product.id); if (!error) setProducts(products.map((item) => item.id === product.id ? { ...item, active: nextActive } : item)); }
  async function deleteProduct(product: Product) { const { error } = await supabase.from("products").delete().eq("id", product.id); if (!error) setProducts(products.filter((item) => item.id !== product.id)); }
  return <section className="panel table-panel"><div className="filter-row"><label className="table-search"><Search size={15} /><input placeholder="Buscar productos..." /></label><button className="filter-button">Todas las categorías <ChevronDown size={14} /></button><button className="filter-button">Estado <ChevronDown size={14} /></button></div><div className="table-scroll"><table><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="table-product"><div className="product-thumb"><Coffee size={17} /></div><div><strong>{product.name}</strong><span>{product.weight}</span></div></div></td><td><span className="category-pill">{product.category}</span></td><td><strong>{money(product.price)}</strong></td><td><span className={product.stock < 10 ? "stock low" : "stock"}><i /> {product.stock}</span></td><td><button className={`status-pill ${product.active ? "active" : "inactive"}`} onClick={() => void toggleProduct(product)}>{product.active ? "Activo" : "Inactivo"}</button></td><td><div className="row-actions"><button aria-label="Editar producto"><Settings size={15} /></button><button aria-label="Eliminar producto" onClick={() => void deleteProduct(product)}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>{products.length === 0 && <div className="admin-loading">No hay productos registrados en Supabase.</div>}<div className="table-footer"><span>Mostrando {products.length} productos</span><button onClick={onAdd}><Plus size={14} /> Agregar producto</button></div></section>;
}

function Categories({ products }: { products: Product[] }) { const categories = Array.from(new Set(products.map((product) => product.category))); return <section className="category-grid">{categories.map((category) => <article className="category-card" key={category}><div className="category-symbol"><FolderKanban size={18} /></div><div><h3>{category}</h3><p>{products.filter((product) => product.category === category).length} productos</p></div><button aria-label={`Editar ${category}`}><Settings size={15} /></button></article>)}{categories.length === 0 && <div className="admin-loading">No hay categorías en los productos registrados.</div>}<button className="category-card add-category"><Plus size={20} /><span>Crear categoría</span></button></section>; }

function OrdersView({ orders, selectedOrder, onSelect, onStatusChange }: { orders: Order[]; selectedOrder: Order | null; onSelect: (order: Order) => void; onStatusChange: (id: string, status: OrderStatus) => void }) { return <section className="orders-layout"><article className="panel table-panel"><div className="filter-row order-filters"><button className="filter-tab active">Todos</button>{["Pendiente", "Pendiente de verificación de pago", "Pago confirmado", "Preparando pedido", "En camino"].map((status) => <button className="filter-tab" key={status}>{status}</button>)}</div><div className="table-scroll"><OrderTable orders={orders} onSelect={onSelect} /></div></article>{selectedOrder && <OrderDetail order={selectedOrder} onStatusChange={onStatusChange} />}</section>; }

function OrderTable({ orders, onSelect, compact = false }: { orders: Order[]; onSelect?: (order: Order) => void; compact?: boolean }) { return <table><thead><tr><th>Pedido</th><th>Cliente</th><th>Ciudad</th><th>Fecha</th><th>Total</th><th>Estado</th>{!compact && <th />}</tr></thead><tbody>{orders.map((order) => <tr key={order.id} onClick={() => onSelect?.(order)} className={onSelect ? "clickable-row" : ""}><td><strong className="order-number">{order.id}</strong></td><td><strong>{order.customer}</strong></td><td>{order.city}</td><td>{order.date}</td><td><strong>{money(order.total)}</strong></td><td><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></td>{!compact && <td><ChevronRight size={15} /></td>}</tr>)}</tbody></table>; }

function OrderDetail({ order, onStatusChange }: { order: Order; onStatusChange: (id: string, status: OrderStatus) => void }) { const statuses: OrderStatus[] = ["Pendiente", "Pendiente de verificación de pago", "Pago confirmado", "Preparando pedido", "En camino", "Entregado", "Cancelado"]; return <article className="panel order-detail"><div className="detail-heading"><div><p className="eyebrow">Detalle del pedido</p><h2>{order.id}</h2><span>{order.date} · {order.customer}</span></div><span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span></div><label className="detail-label">Actualizar estado<select value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><div className="detail-section"><small>CLIENTE</small><strong>{order.customer}</strong><span>{order.customer.toLowerCase().replace(" ", ".")}@example.com</span><p>📍 Calle 123 # 45-67<br />{order.city}, Colombia</p></div><div className="detail-section"><small>ARTÍCULOS (2)</small><div className="detail-item"><div className="product-thumb"><Coffee size={15} /></div><span>Café Origen Colombia<br /><small>454 g · Cant. 2</small></span><b>{money(order.total * 0.82)}</b></div><div className="detail-item"><div className="product-thumb"><Coffee size={15} /></div><span>Taza DonCafé<br /><small>Crema · Cant. 1</small></span><b>{money(order.total * 0.18)}</b></div></div><div className="detail-total"><span>Subtotal</span><b>{money(order.total)}</b><span>Envío</span><b className="green-text">Gratis</b><strong>Total</strong><strong>{money(order.total)}</strong></div><button className="outline-button">Ver recibo</button></article>; }

function Customers({ orders }: { orders: Order[] }) { const customers = Array.from(new Map(orders.map((order) => [order.phone, order])).values()).map((order) => { const customerOrders = orders.filter((item) => item.phone === order.phone); return { ...order, count: customerOrders.length, spent: customerOrders.reduce((sum, item) => sum + item.total, 0) }; }); return <section className="panel table-panel"><div className="filter-row"><label className="table-search"><Search size={15} /><input placeholder="Buscar por nombre o teléfono..." /></label></div><div className="table-scroll"><table><thead><tr><th>Cliente</th><th>Teléfono</th><th>Ciudad</th><th>Pedidos</th><th>Total gastado</th><th>Última compra</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer.phone}><td><div className="customer-cell"><div className="avatar">{customer.customer.split(" ").map((part) => part[0]).join("")}</div><strong>{customer.customer}</strong></div></td><td>{customer.phone}</td><td>{customer.city}</td><td>{customer.count}</td><td><strong>{money(customer.spent)}</strong></td><td>{customer.date}</td></tr>)}</tbody></table></div>{customers.length === 0 && <div className="admin-loading">Aún no hay clientes registrados.</div>}</section>; }

function SettingsView() { const fields = ["Nombre de la tienda", "Número de WhatsApp", "Correo de contacto", "Dirección", "Instagram", "Horario de atención"]; return <section className="settings-layout"><article className="panel settings-panel"><div className="panel-heading"><div><h3>Información de la tienda</h3><p>Estos datos aparecen en tu tienda pública.</p></div><button className="primary-button">Guardar cambios</button></div><div className="settings-fields">{fields.map((field, index) => <label key={field}>{field}<input defaultValue={["DonCafé", "+57 310 555 0182", "hola@doncafe.com", "Bogotá, Colombia", "@doncafe", "Lun - Sáb · 8:00 - 18:00"][index]} /></label>)}</div></article><article className="panel upload-panel"><div className="logo-preview"><Coffee size={32} /></div><h3>Imagen de marca</h3><p>Sube tu logo y banner principal a Supabase Storage.</p><button className="outline-button">Seleccionar imagen</button></article></section>; }

function ProductModal({ onClose, onSave }: { onClose: () => void; onSave: (product: Omit<Product, "id">) => void }) { const [form, setForm] = useState({ name: "", category: "Café en grano", price: 0, stock: 0, weight: "250 g", active: true, image_url: "" }); const [imagePreview, setImagePreview] = useState<string | null>(null); const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (e) => { const result = e.target?.result as string; setImagePreview(result); setForm({ ...form, image_url: result }); }; reader.readAsDataURL(file); } }; return <div className="modal-backdrop" onMouseDown={onClose}><form className="product-modal" onSubmit={(event) => { event.preventDefault(); onSave(form); }} onMouseDown={(event) => event.stopPropagation()}><div className="modal-heading"><div><p className="eyebrow">Inventario</p><h2>Nuevo producto</h2></div><button type="button" onClick={onClose} aria-label="Cerrar"><X size={18} /></button></div><label>Imagen del producto{imagePreview && <div style={{ marginTop: "0.5rem", width: "100%", maxWidth: "150px", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid #ddd" }}><img src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto", objectFit: "cover" }} /></div>}<input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "0.5rem" }} /></label><label>Nombre<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Café Sierra Nevada" /></label><div className="form-grid"><label>Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Café en grano</option><option>Café molido</option><option>Accesorios</option></select></label><label>Peso<select value={form.weight} onChange={(event) => setForm({ ...form, weight: event.target.value })}><option>250 g</option><option>454 g</option><option>1 kg</option></select></label><label>Precio<input required type="number" min="0" value={form.price || ""} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} /></label><label>Stock<input required type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} /></label></div><label>Descripción<textarea placeholder="Cuenta qué hace especial a este café..." rows={3} /></label><div className="modal-actions"><button type="button" className="outline-button" onClick={onClose}>Cancelar</button><button className="primary-button">Crear producto</button></div></form></div>; }

export default Admin;
