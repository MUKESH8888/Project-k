import "./globals.css";
import { AuthProvider } from "../components/AuthContext";
import { CartProvider } from "../components/CartContext";
import AuthModal from "../components/AuthModal";
import ConsultationModal from "../components/ConsultationModal";
export const metadata = {
  title: "Kalyanam | The Art of Celebration",
  description:
    "Discover sarees, wedding wear and festive collections for the whole family at Kalyanam Shopping Mall.",
};
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AuthProvider>
          <CartProvider>
            {children}
            <AuthModal />
            <ConsultationModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
