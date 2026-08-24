import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Admin from "../pages/Admin";
import Checkout from "../pages/Checkout";
import Confirmation from "../pages/Confirmation";
import { CartProvider } from "../context/CartContext";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<Confirmation />} />
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
