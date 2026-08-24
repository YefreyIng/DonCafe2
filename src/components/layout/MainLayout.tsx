import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import { CartProvider } from "../../context/CartContext";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <CartProvider>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden bg-[var(--background)] text-white">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  );
}
