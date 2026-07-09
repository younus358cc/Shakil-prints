import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, Facebook, MessageSquare, Send, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message })
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ success: true, msg: 'Thank you! Your message has been received. Our team will get back to you soon.' });
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setStatus({ success: false, msg: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setStatus({ success: false, msg: 'Failed to connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          Contact Us
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          Have an urgent printing requirement? Want to negotiate rates for bulk wedding cards or directories? Drop us a line or visit our studio in Melandah Bazar.
        </p>
      </div>

      {/* Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Shakil Printers Office</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-light">
              Feel free to visit during our standard business hours. Our design architects are always available to review layouts.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl mt-0.5 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Studio Address</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                    Mahmudpur road- Melandah Bazar
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-xl mt-0.5 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Phone & WhatsApp</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    Phone: 01936-488304
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    WhatsApp: +8801936488304
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-xl mt-0.5 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Email Address</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                    info@shakildigitalprinters.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl mt-0.5 shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Business Hours</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-light">
                    Sat - Thu: 9:00 AM - 10:00 PM
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light">
                    Friday: 3:00 PM - 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <a
                href="https://wa.me/8801936488304"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageSquare size={14} />
                <span>WhatsApp Live</span>
              </a>
              <a
                href="https://facebook.com/shakildigitalprinters"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-500/20"
              >
                <Facebook size={14} />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">Send a Quick Message</h2>
            
            {status && (
              <div className={`p-4 rounded-xl border flex items-start space-x-2 text-xs ${
                status.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900'
              }`}>
                {status.success ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                <span>{status.msg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salim Mahmud"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 01812345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="e.g. salim@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Message Details *</label>
              <textarea
                required
                rows={4}
                placeholder="Write your custom printing requirement, paper weight questions, or quotation details here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-orange-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <Send size={14} />
              <span>{loading ? 'Sending Message...' : 'Submit Message Form'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Styled vector Map representation with details of Mirpur */}
      <section className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white font-display">Studio Location Map</h3>
              <p className="text-xs text-slate-400 font-light">Conveniently located at Mahmudpur road, easy walking access.</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-mono bg-blue-50 dark:bg-blue-950 text-blue-600 px-3 py-1 rounded-full font-bold">
              EASY ACCESS
            </span>
          </div>

          {/* Decorative Vector Layout to represent a highly professional Google Maps interface */}
          <div className="w-full h-80 rounded-2xl bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
            {/* Grid layout lines */}
            <div className="absolute inset-0 grid grid-cols-8 gap-4 opacity-10 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border-r border-slate-400 h-full" />
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-6 gap-4 opacity-10 pointer-events-none">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border-b border-slate-400 w-full" />
              ))}
            </div>

            {/* Fictional Streets representing Dhaka blocks */}
            <div className="absolute top-1/4 w-full h-12 bg-slate-200 dark:bg-slate-900 transform -rotate-2 flex items-center px-12 border-y border-slate-300 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Mahmudpur Road</span>
            </div>
            <div className="absolute left-1/3 h-full w-10 bg-slate-200 dark:bg-slate-900 transform rotate-12 flex items-center justify-center border-x border-slate-300 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono transform rotate-90 whitespace-nowrap">Melandah Bazar</span>
            </div>

            {/* Landmark Markers */}
            <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <span className="text-[9px] text-slate-400 font-bold bg-slate-50 dark:bg-slate-900 p-1 rounded border shadow-sm mt-1">Melandah Station</span>
            </div>

            {/* Shakil Digital Printer Pointer */}
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20"
            >
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/30 border-2 border-white">
                <MapPin size={24} />
              </div>
              <div className="mt-2 bg-slate-900 border border-orange-500/30 text-white px-4 py-2 rounded-2xl text-center shadow-lg backdrop-blur-sm">
                <h5 className="text-xs font-bold font-display">Shakil Digital Printers & Studio</h5>
                <p className="text-[9px] text-orange-400 font-mono mt-0.5">Mahmudpur road- Melandah Bazar</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
