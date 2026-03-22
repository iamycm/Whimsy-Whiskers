import { X, Phone, Mail } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light">Contact Us</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-pink-50 rounded-full">
              <Mail className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Email</h3>
              <a
                href="mailto:chuanmiaoyuu@gmail.com"
                className="text-gray-600 hover:text-rose-400 transition-colors"
              >
                chuanmiaoyuu@gmail.com
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-pink-50 rounded-full">
              <Phone className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Phone</h3>
              <p className="text-gray-600">Available Mon-Fri, 9am-5pm</p>
            </div>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-gray-600">
              You can also reach us through the contact form at the bottom of the page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
