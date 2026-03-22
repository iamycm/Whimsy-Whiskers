import { Home, Phone, User, ShoppingCart, Search } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
  onContactClick: () => void;
  onUserClick: () => void;
  onCartClick: () => void;
  onSearchClick: () => void;
  cartCount: number;
  headerColor: string;
}

export function Header({
  onHomeClick,
  onContactClick,
  onUserClick,
  onCartClick,
  onSearchClick,
  cartCount,
  headerColor,
}: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ backgroundColor: headerColor }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Whimsy Whiskers"
              className="h-24 w-24 rounded-full"
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={onHomeClick}
              className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <Home size={18} />
              Home
            </button>

            <a href="#diy" className="text-gray-700 hover:text-gray-900 transition-colors">DIY</a>
            <a href="#dogs" className="text-gray-700 hover:text-gray-900 transition-colors">Dogs</a>
            <a href="#cats" className="text-gray-700 hover:text-gray-900 transition-colors">Cats</a>
            <a href="#other-animals" className="text-gray-700 hover:text-gray-900 transition-colors">Other Animals</a>
            <a href="#new-collection" className="text-gray-700 hover:text-gray-900 transition-colors">New Collection</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About Us</a>
          </nav>

          <div className="flex items-center space-x-4">

            <button
              onClick={onContactClick}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Phone className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={onUserClick}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <User className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={onCartClick}
              className="p-2 rounded-full transition-colors relative"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={onSearchClick}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Search className="w-5 h-5 text-gray-700" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}