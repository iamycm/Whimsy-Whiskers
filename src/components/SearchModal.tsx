import { X, Search } from 'lucide-react';
import { useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const popularSearches = ['WALK', 'ACCESSORIES', 'GROOM', 'TOYS', 'SALE'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white w-full max-w-4xl mx-4 rounded-lg shadow-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-light">Search</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
              autoFocus
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">POPULAR SEARCHES</h3>
              <div className="space-y-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    className="block text-left w-full py-2 hover:text-rose-400 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">POPULAR PRODUCTS</h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Start typing to see product suggestions
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
