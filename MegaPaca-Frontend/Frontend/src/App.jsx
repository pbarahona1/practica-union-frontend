import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import CartOrderMegaPaca from "./pages/CartController";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/ProductController";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Product />} />
        <Route path="/carrito" element={<CartOrderMegaPaca />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
