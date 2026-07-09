/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedCategories from "./components/FeaturedCategories";
import BestSellers from "./components/BestSellers";
import FeaturesSection from "./components/FeaturesSection";
import AIAssistantSection from "./components/AIAssistantSection";
import Footer from "./components/Footer";
import QuickViewModal from "./components/QuickViewModal";
import FloatingChatbot from "./components/FloatingChatbot";
import ChatbotModal from "./components/ChatbotModal";
import ChatbotPage from "./components/ChatbotPage";
import ContactPage from "./components/ContactPage";
import AboutPage from "./components/AboutPage";
import PolicyPages from "./components/PolicyPages";
import MenPage from "./components/MenPage";
import SupplementsPage from "./components/SupplementsPage";
import AccessoriesPage from "./components/AccessoriesPage";
import WomenPage from "./components/WomenPage";
import NewArrivalsPage from "./components/NewArrivalsPage";
import BestSellersPage from "./components/BestSellersPage";

import { useLanguage } from "./context/LanguageContext";
import { CartItem, Product } from "./types";
import { useProducts } from "./context/ProductContext";
import { AnimatePresence, motion } from "motion/react";

export default function App() {
  const { products: PRODUCTS } = useProducts();

  const { language, t } = useLanguage();

  // LocalStorage-backed shopping cart initialization
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("henry_fit_cart");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Cart hydration error, resetting.", e);
      return [];
    }
  });

  const [memberSession, setMemberSession] = useState<{name: string, email: string} | null>(() => {
    const saved = localStorage.getItem('hf_member_session');
    return saved ? JSON.parse(saved) : null;
  });

  const handleMemberLogin = (name: string, email: string) => {
    const session = { name, email };
    setMemberSession(session);
    localStorage.setItem('hf_member_session', JSON.stringify(session));
  };

  const handleMemberLogout = () => {
    setMemberSession(null);
    localStorage.removeItem('hf_member_session');
    handleNavigate('/');
  };

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Dynamic Toast alerts state
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Floating Chatbot window open/close state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      if (e.detail?.prompt) {
        setInitialChatPrompt(e.detail.prompt);
      }
      setIsChatOpen(true);
    };
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    // Clear toast automatically after 3 seconds
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  };

  // Persist cart items changes
  useEffect(() => {
    localStorage.setItem("henry_fit_cart", JSON.stringify(cart));
  }, [cart]);

  // Synchronize dynamic history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleNavigate = (path: string) => {
    if (path.startsWith("/admin")) {
      window.location.href = path;
      return;
    }
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add Item to cart payload
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.product.id === item.product.id && ci.size === item.size
      );
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });

    const mappedName =
      t.products[item.product.id as keyof typeof t.products]?.name ||
      item.product.name;

    showToast(
      language === "vi"
        ? `ĐÃ NẠP THÊM ${mappedName.toUpperCase()} VÀO GIỎ THIẾT BỊ`
        : `LOADED ${mappedName.toUpperCase()} TO ACTIVE PAYLOAD`
    );
  };

  // Update Cart Quantity from direct Navbar list controls
  const handleUpdateCartQty = (productId: string, size: string, change: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId && item.size === size) {
          const nextQty = item.quantity + change;
          return {
            ...item,
            quantity: Math.max(1, nextQty),
          };
        }
        return item;
      });
    });
  };

  // Remove Item from cart
  const handleRemoveFromCart = (productId: string, size: string) => {
    const itemToRemove = cart.find((ci) => ci.product.id === productId && ci.size === size);
    if (!itemToRemove) return;

    setCart((prev) =>
      prev.filter((ci) => !(ci.product.id === productId && ci.size === size))
    );

    const localizedName =
      t.products[productId as keyof typeof t.products]?.name ||
      itemToRemove.product.name;

    showToast(
      language === "vi"
        ? `ĐÃ DỠ BỎ ${localizedName.toUpperCase()} KHỎI GIỎ HÀNG`
        : `DE-ALLOCATED ${localizedName.toUpperCase()}`
    );
  };

  // Reset/Clear Cart payload empty
  const handleClearCart = () => {
    setCart([]);
    showToast(
      language === "vi"
        ? "ĐÃ TRIỆT TIÊU TOÀN BỘ GIỎ THIẾT BI"
        : "DEPLENTISHED CORE VEHICLE INTEGRITY PAYLOAD"
    );
  };

  // Scroll to advice section
  const handleAdviceTrigger = () => {
    // If not on homepage, return to homepage first
    if (currentPath !== "/") {
      handleNavigate("/");
      setTimeout(() => {
        const adviceNode = document.getElementById("advice");
        if (adviceNode) {
          adviceNode.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 350);
    } else {
      const adviceNode = document.getElementById("advice");
      if (adviceNode) {
        adviceNode.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Quick View details trigger
  const handleOpenQuickView = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleNavbarDirectAddToCart = (product: Product, size: string) => {
    handleAddToCart({
      product,
      size,
      quantity: 1,
    });
  };

  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId);

  // Dynamic Content Router matching requested documents & pages
  const renderViewContent = () => {
    switch (currentPath) {
      case "/best-sellers":
        return <BestSellersPage onOpenQuickView={handleOpenQuickView} onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
      case "/new-arrivals":
        return <NewArrivalsPage onOpenQuickView={handleOpenQuickView} onAddToCart={handleAddToCart} />;
      case "/men":
        return <MenPage onOpenQuickView={handleOpenQuickView} onAddToCart={handleAddToCart} />;
      case "/supplements":
        return <SupplementsPage onOpenQuickView={handleOpenQuickView} onAddToCart={handleAddToCart} />;
      case "/accessories":
        return <AccessoriesPage onOpenQuickView={handleOpenQuickView} onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
      case "/women":
        return <WomenPage onOpenQuickView={handleOpenQuickView} onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
      case "/about":
        return <AboutPage onNavigate={handleNavigate} />;
      case "/contact":
        return <ContactPage onNavigate={handleNavigate} onShowToast={showToast} />;
      case "/shipping-policy":
        return <PolicyPages pageType="shipping" onNavigate={handleNavigate} />;
      case "/privacy-policy":
        return <PolicyPages pageType="privacy" onNavigate={handleNavigate} />;
      case "/terms-of-service":
        return <PolicyPages pageType="terms" onNavigate={handleNavigate} />;
      default:
        return (
          <main>
            {/* Core Hero Showcase */}
            <HeroSection onOpenAdvice={handleAdviceTrigger} onNavigate={handleNavigate} />

            {/* Categories Bento Grid */}
            <FeaturedCategories onNavigate={handleNavigate} />

            {/* Product Cards Gallery Shelf */}
            <BestSellers onOpenQuickView={handleOpenQuickView} />

            {/* Quality Features Block */}
            <FeaturesSection />

            {/* AI Performance Assistant Console */}
            <AIAssistantSection onOpenQuickView={handleOpenQuickView} />
          </main>
        );
    }
  };

  return (
    <div className="relative min-h-screen theme-bg-primary theme-text-primary antialiased selection:bg-[#0066ff] selection:text-white flex flex-col justify-between transition-colors">
      {/* Global Wrapper Layout */}
      <div className="w-full">
        {currentPath === "/chatbot" ? (
          /* Immersive Custom Chatbot Route Page */
          <ChatbotPage onBack={() => handleNavigate("/")} />
        ) : (
          /* Standard Layout Pages with Navbar, Main Content and Footer */
          <>
            <Navbar
              cart={cart}
              onRemoveFromCart={handleRemoveFromCart}
              onUpdateCartQty={handleUpdateCartQty}
              onClearCart={handleClearCart}
              onOpenAdvice={handleAdviceTrigger}
              onOpenQuickView={handleOpenQuickView}
              onNavigate={handleNavigate}
              currentPath={currentPath}
              onAddToCart={handleNavbarDirectAddToCart}
              memberSession={memberSession}
              onMemberLogout={handleMemberLogout}
            />

            {renderViewContent()}

            {/* Common styled footer */}
            <Footer onNavigate={handleNavigate} onShowToast={showToast} />
          </>
        )}
      </div>

      {/* Global Floating Round Logo Chatbot Hook */}
      <FloatingChatbot onClick={() => setIsChatOpen((prev) => !prev)} isOpen={isChatOpen} />

      {/* Reusable ChatbotModal fixed bottom-right with smooth exit transitions */}
      <AnimatePresence>
        {isChatOpen && (
          <ChatbotModal 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
            initialMessage={initialChatPrompt}
            onInitialMessageSent={() => setInitialChatPrompt(null)}
          />
        )}
      </AnimatePresence>

      {/* Quick View Details Overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProductId(null)}
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* High contrast styled dynamic Toast banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-6 z-50 p-4 border flex items-center gap-3 shadow-2xl uppercase font-mono text-[10px] tracking-widest ${
              toast.isError
                ? "bg-[#250d0d] text-[#ffb4ab] border-[#ff3b30]/30"
                : "theme-bg-primary text-[#8ed5b6] border-[#0066ff]/40"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${toast.isError ? "bg-[#ff3b30]" : "bg-[#0066ff] animate-ping"}`}
            />
            <span className="font-bold">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-4 font-bold text-white/50 hover:text-white hover:bg-[#1e1010]/50 px-1 py-0.5"
            >
              [X]
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
