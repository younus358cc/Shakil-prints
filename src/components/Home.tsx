import { motion } from 'motion/react';
import { ShieldCheck, Truck, Clock, Sparkles, Printer, ArrowRight, Award } from 'lucide-react';
import { Service } from '../types';
import { LucideIcon } from './LucideIcon';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
  services: Service[];
}

export default function Home({ onNavigate, services }: HomeProps) {
  const popularServices = services.filter(s => s.popular).slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section id="hero-banner" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white shadow-2xl">
        {/* Abstract shapes / backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_50%)]" />
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-blue-700/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-12 sm:py-24 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
            {/* Announcement Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex w-fit items-center space-x-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400"
            >
              <Sparkles size={16} />
              <span>Modern Printing & Design Studio</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-display leading-[1.1]"
              >
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Shakil Digital</span> Printers & Studio
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl text-lg text-blue-100 font-light"
              >
                Professional Printing, Designing & Studio Services. Experience vibrant colors, high-speed laser prints, durable bindings, and expert photography right at your fingertips.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button
                id="hero-order-cta"
                onClick={() => onNavigate('order')}
                className="flex items-center justify-center space-x-2 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:scale-102 hover:shadow-orange-600/40"
              >
                <span>Order Online Now</span>
                <ArrowRight size={18} />
              </button>
              <button
                id="hero-services-cta"
                onClick={() => onNavigate('services')}
                className="flex items-center justify-center space-x-2 rounded-xl bg-white/10 border border-white/20 px-8 py-4 font-semibold text-white transition-all hover:bg-white/20 hover:scale-102"
              >
                <span>Explore Services</span>
                <Printer size={18} />
              </button>
            </motion.div>

            {/* Quick badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 mt-4"
            >
              <div className="flex items-center space-x-2">
                <Clock className="text-orange-400 shrink-0" size={18} />
                <span className="text-xs text-blue-200">Express Turnaround</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="text-orange-400 shrink-0" size={18} />
                <span className="text-xs text-blue-200">100% Quality Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="text-orange-400 shrink-0" size={18} />
                <span className="text-xs text-blue-200">Home Delivery Available</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side Visual Graphics */}
          <div className="mt-12 lg:mt-0 lg:col-span-5 flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="relative w-full max-w-sm aspect-square bg-gradient-to-tr from-orange-500 to-amber-500 rounded-3xl p-1 shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/20 transition-colors duration-300 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1615840287214-7fe58a8f3685?w=600&auto=format&fit=crop&q=80" 
                alt="Digital CMYK Printing Machinery" 
                className="w-full h-full object-cover rounded-[22px] transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay HUD indicators to match professional print style */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md rounded-2xl p-4 text-white z-20 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-orange-400">STATUS: CALIBRATED</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-sm font-semibold font-display">Premium Color Calibration</div>
                <p className="text-xs text-slate-300 font-light mt-1">Our studio uses ultra-wide gamut inks for 100% accurate RGB-to-CMYK conversion.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
            <Award size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Expert Designers</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Professional branding designers who translate ideas into beautiful layouts.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-xl">
            <Printer size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">High-Speed Laser Setup</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Next-generation heavy printing machines for flawless bulk copies.</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Premium Binding</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Durable binding sheets, spiral loops, and laminations to lock quality.</p>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Popular Printing Services</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Get high-quality outputs with starting price rates for our most demanded items.</p>
          </div>
          <button 
            onClick={() => onNavigate('services')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold flex items-center space-x-1 shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <LucideIcon name={service.iconName} size={24} />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{service.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light line-clamp-2">{service.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Starting from</span>
                  <span className="font-bold text-slate-900 dark:text-white text-lg">৳{service.startingPrice}</span>
                </div>
                <button
                  onClick={() => onNavigate('order', { serviceId: service.id })}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white p-2.5 text-slate-700 dark:text-slate-300 transition-colors"
                  title="Order This Service"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Promo banner section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-15 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold font-mono bg-white/20 px-3 py-1 rounded-full">Custom Bulk Quote</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">Need Customized Bulk Printing?</h2>
          <p className="text-sm sm:text-base text-orange-50 font-light">
            We provide exceptional wholesale price matrices for schools, colleges, coaching centers, corporate offices, and local businesses on big volume ID cards, calendars, notebooks, and banners.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl transition-all shadow-md"
            >
              Get Custom Quote
            </button>
            <a
              href="https://wa.me/8801936488304"
              target="_blank"
              rel="noreferrer"
              className="bg-transparent border border-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-all flex items-center space-x-2"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
