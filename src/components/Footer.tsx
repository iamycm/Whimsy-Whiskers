import { useState, FormEvent } from 'react';
import { Facebook, Instagram, Smartphone, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      setStatus('error');
      setErrorMsg('Please enter your email and message.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');
    const { error } = await supabase
      .from('contact_messages')
      .insert({ email: email.trim(), message: message.trim() });
    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
      return;
    }
    setStatus('sent');
    setEmail('');
    setMessage('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <footer
      className="pt-20 pb-10"
      style={{
        background:
          'linear-gradient(180deg, #f4ebe4 0%, #f2ece8 45%, #f1ece9 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-[2fr_1fr] gap-12 items-start">
          <div>
            <h3 className="text-4xl font-light tracking-wide text-[#1f1f1f] mb-8">
              Get in Touch
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5 max-w-[760px]">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'sending'}
                required
                className="w-full rounded-2xl px-6 py-5 bg-white/60 border border-[#e7ddd7] text-[#5f5a57] placeholder:text-[#9f9a96] outline-none focus:ring-2 focus:ring-[#d8c9c1] disabled:opacity-50"
              />

              <textarea
                placeholder="Your message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === 'sending'}
                required
                className="w-full rounded-2xl px-6 py-5 bg-white/60 border border-[#e7ddd7] text-[#5f5a57] placeholder:text-[#9f9a96] outline-none resize-none focus:ring-2 focus:ring-[#d8c9c1] disabled:opacity-50"
              />

              <div className="flex items-center gap-4 flex-wrap">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-[#2f3743] text-white px-8 py-4 rounded-xl hover:bg-[#252c36] transition-colors text-lg disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
                {status === 'sent' && (
                  <span className="text-[#2f6b3b] text-base">Thanks! We'll get back to you soon.</span>
                )}
                {status === 'error' && (
                  <span className="text-red-600 text-base">{errorMsg}</span>
                )}
              </div>
            </form>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="text-4xl font-light tracking-wide text-[#1f1f1f] mb-8">
                Connect With Us
              </h3>

              <div className="flex items-center gap-4">
                <button className="w-16 h-16 rounded-full bg-white/55 border border-[#e7ddd7] flex items-center justify-center text-[#5f5a57] hover:bg-white/75 transition-colors">
                  <Facebook className="w-7 h-7" />
                </button>

                <button className="w-16 h-16 rounded-full bg-white/55 border border-[#e7ddd7] flex items-center justify-center text-[#5f5a57] hover:bg-white/75 transition-colors">
                  <Instagram className="w-7 h-7" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-3xl font-light tracking-wide text-[#1f1f1f] mb-6">
                Payment Methods
              </h4>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/55 border border-[#e7ddd7] text-[#2f2b29]">
                  <Smartphone className="w-6 h-6" />
                  <span className="text-lg">Apple Pay</span>
                </div>

                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/55 border border-[#e7ddd7] text-[#2f2b29]">
                  <CreditCard className="w-6 h-6" />
                  <span className="text-lg">Credit Card</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#dfd5cf] text-center">
          <p className="text-[#7f7974] text-lg">
            © 2026 Whimsy Whiskers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}