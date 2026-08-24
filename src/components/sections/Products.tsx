import { ShoppingCart } from "lucide-react";
import productImage from "../../assets/images/doncafeVenta.jpg";
import { useCart } from "../../context/CartContext";

const products = [
	{
		name: "Origen Caquetá",
		price: "$45.000",
		profile: "Tueste medio · 454g (1 LB)",
		priceValue: 45000,
	},
	{
		name: "Reserva Amazónica",
		price: "$52.000",
		profile: "Tueste oscuro · 454g (1 LB)",
		priceValue: 52000,
	},
	{
		name: "Edición Especial",
		price: "$65.000",
		profile: "Proceso honey · 454g (1 LB)",
		priceValue: 65000,
	},
];

export default function Products() {
	const { addItem } = useCart();

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

				<div className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-3 xl:gap-10">
					{products.map((product) => (
						<article
							key={product.name}
							className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-[#3A3026] bg-[#1E1B18] shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.38)]"
						>
							<div className="bg-[#24211d]" style={{ aspectRatio: "4 / 3", padding: "1rem" }}>
								<img
									src={productImage}
									alt={`Café ${product.name}`}
									loading="lazy"
									className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
								/>
							</div>
							<div className="flex flex-1 flex-col gap-5 p-6">
								<div className="flex items-start justify-between gap-3">
									<h3 className="font-serif text-xl leading-tight text-white">
										{product.name}
									</h3>
									<strong className="whitespace-nowrap text-xl font-bold text-[#C89A3C]">
										{product.price}
									</strong>
								</div>
								<p className="text-sm text-[var(--text-secondary)]">
									{product.profile}
								</p>
								<button
									onClick={() => addItem({ id: product.name, name: product.name, profile: product.profile, price: product.priceValue, image: productImage })}
									className="mt-auto inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md border border-[#5a4933] bg-transparent px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:shadow-[0_8px_20px_rgba(92,138,61,0.24)]"
								>
									<ShoppingCart size={15} />
									Agregar al carrito
								</button>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
