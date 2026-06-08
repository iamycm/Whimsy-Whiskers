import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { CartModal } from './components/CartModal';
import { UserModal } from './components/UserModal';
import { AuthModal } from './components/AuthModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { ProductListPage } from './pages/ProductListPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import { CartItem, Product } from './types';

function App() {
  const { user } = useAuth();

  const [showSearch, setShowSearch] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'product-detail' | 'checkout'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [checkoutData, setCheckoutData] = useState<{
    total: number;
    items: any[];
  } | null>(null);

  // Detect password reset link from email
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setShowResetPassword(true);
    }

    // Also listen for Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowResetPassword(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  const loadCartCount = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', currentUser.id);

      if (error) throw error;

      const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(total);
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const handleCategoryClick = (category: string) => {
    window.scrollTo(0, 0);
    setSelectedCategory(category);
    setCurrentPage('products');
  };

  const handleProductClick = (productId: string) => {
    window.scrollTo(0, 0);
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
  };

  const handleBackToHome = () => {
    window.scrollTo(0, 0);  // 加这行
    setCurrentPage('home');
  };

  const handleBackToProducts = () => {
    window.scrollTo(0, 0);  // 加这行
    setCurrentPage('products');
  };

  const handleCheckout = (total: number, items: any[]) => {
    setCheckoutData({ total, items });
    setCurrentPage('checkout');
    setShowCart(false);
  };
  const handleOrderComplete = () => {
    setCartCount(0);
  };

  const headerColor =
    currentPage === 'home'
      ? 'rgba(242, 227, 232, 0.55)'
      : 'rgba(244, 235, 228, 0.60)';
  return (
    <div className="min-h-screen">
      <Header
        onHomeClick={handleBackToHome}
        onContactClick={() => setShowContact(true)}
        onUserClick={() => setShowUser(true)}
        onCartClick={() => setShowCart(true)}
        onSearchClick={() => setShowSearch(true)}
        onCategoryClick={handleCategoryClick}
        cartCount={cartCount}
        headerColor={headerColor}
      />

      {currentPage === 'home' && (
        <>
          <Hero onCategoryClick={handleCategoryClick} />
          <Footer />
        </>
      )}

      {currentPage === 'products' && (
        <ProductListPage
          category={selectedCategory}
          onProductClick={handleProductClick}
          onBackClick={handleBackToHome}
        />
      )}

      {currentPage === 'product-detail' && selectedProductId && (
        <ProductDetailPage
          productId={selectedProductId}
          onBackClick={handleBackToProducts}
          onCartUpdate={loadCartCount}
        />
      )}

      {currentPage === 'checkout' && checkoutData && (
        <CheckoutPage
          total={checkoutData.total}
          items={checkoutData.items}
          onBackClick={handleBackToHome}
          onOrderComplete={handleOrderComplete}
        />
      )}

      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCartUpdate={loadCartCount}
        onCheckout={handleCheckout}
      />
      <UserModal
        isOpen={showUser}
        onClose={() => setShowUser(false)}
        onShowAuth={() => setShowAuth(true)}
      />
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
      />
    </div>
  );
}

export default App;
