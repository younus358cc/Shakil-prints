import { motion } from 'motion/react';
import { ShieldCheck, Truck, Clock, Sparkles, Printer, ArrowRight, Award } from 'lucide-react';
import { Service } from '../types';
import { LucideIcon } from './LucideIcon';
import { useLanguage } from '../LanguageContext';

interface HomeProps {
  onNavigate: (page: string, params?: any) => void;
  services: Service[];
}

export default function Home({ onNavigate, services }: HomeProps) {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
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
              <span>{t('brand.tagline')}</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-display leading-[1.1]"
              >
                {t('home.welcome')}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-2xl text-lg text-blue-100 font-light"
              >
                {t('home.welcomeSub')}
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-wrap md:flex-row gap-4 pt-4"
            >
              <button
                id="hero-order-cta"
                onClick={() => onNavigate('order')}
                className="flex items-center justify-center space-x-2 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:scale-102 hover:shadow-orange-600/40 cursor-pointer"
              >
                <span>{t('nav.orderOnline')}</span>
                <ArrowRight size={18} />
              </button>
              <button
                id="hero-services-cta"
                onClick={() => onNavigate('services')}
                className="flex items-center justify-center space-x-2 rounded-xl bg-white/10 border border-white/20 px-8 py-4 font-semibold text-white transition-all hover:bg-white/20 hover:scale-102 cursor-pointer"
              >
                <span>{t('btn.explore')}</span>
                <Printer size={18} />
              </button>
              <button
                id="hero-portal-cta"
                onClick={() => onNavigate('portal')}
                className="flex items-center justify-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-102 cursor-pointer"
              >
                <ShieldCheck size={18} />
                <span>{isEn ? "Track Order / Portal" : "অর্ডার ট্র্যাক ও পোর্টাল"}</span>
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
                <span className="text-xs text-blue-200">{isEn ? "Express Turnaround" : "দ্রুত ডেলিভারি"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="text-orange-400 shrink-0" size={18} />
                <span className="text-xs text-blue-200">{isEn ? "100% Quality Guaranteed" : "১০০% গুণগত মান"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="text-orange-400 shrink-0" size={18} />
                <span className="text-xs text-blue-200">{isEn ? "Home Delivery Available" : "হোম ডেলিভারি সুবিধা"}</span>
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
                  <span className="text-xs font-mono text-orange-400">{isEn ? "STATUS: CALIBRATED" : "অবস্থা: ক্যালিব্রেটেড"}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-sm font-semibold font-display">{isEn ? "Premium Color Calibration" : "প্রিমিয়াম কালার ক্যালিব্রেশন"}</div>
                <p className="text-xs text-slate-300 font-light mt-1">{isEn ? "Our studio uses ultra-wide gamut inks for 100% accurate RGB-to-CMYK conversion." : "১০০% নির্ভুল RGB থেকে CMYK রূপান্তরের জন্য আমাদের স্টুডিওতে আল্ট্রা-ওয়াইড গ্যামাট কালি ব্যবহার করা হয়।"}</p>
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
            <h4 className="font-semibold text-slate-900 dark:text-white">{t('home.feat3.title')}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.feat3.desc')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-xl">
            <Printer size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{t('home.feat2.title')}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.feat2.desc')}</p>
          </div>
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{t('home.feat1.title')}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t('home.feat1.desc')}</p>
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">{t('services.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">{t('services.subtitle')}</p>
          </div>
          <button 
            onClick={() => onNavigate('services')}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-semibold flex items-center space-x-1 shrink-0 text-sm"
          >
            <span>{t('btn.explore')}</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularServices.map((service, idx) => {
            const displayName = isEn ? service.name : (
              service.id === '1' ? 'পিভিসি আইডি কার্ড' :
              service.id === '2' ? 'কাস্টম ফ্লেক্স ব্যানার' :
              service.id === '3' ? 'লাক্সারি বিজনেস কার্ড' :
              service.id === '4' ? 'অ্যাকাডেমিক আইডি কার্ড' :
              service.id === '5' ? 'ডিজিটাল ফটো প্রিন্টিং' :
              service.id === '6' ? 'আমন্ত্রণ ও ওয়েডিং কার্ড' : service.name
            );
            const displayDesc = isEn ? service.description : (
              service.id === '1' ? 'উচ্চ রেজোলিউশন ৩-লেয়ার ওয়াটারপ্রুফ পিভিসি আইডি কার্ড।' :
              service.id === '2' ? 'আবহাওয়া-প্রতিরোধী ফ্লেক্স ব্যানার এবং কাস্টম হোস্টিং।' :
              service.id === '3' ? 'ইউনিক ফিনিশিং বিশিষ্ট জমকালো প্রিমিয়াম বিজনেস কার্ড।' :
              service.id === '4' ? 'শিক্ষা প্রতিষ্ঠানের জন্য বারকোডসহ আকর্ষক আইডি কার্ড।' :
              service.id === '5' ? 'চকচকে ও দীর্ঘস্থায়ী প্রিমিয়াম ফটো প্রিন্ট পেপার সার্ভিস।' :
              service.id === '6' ? 'বিশেষ অনুষ্ঠানের জন্য ঐতিহ্যবাহী দাওয়াত ও অভিনন্দন পত্র।' : service.description
            );
            return (
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
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{displayName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light line-clamp-2">{displayDesc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">{t('services.startPrice')}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-lg">৳{service.startingPrice}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('order', { serviceId: service.id })}
                    className="rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white p-2.5 text-slate-700 dark:text-slate-300 transition-colors"
                    title={t('services.orderThis')}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Track Order Portal Promo Section */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{isEn ? "Track Your Order" : "আপনার অর্ডার ট্র্যাক করুন"}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isEn ? "Enter your Memo / Order ID to view progress, download PDF invoice, and check status." : "আপনার মেমো / অর্ডার আইডি দিয়ে কাজের অগ্রগতি দেখুন, পিডিএফ ইনভয়েস ডাউনলোড করুন এবং স্ট্যাটাস চেক করুন।"}
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('portal')}
          className="w-full md:w-auto px-6 py-3 bg-slate-900 dark:bg-slate-100 hover:bg-blue-600 dark:hover:bg-blue-600 text-white dark:text-slate-950 hover:text-white dark:hover:text-white font-bold rounded-xl text-xs transition-all shrink-0 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>{isEn ? "Access Tracking Portal" : "ট্র্যাকিং পোর্টালে প্রবেশ করুন"}</span>
          <ArrowRight size={14} />
        </button>
      </section>

      {/* Promo banner section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-15 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 Z" fill="white" />
          </svg>
        </div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold font-mono bg-white/20 px-3 py-1 rounded-full">{isEn ? "Custom Bulk Quote" : "কাস্টম বাল্ক কোটেশন"}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">{isEn ? "Need Customized Bulk Printing?" : "আপনার কি কাস্টমাইজড বাল্ক প্রিন্টিং প্রয়োজন?"}</h2>
          <p className="text-sm sm:text-base text-orange-50 font-light">
            {isEn ? "We provide exceptional wholesale price matrices for schools, colleges, coaching centers, corporate offices, and local businesses on big volume ID cards, calendars, notebooks, and banners." : "আমরা স্কুল, কলেজ, কোচিং সেন্টার, কর্পোরেট অফিস এবং স্থানীয় ব্যবসার জন্য আইডি কার্ড, ক্যালেন্ডার, নোটবুক এবং ব্যানারের বিপুল অর্ডারে বিশেষ পাইকারি মূল্য প্রদান করি।"}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 py-3 rounded-xl transition-all shadow-md"
            >
              {isEn ? "Get Custom Quote" : "কাস্টম কোটেশন পান"}
            </button>
            <a
              href="https://wa.me/8801936488304"
              target="_blank"
              rel="noreferrer"
              className="bg-transparent border border-white hover:bg-white/10 font-semibold px-6 py-3 rounded-xl transition-all flex items-center space-x-2"
            >
              <span>{isEn ? "Chat on WhatsApp" : "হোয়াটসঅ্যাপে চ্যাট করুন"}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

