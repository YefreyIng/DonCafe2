import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Banknote, Check, ChevronRight, Copy, CreditCard, LoaderCircle, MapPin, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { formatCurrency, useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

const checkoutSchema = z.object({
  name: z.string().min(3, "Escribe tu nombre completo"),
  phone: z.string().min(7, "Escribe un teléfono válido"),
  email: z.string().email("Revisa el correo").optional().or(z.literal("")),
  address: z.string().min(5, "Escribe la dirección de entrega"),
  city: z.string().min(2, "Escribe la ciudad"),
  notes: z.string().optional(),
  payment: z.enum(["nequi", "cash"]),
});
type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [step, setStep] = useState<"form" | "nequi">("form");
  const [order, setOrder] = useState<{ id: string; total: number; payment: CheckoutForm["payment"] } | null>(null);
  const [error, setError] = useState("");
  const [copyLabel, setCopyLabel] = useState("Copiar número");
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema), defaultValues: { payment: "nequi" } });
  const payment = watch("payment");

  if (items.length === 0 && !order) return <EmptyCheckout onBack={() => navigate("/")} />;

  async function submit(values: CheckoutForm) {
    setError("");
    const status = values.payment === "nequi" ? "Pendiente de verificación de pago" : "Pendiente";
    const { data: created, error: insertError } = await supabase.rpc("create_order", {
      order_data: {
        nombre_cliente: values.name, telefono: values.phone, correo: values.email || null, direccion: values.address,
        ciudad: values.city, notas: values.notes || null, metodo_pago: values.payment === "nequi" ? "Nequi" : "Efectivo contra entrega",
        estado: status, subtotal, costo_envio: 0, total: subtotal,
      },
      order_items: items.map((item) => ({ producto_id: item.id, cantidad: item.quantity, precio_unitario: item.price, subtotal: item.price * item.quantity })),
    });
    if (insertError || !created) { setError("No pudimos registrar el pedido. Verifica la conexión con Supabase e inténtalo de nuevo."); return; }
    const orderId = String(created);
    if (values.payment === "nequi" && receipt) {
      const path = `${orderId}/${Date.now()}-${receipt.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const { error: uploadError } = await supabase.storage.from("payment-receipts").upload(path, receipt);
      if (!uploadError) await supabase.from("orders").update({ comprobante_pago: path }).eq("id", orderId);
    }
    setOrder({ id: orderId, total: subtotal, payment: values.payment });
    clearCart();
    if (values.payment === "nequi") setStep("nequi");
    else navigate("/order-confirmation", { state: { orderId, total: subtotal, payment: values.payment, status } });
  }

  async function copyNequi() { await navigator.clipboard.writeText("300 123 4567"); setCopyLabel("Número copiado"); window.setTimeout(() => setCopyLabel("Copiar número"), 2000); }
  function finishNequi() { if (order) navigate("/order-confirmation", { state: { orderId: order.id, total: order.total, payment: order.payment, status: "Pendiente de verificación de pago" } }); }

  return <main className="min-h-screen bg-[#f8f3ee] text-[#2b211b]"><header className="flex h-16 items-center justify-between border-b border-[#eadfd5] bg-[#fffdfa] px-5 sm:px-10"><button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs text-[#887d74]"><ArrowLeft size={16} /> Volver</button><strong className="font-serif text-xl tracking-wide">DON<span className="text-[#b8892d]">CAFÉ</span></strong><span className="text-[10px] uppercase tracking-widest text-[#887d74]">Compra segura</span></header>{step === "nequi" ? <NequiPayment total={order?.total ?? subtotal} receipt={receipt} setReceipt={setReceipt} onCopy={copyNequi} copyLabel={copyLabel} onFinish={finishNequi} /> : <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_360px] lg:px-10"><form onSubmit={handleSubmit(submit)} className="rounded-xl border border-[#eadfd5] bg-[#fffdfa] p-6 shadow-sm sm:p-9"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9b6b3b]">Paso 1 de 1</p><h1 className="mt-2 font-serif text-3xl">Finaliza tu pedido</h1><p className="mt-2 text-sm text-[#887d74]">Cuéntanos dónde llevar tu café.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><Field label="Nombre completo" error={errors.name?.message}><input {...register("name")} placeholder="Juan Pérez" /></Field><Field label="Teléfono" error={errors.phone?.message}><input {...register("phone")} placeholder="300 000 0000" /></Field><Field label="Correo electrónico (opcional)" error={errors.email?.message}><input type="email" {...register("email")} placeholder="tu@correo.com" /></Field><Field label="Ciudad o municipio" error={errors.city?.message}><input {...register("city")} placeholder="Bogotá" /></Field><div className="sm:col-span-2"><Field label="Dirección de entrega" error={errors.address?.message}><input {...register("address")} placeholder="Calle 123 # 45-67, Apto 402" /></Field></div><div className="sm:col-span-2"><Field label="Notas adicionales (opcional)"><textarea {...register("notes")} rows={3} placeholder="Indicaciones para encontrar tu dirección..." /></Field></div></div><div className="mt-9 border-t border-[#eadfd5] pt-7"><h2 className="flex items-center gap-2 font-serif text-xl"><CreditCard size={18} className="text-[#b8892d]" /> Método de pago</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><PaymentOption value="nequi" active={payment === "nequi"} register={register} icon={<CreditCard size={19} />} title="Nequi" text="Transfiere desde tu celular" /><PaymentOption value="cash" active={payment === "cash"} register={register} icon={<Banknote size={19} />} title="Efectivo contra entrega" text="Paga cuando recibas" /></div></div>{error && <p className="mt-5 rounded-lg bg-[#f9e8e4] p-3 text-xs text-[#a34f43]">{error}</p>}<button disabled={isSubmitting} className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#416d2b] text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#31521f] disabled:opacity-60">{isSubmitting ? <LoaderCircle className="animate-spin" size={16} /> : <Check size={16} />} Confirmar pedido <ChevronRight size={15} /></button></form><aside className="h-fit rounded-xl border border-[#eadfd5] bg-[#fffdfa] p-6 shadow-sm"><h2 className="font-serif text-xl">Resumen del pedido</h2><div className="mt-5 space-y-4">{items.map((item) => <div className="flex gap-3" key={item.id}><div className="grid h-12 w-12 place-items-center rounded-lg bg-[#eadfce] text-[#88643d]"><CoffeeIcon /></div><div className="min-w-0 flex-1"><strong className="block text-xs">{item.name}</strong><span className="text-[10px] text-[#887d74]">Cantidad: {item.quantity}</span></div><b className="text-xs">{formatCurrency(item.price * item.quantity)}</b></div>)}</div><div className="mt-6 border-t border-[#eadfd5] pt-4 text-xs"><div className="flex justify-between text-[#887d74]"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div><div className="mt-2 flex justify-between text-[#887d74]"><span>Envío</span><span className="text-[#416d2b]">Gratis</span></div><div className="mt-4 flex justify-between border-t border-[#eadfd5] pt-4 text-base"><strong>Total</strong><strong className="text-[#b8892d]">{formatCurrency(subtotal)}</strong></div></div></aside></div>}</main>;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block text-[10px] font-bold text-[#655950]">{label}<div className="mt-2 [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#ded2c7] [&_input]:bg-white [&_input]:p-3 [&_input]:text-xs [&_input]:font-normal [&_input]:outline-[#416d2b] [&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-[#ded2c7] [&_textarea]:bg-white [&_textarea]:p-3 [&_textarea]:text-xs [&_textarea]:font-normal [&_textarea]:outline-[#416d2b]">{children}</div>{error && <span className="mt-1 block font-normal text-[#b34d43]">{error}</span>}</label>; }
function PaymentOption({ value, active, register, icon, title, text }: { value: "nequi" | "cash"; active: boolean; register: ReturnType<typeof useForm<CheckoutForm>>["register"]; icon: React.ReactNode; title: string; text: string }) { return <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${active ? "border-[#416d2b] bg-[#f2f8ee]" : "border-[#eadfd5] bg-white"}`}><input type="radio" value={value} {...register("payment")} className="mt-1 accent-[#416d2b]" /><span className="text-[#416d2b]">{icon}</span><span><strong className="block text-xs">{title}</strong><small className="mt-1 block text-[10px] font-normal text-[#887d74]">{text}</small></span></label>; }
function NequiPayment({ total, receipt, setReceipt, onCopy, copyLabel, onFinish }: { total: number; receipt: File | null; setReceipt: (file: File | null) => void; onCopy: () => void; copyLabel: string; onFinish: () => void }) { return <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-3xl items-center justify-center px-5 py-10"><section className="w-full overflow-hidden rounded-2xl border border-[#eadfd5] bg-[#fffdfa] shadow-xl sm:grid sm:grid-cols-[.8fr_1.2fr]"><div className="flex flex-col justify-between bg-[#322218] p-7 text-white sm:p-9"><div><p className="text-[10px] font-bold uppercase tracking-widest text-[#d4a55d]">Pago seleccionado</p><h1 className="mt-3 font-serif text-3xl">Paga con Nequi</h1><div className="mt-10 grid aspect-square max-w-[190px] place-items-center rounded-xl bg-white text-[#322218]"><div className="grid h-28 w-28 place-items-center border-4 border-dashed border-[#d9d0c7] text-center text-[10px] text-[#887d74]">Código QR<br />(opcional)</div></div></div><div className="mt-8"><span className="text-[10px] uppercase tracking-widest text-[#c6b4a6]">Total a pagar</span><strong className="mt-1 block font-serif text-3xl text-[#d4a55d]">{formatCurrency(total)}</strong></div></div><div className="p-7 sm:p-9"><h2 className="font-serif text-xl">Instrucciones</h2><ol className="mt-5 space-y-4 text-xs text-[#655950]"><li className="flex gap-3"><b className="grid h-6 w-6 place-items-center rounded-full bg-[#e8f0e1] text-[#416d2b]">1</b><span>Abre tu app Nequi y escanea el código QR o envía el dinero.</span></li><li className="flex gap-3"><b className="grid h-6 w-6 place-items-center rounded-full bg-[#e8f0e1] text-[#416d2b]">2</b><span>Número: <strong className="text-[#2b211b]">300 123 4567</strong><button type="button" onClick={onCopy} className="ml-2 inline-flex items-center gap-1 text-[#416d2b]"><Copy size={12} /> {copyLabel}</button><br />Titular: <strong className="text-[#2b211b]">DONCAFÉ SAS</strong></span></li><li className="flex gap-3"><b className="grid h-6 w-6 place-items-center rounded-full bg-[#e8f0e1] text-[#416d2b]">3</b><label className="flex cursor-pointer items-center gap-2 text-[#416d2b]"><Upload size={15} /> {receipt ? receipt.name : "Adjuntar comprobante (opcional)"}<input type="file" accept="image/*" className="hidden" onChange={(event) => setReceipt(event.target.files?.[0] ?? null)} /></label></li></ol><p className="mt-7 rounded-lg bg-[#f7f0ea] p-3 text-[10px] leading-5 text-[#806b5c]">Tu pedido quedará pendiente de verificación. Lo confirmaremos cuando revisemos el pago.</p><button onClick={onFinish} className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#416d2b] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#31521f]">He realizado el pago <Check size={15} /></button></div></section></div>; }
function EmptyCheckout({ onBack }: { onBack: () => void }) { return <main className="grid min-h-screen place-items-center bg-[#f8f3ee] p-6 text-center text-[#2b211b]"><div><MapPin className="mx-auto text-[#b8892d]" size={32} /><h1 className="mt-4 font-serif text-3xl">Tu carrito está vacío</h1><button onClick={onBack} className="mt-6 rounded-lg bg-[#416d2b] px-5 py-3 text-xs font-bold text-white">Volver a la tienda</button></div></main>; }
function CoffeeIcon() { return <span className="text-lg">☕</span>; }
