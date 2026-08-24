import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

export default function Button({ children, className = "", ...props }: Props) {
	return (
		<button
			{...props}
			className={`inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-10 py-3.5 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_8px_22px_rgba(92,138,61,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_28px_rgba(92,138,61,0.36)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-0 active:scale-[0.98] ${className}`}
		>
			{children}
		</button>
	);
}
