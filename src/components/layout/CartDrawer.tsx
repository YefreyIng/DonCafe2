import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { formatCurrency, useCart } from "../../context/CartContext";

export default function CartDrawer() {
	const {
		items,
		isOpen,
		itemCount,
		subtotal,
		closeCart,
		increaseItem,
		decreaseItem,
		removeItem,
	} = useCart();

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeCart();
		};
		document.addEventListener("keydown", handleKeyDown);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [closeCart, isOpen]);

	return (
		<div className={`pointer-events-none fixed inset-0 z-[60] ${isOpen ? "visible" : "invisible"}`}>
			<button
				aria-label="Cerrar carrito"
				className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
				onClick={closeCart}
			/>
			<aside
				aria-label="Mi carrito"
				aria-hidden={!isOpen}
				className={`pointer-events-auto absolute right-0 top-0 flex h-full w-full max-w-[30rem] flex-col bg-[#0F0F0F] text-white shadow-[-16px_0_50px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out sm:w-[min(40vw,30rem)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
			>
				<header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
					<div className="flex items-baseline gap-2">
						<h2 className="font-serif text-2xl text-white">Mi carrito</h2>
						<span className="text-xs text-[#a7a7a7]">({itemCount} artículos)</span>
					</div>
					<button aria-label="Cerrar carrito" className="rounded-full p-1 text-[#a7a7a7] transition-colors hover:bg-white/10 hover:text-white" onClick={closeCart}>
						<X size={20} />
					</button>
				</header>

				{items.length === 0 ? (
					<div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1A1A1A] text-[#C89A3C]">
							<ShoppingBag size={32} strokeWidth={1.4} />
						</div>
						<h3 className="mt-6 font-serif text-2xl">Tu carrito está vacío</h3>
						<p className="mt-3 max-w-xs text-sm leading-6 text-[#bcbcbc]">Explora nuestros cafés especiales y encuentra el sabor perfecto para tu próxima taza.</p>
						<button onClick={() => { closeCart(); document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" }); }} className="mt-7 rounded-full border border-[#5C8A3D] px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#5C8A3D]">Ver productos</button>
					</div>
				) : (
					<div className="flex min-h-0 flex-1 flex-col">
						<div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
							{items.map((item) => (
								<article key={item.id} className="relative grid grid-cols-[5rem_1fr] gap-4 rounded-2xl border border-white/5 bg-[#1A1A1A] p-3">
									<img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl bg-[#24211d] object-contain" />
									<div className="min-w-0">
										<div className="flex items-start justify-between gap-2">
											<div>
												<h3 className="font-serif text-base text-white">{item.name}</h3>
												<p className="mt-1 text-xs text-[#bcbcbc]">{item.profile}</p>
											</div>
											<button aria-label={`Eliminar ${item.name}`} onClick={() => removeItem(item.id)} className="text-[#8f8f8f] transition-colors hover:text-[#C89A3C]"><Trash2 size={15} /></button>
										</div>
										<div className="mt-4 flex items-center justify-between gap-2">
											<div className="flex items-center rounded-full border border-white/10 bg-[#151515]">
												<button aria-label={`Disminuir ${item.name}`} onClick={() => decreaseItem(item.id)} className="p-2 text-[#bcbcbc] hover:text-white"><Minus size={13} /></button>
												<span className="min-w-6 text-center text-xs">{item.quantity}</span>
												<button aria-label={`Aumentar ${item.name}`} onClick={() => increaseItem(item.id)} className="p-2 text-[#bcbcbc] hover:text-white"><Plus size={13} /></button>
											</div>
											<strong className="text-sm text-[#C89A3C]">{formatCurrency(item.price * item.quantity)}</strong>
										</div>
									</div>
								</article>
							))}
						</div>
						<div className="border-t border-white/10 bg-[#0F0F0F] px-5 pb-5 pt-4 sm:px-7 sm:pb-7">
							<div className="space-y-3 text-xs text-[#bcbcbc]">
								<div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
								<div className="flex justify-between"><span>Envío</span><span>Se calculará al finalizar</span></div>
							</div>
							<div className="my-4 border-t border-white/10" />
							<div className="flex items-center justify-between"><span className="font-serif text-lg">Total</span><strong className="text-lg text-[#C89A3C]">{formatCurrency(subtotal)}</strong></div>
							<button className="mt-5 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#5C8A3D] text-xs font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#6d9e49]">Finalizar compra <span className="ml-2">-&gt;</span></button>
							<button onClick={closeCart} className="mt-2 flex min-h-10 w-full items-center justify-center rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-[0.08em] text-[#d2d2d2] transition-colors hover:border-white/30 hover:text-white">Seguir comprando</button>
							<p className="mt-3 text-center text-[9px] text-[#777]">Impuestos incluidos. Envío gratuito en pedidos sobre $150.000.</p>
						</div>
					</div>
				)}
			</aside>
		</div>
	);
}
