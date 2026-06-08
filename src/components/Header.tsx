import { Home, Phone, User, ShoppingCart, Search } from 'lucide-react';

interface HeaderProps {
  onHomeClick: () => void;
  onContactClick: () => void;
  onUserClick: () => void;
  onCartClick: () => void;
  onSearchClick: () => void;
  onCategoryClick: (category: string) => void;
  cartCount: number;
  headerColor: string;
}

export function Header({
  onHomeClick,
  onContactClick,
  onUserClick,
  onCartClick,
  onSearchClick,
  onCategoryClick,
  cartCount,
  headerColor,
}: HeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{ backgroundColor: headerColor }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/logo.jpg"
              alt="Whimsy Whiskers"
              className="h-24 w-24 rounded-full object-cover cursor-pointer"
              onClick={onHomeClick}
            />
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
            <button
              onClick={onHomeClick}
              className="text-[#5f5a57] hover:text-[#2f2b29] transition-colors flex items-center gap-1"
            >
              <Home size={18} />
              Home
            </button>

            <button
              onClick={() => onCategoryClick('diy')}
              className="text-[#5f5a57] hover:text-[#2f2b29] transition-colors"
            >
              DIY
            </button>
            <button
              onClick={() => onCategoryClick('dog-products')}
              className="text-[#5f5a57] hover:text-[#2f2b29] transition-colors"
            >
              Dogs
            </button>
            <button
              onClick={() => onCategoryClick('cat-products')}
              className="text-[#5f5a57] hover:text-[#2f2b29] transition-colors"
            >
              Cats
            </button>
            <button
              onClick={() => onCategoryClick('other-animals')}
              className="text-[#5f5a57] hover:text-[#2f2b29] transition-colors"
            >
              Other Animals
            </button>
            <button
              onClick={() => onCategoryClick('new-collection')}
              className="text-[#5f5a57] hover:text-[#2f2b29] transition-colors"
            >
              New Collection
            </button>
            <button
              onClick={() => onCategoryClick('about')}
              className="text-[#5f5a57] hover:text-[#2f2b29] transition-colors"
            >
              About Us
            </button>
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={onContactClick}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#efe5dd')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Phone className="w-5 h-5 text-[#5f5a57]" />
            </button>

            <button
              onClick={onUserClick}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#efe5dd')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User className="w-5 h-5 text-[#5f5a57]" />
            </button>

            <button
              onClick={onCartClick}
              className="p-2 rounded-full transition-colors relative"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#efe5dd')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ShoppingCart className="w-5 h-5 text-[#5f5a57]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#b96b2c] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={onSearchClick}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#efe5dd')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Search className="w-5 h-5 text-[#5f5a57]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
