import { MessageSquare } from "lucide-react";
import Button from "../ui/Button";
import coffeeBag from "../../assets/images/doncafe.png";

export default function Hero() {
	return (
		<section
			id="inicio"
			className="relative flex min-h-[clamp(40rem,100svh,64rem)] items-center overflow-hidden bg-[var(--background)] px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8 xl:px-10 2xl:px-12"
		>
			<img
				src={coffeeBag}
				alt="Café DONCAFÉ"
				className="absolute inset-0 h-full w-full object-cover object-center"
			/>
			<div className="absolute inset-0 bg-black/60" />
			<div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/80" />

			<div className="relative z-10 mx-auto w-full max-w-[90rem] text-center">
				<h1 className="mx-auto max-w-5xl font-serif text-[clamp(2.25rem,5vw,5.5rem)] font-bold leading-[1.08] text-white drop-shadow-lg">
					El sabor auténtico de la
					<span className="block">Amazonía Colombiana.</span>
				</h1>
				<p className="mx-auto mb-8 mt-6 w-full max-w-2xl text-[clamp(0.95rem,1.4vw,1.2rem)] leading-7 text-gray-200">
					Desde las entrañas del Caquetá, un café artesanal de alta gama
					cultivado con respeto por la tierra.
				</p>
				<Button
					onClick={() => {
						document.getElementById("productos")?.scrollIntoView({ behavior: "smooth" });
					}}
				>
					Comprar ahora
				</Button>
			</div>

			<button
				aria-label="Abrir chat"
				className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-lime-300 text-black shadow-[0_0_24px_rgba(190,242,100,0.4)] transition-transform hover:scale-105"
			>
				<MessageSquare size={21} />
			</button>
		</section>
	);
}
