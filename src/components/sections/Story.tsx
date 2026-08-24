import { ArrowRight } from "lucide-react";

const plantationImage =
	"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85";

export default function Story() {
	return (
		<section
			id="historia"
			className="relative z-10 px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-32 xl:px-10 2xl:px-12"
			style={{ backgroundColor: "var(--background)", scrollMarginTop: "5rem" }}
		>
			<div className="mx-auto grid w-full max-w-[90rem] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
				<div className="relative">
					<div className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl bg-[var(--card)]" />
					<img
						src={plantationImage}
						alt="Paisaje montañoso de una región cafetera"
						loading="lazy"
						className="relative aspect-[4/5] h-auto w-full max-w-2xl rounded-xl object-cover"
					/>
				</div>

				<div className="w-full max-w-2xl">
					<p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
						Nuestra historia
					</p>
					<h2
						className="font-serif leading-tight text-white"
						style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
					>
						Un legado en El Doncello, Caquetá
					</h2>
					<div className="my-6 h-px w-10 bg-[var(--gold)]" />
					<div className="space-y-5 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
						<p>
							Nacido en el corazón de la Amazonía Colombiana, DONCAFÉ es más que
							una bebida; es un tributo a la resiliencia de nuestra tierra y
							nuestra gente. Cultivado bajo la sombra de árboles nativos en El
							Doncello, cada grano absorbe la riqueza mineral y la humedad prístina
							de la selva.
						</p>
						<p>
							Nuestra cosecha es estrictamente manual, seleccionando solo las
							cerezas en su punto exacto de maduración. Este proceso artesanal no
							solo garantiza una taza de calidad excepcional, sino que preserva el
							frágil ecosistema amazónico para las generaciones futuras.
						</p>
					</div>
					<a
						href="#"
						className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--gold)] transition-colors hover:text-white"
					>
						Descubre el origen
						<ArrowRight size={16} />
					</a>
				</div>
			</div>
		</section>
	);
}
