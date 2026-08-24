import { ShoppingCart, Menu, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const { itemCount, openCart } = useCart();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 40);
		};

		window.addEventListener("scroll", handleScroll);

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (!menuOpen) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setMenuOpen(false);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [menuOpen]);

	return (
		<header
			className={clsx(
				"fixed top-0 left-0 z-50 w-full transition-all duration-300",
				scrolled
					? "bg-black/80 backdrop-blur-md shadow-lg"
					: "bg-transparent"
			)}
		>
			<div
				className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
			>
				<h1 className="font-serif text-lg font-bold tracking-wide text-white sm:text-2xl">
					DON<span className="text-white">CAFÉ</span>
				</h1>

				<nav className="hidden items-center gap-6 text-[11px] font-semibold tracking-wide text-white/75 lg:flex 2xl:gap-9">
					<a href="#inicio">Inicio</a>
					<a href="#historia">Historia</a>
					<a href="#productos">Productos</a>
				</nav>

				<div className="hidden items-center gap-4 lg:flex">
					<Link
						to="/admin"
						aria-label="Abrir acceso de administración"
						className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-[#C89A3C]"
					>
						<ShieldCheck size={15} />
						Admin
					</Link>
					<button aria-label="Abrir carrito" onClick={openCart} className="relative text-white transition-colors hover:text-[#C89A3C]">
						<ShoppingCart />
						{itemCount > 0 && <span key={itemCount} className="absolute -right-2 -top-2 flex h-4 min-w-4 animate-bounce items-center justify-center rounded-full bg-[#C89A3C] px-1 text-[9px] font-bold text-black">{itemCount}</span>}
					</button>
				</div>

				<button
					type="button"
					aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen((open) => !open)}
					className="lg:hidden text-white transition-colors hover:text-[#C89A3C]"
				>
					<Menu />
				</button>
			</div>

			{menuOpen && (
				<div className="border-t border-white/10 bg-[#171512]/95 px-4 pb-5 pt-3 backdrop-blur-md lg:hidden">
					<nav className="mx-auto grid w-full max-w-[90rem] gap-1 text-sm text-white">
						{[
							["#inicio", "Inicio"],
							["#historia", "Historia"],
							["#productos", "Productos"],
						].map(([href, label]) => (
							<a key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-white/10 hover:text-[#C89A3C]">
								{label}
							</a>
						))}
						<Link to="/admin" onClick={() => setMenuOpen(false)} className="rounded-md px-3 py-3 transition-colors hover:bg-white/10 hover:text-[#C89A3C]">
							Administración
						</Link>
						<button type="button" onClick={() => { setMenuOpen(false); openCart(); }} className="flex items-center gap-2 rounded-md px-3 py-3 text-left transition-colors hover:bg-white/10 hover:text-[#C89A3C]">
							<ShoppingCart size={17} />
							Carrito {itemCount > 0 && `(${itemCount})`}
						</button>
					</nav>
				</div>
			)}
		</header>
	);
}
