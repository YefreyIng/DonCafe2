import { Camera, Share2 } from "lucide-react";

const footerLinks = [
	{ label: "Sostenibilidad", href: "#historia" },
	{ label: "Términos", href: "#" },
	{ label: "Privacidad", href: "#" },
	{ label: "Contacto", href: "#" },
];

export default function Footer() {
	return (
		<footer className="border-t border-white/10 bg-[#0d0e0c] px-4 py-12 text-white sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-12">
			<div className="mx-auto grid w-full max-w-[90rem] gap-10 md:grid-cols-[1.5fr_1fr_1fr] lg:gap-16">
				<div className="max-w-sm">
					<h2 className="font-serif text-2xl text-[#d8c29a] sm:text-3xl">DONCAFÉ</h2>
					<p className="mt-4 text-sm leading-6 text-[#d2d2d2]">
						Elevando el estándar del café amazónico. Un ritual diario, cultivado con
						paciencia en el pulmón del mundo.
					</p>
					<p className="mt-7 text-xs text-[#d2d2d2]">
					
					</p>
				</div>

				<nav aria-label="Navegación del footer">
					<h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">
						Navegación
					</h3>
					<ul className="mt-5 space-y-4">
						{footerLinks.map((link) => (
							<li key={link.label}>
								<a
									href={link.href}
									className="text-sm text-[#d2d2d2] transition-colors hover:text-[#C89A3C]"
								>
									{link.label}
								</a>
							</li>
						))}
					</ul>
				</nav>

				<div>
					<h3 className="text-[10px] font-bold uppercase tracking-[0.08em] text-white">
						Síguenos
					</h3>
					<div className="mt-5 flex gap-3">
						<a
							href="#"
							aria-label="Instagram"
							className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#d2d2d2] transition-colors hover:border-[#C89A3C] hover:text-[#C89A3C]"
						>
							<Camera size={16} />
						</a>
						<a
							href="#"
							aria-label="Compartir"
							className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#d2d2d2] transition-colors hover:border-[#C89A3C] hover:text-[#C89A3C]"
						>
							<Share2 size={16} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
