import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { CartModal } from './components/CartModal';
import { UserModal } from './components/UserModal';
import { AuthModal } from './components/AuthModal';
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

  const [cartCount, setCartCount] = useState(0);

  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'product-detail' | 'checkout'>('home');

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [checkoutData, setCheckoutData] = useState<{
    total: number;
    items: (CartItem & { product: Product })[];
  } | null>(null);

  useEffect(() => {
    if (user) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [user]);

  const loadCartCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(total);

    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('products');
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleBackToProducts = () => {
    setCurrentPage('products');
  };

  const handleCheckout = (total: number, items: (CartItem & { product: Product })[]) => {
    setCheckoutData({ total, items });
    setCurrentPage('checkout');
    setShowCart(false);
  };

  /* Header颜色逻辑 */

  const headerColor =
    currentPage === 'home'
      ? '#FCECF4'
      : '#FDF9F2';

  return (
    <div className="min-h-screen">

      <Header
        onHomeClick={handleBackToHome}
        onContactClick={() => setShowContact(true)}
        onUserClick={() => setShowUser(true)}
        onCartClick={() => setShowCart(true)}
        onSearchClick={() => setShowSearch(true)}
        cartCount={cartCount}
        headerColor={headerColor}
      />

      {currentPage === 'home' && (
        <>
          <Hero />
          <CategorySection onCategoryClick={handleCategoryClick} />
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

    </div>
  );
}

export default App;