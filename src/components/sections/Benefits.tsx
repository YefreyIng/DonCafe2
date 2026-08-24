import { Coffee, Heart, Mountain, Sprout, Truck } from "lucide-react";

const benefits = [
	{ label: "100% amazónico", icon: Sprout },
	{ label: "Café especial", icon: Coffee },
	{ label: "Cosecha manual", icon: Heart },
	{ label: "Origen Caquetá", icon: Mountain },
	{ label: "Envíos nacionales", icon: Truck },
];

export default function Benefits() {
	return (
		<section
			id="beneficios"
			className="border-t border-white/5 bg-[#111210] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8 xl:px-10 2xl:px-12"
		>
			<div className="mx-auto grid w-full max-w-[90rem] grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-5 lg:gap-8">
				{benefits.map(({ label, icon: Icon }) => (
					<div key={label} className="flex flex-col items-center text-center">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#292a27] text-[#C89A3C]">
							<Icon size={25} strokeWidth={1.8} />
						</div>
						<p className="mt-4 text-[10px] font-bold uppercase tracking-[0.08em] text-white sm:text-[11px]">
							{label}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
