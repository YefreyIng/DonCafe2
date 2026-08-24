import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen overflow-x-hidden bg-[var(--background)] text-white">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
