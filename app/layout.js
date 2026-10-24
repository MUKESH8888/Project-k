import './globals.css';
import { AuthProvider } from '../components/AuthContext';
import { CartProvider } from '../components/CartContext';
import ConsultationModal from '../components/ConsultationModal';
import AuthModal from '../components/AuthModal';

export const metadata = {
  title: 'Kalyanam Shopping Mall | కళ్యాణం షాపింగ్ మాల్ — Royal Heritage Couture',
  description: 'Authentic pure silk Kanchipuram, Banarasi, Gadwal, and Pochampally sarees handwoven for life’s most sacred Telugu matrimony celebrations. 100% Silk Mark Certified.',
  keywords: 'Kalyanam Shopping Mall, Kanchipuram Pattu, Telugu Wedding Sarees, Banarasi Silk, Gadwal Handloom, Pochampally Ikat, Bridal Sarees Hyderabad',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        <AuthProvider>
          <CartProvider>
            {children}
            <ConsultationModal />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
