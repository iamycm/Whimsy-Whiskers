import { Facebook, Instagram, CreditCard, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ email, message }]);

      if (error) throw error;

      setSubmitted(true);
      setEmail('');
      setMessage('');

      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-light mb-6">Get in Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Your message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {submitted && (
                <p className="text-green-600 text-sm">Message sent successfully!</p>
              )}
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-light mb-6">Connect With Us</h3>
            <div className="flex space-x-4 mb-8">
              <a
                href="#facebook"
                className="p-3 bg-white rounded-full hover:bg-pink-50 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 text-gray-700" />
              </a>
              <a
                href="#instagram"
                className="p-3 bg-white rounded-full hover:bg-pink-50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-gray-700" />
              </a>
            </div>

            <h4 className="text-lg font-medium mb-4">Payment Methods</h4>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm font-medium">Apple Pay</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
                <CreditCard className="w-5 h-5" />
                <span className="text-sm font-medium">Credit Card</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 Whimsy Whiskers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
