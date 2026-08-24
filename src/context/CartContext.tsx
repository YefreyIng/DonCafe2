import { createContext, useContext, useMemo, useState } from "react";

export interface CartProduct {
	id: string;
	name: string;
	profile: string;
	price: number;
	image: string;
}

interface CartItem extends CartProduct {
	quantity: number;
}

interface CartContextValue {
	items: CartItem[];
	isOpen: boolean;
	itemCount: number;
	subtotal: number;
	addItem: (product: CartProduct) => void;
	increaseItem: (id: string) => void;
	decreaseItem: (id: string) => void;
	removeItem: (id: string) => void;
	clearCart: () => void;
	openCart: () => void;
	closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	const value = useMemo<CartContextValue>(() => {
		const itemCount = items.reduce((total, item) => total + item.quantity, 0);
		const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

		return {
			items,
			isOpen,
			itemCount,
			subtotal,
			addItem: (product) => {
				setItems((currentItems) => {
					const existingItem = currentItems.find((item) => item.id === product.id);
					if (existingItem) {
						return currentItems.map((item) =>
							item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
						);
					}
					return [...currentItems, { ...product, quantity: 1 }];
				});
				setIsOpen(true);
			},
			increaseItem: (id) =>
				setItems((currentItems) =>
					currentItems.map((item) =>
						item.id === id ? { ...item, quantity: item.quantity + 1 } : item
					)
				),
			decreaseItem: (id) =>
				setItems((currentItems) =>
					currentItems.flatMap((item) =>
						item.id === id
							? item.quantity > 1
								? [{ ...item, quantity: item.quantity - 1 }]
								: []
							: [item]
					)
				),
			removeItem: (id) => setItems((currentItems) => currentItems.filter((item) => item.id !== id)),
			clearCart: () => setItems([]),
			openCart: () => setIsOpen(true),
			closeCart: () => setIsOpen(false),
		};
	}, [isOpen, items]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart debe utilizarse dentro de CartProvider");
	}
	return context;
}

export function formatCurrency(value: number) {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(value);
}
