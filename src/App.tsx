import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, Image as ImageIcon, FileText, ShoppingBag, Info, PhoneCall, 
  Menu, X, Sun, Moon, Sparkles, Facebook, MessageSquare, Clock, MapPin, Search, ChevronRight, Loader2,
  ShieldCheck
} from 'lucide-react';

// Import components
import Home from './components/Home';
import Services from './components/Services';
import PriceList from './components/PriceList';
import OrderNow from './components/OrderNow';
import Portfolio from './components/Portfolio';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import CustomerPortal from './components/CustomerPortal';
import AdminDashboard from './components/AdminDashboard';
import { Service, PriceItem, GalleryItem, WebsiteSettings } from './types';
import { useLanguage } from './LanguageContext';

export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [prefilledParams, setPrefilledParams] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Database States loaded from server
  const [services, setServices] = useState<Service[]>([]);
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize data from backend APIs
  const fetchAllData = async () => {
    try {
      const [resServices, resPrices, resGallery, resSettings] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/prices'),
        fetch('/api/gallery'),
        fetch('/api/settings')
      ]);

      const dataServices = await resServices.json();
      const dataPrices = await resPrices.json();
      const dataGallery = await resGallery.json();
      const dataSettings = await resSettings.json();

      setServices(dataServices);
      setPrices(dataPrices);
      setGalleryItems(dataGallery);
      setSettings(dataSettings);
    } catch (err) {
      console.error("Critical error syncing database API records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Dark/Light mode DOM Sync
  useEffect(() => {
    // Check local storage setting or default to light
    const storedTheme = localStorage.getItem('shakil_theme');
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    if (nextTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('shakil_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('shakil_theme', 'light');
    }
  };

  // Safe navigation function supporting query params
  const handleNavigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setPrefilledParams(params);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Active navigation styles
  const getNavClass = (page: string) => {
    const base = "px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center space-x-1.5 ";
    if (currentPage === page) {
      return base + "bg-blue-600 text-white shadow-sm shadow-blue-600/10";
    }
    return base + "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/40";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Dynamic Promo Announcement Banner */}
      {settings?.announcement && (
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold py-2 px-4 text-center select-none shadow-sm flex items-center justify-center space-x-2">
          <Sparkles size={14} className="animate-pulse" />
          <span className="truncate">{settings.announcement}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Title block */}
          <div 
            onClick={() => handleNavigate('home')} 
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-orange-500 p-0.5 shadow-md flex items-center justify-center text-white group-hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-xs">
                SPS
              </div>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight font-display text-slate-900 dark:text-white block group-hover:text-blue-600 transition-colors">
                {t('brand.name')}
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-mono block">
                {t('brand.sub')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/40 p-1 rounded-2xl border border-slate-200/20">
            <button onClick={() => handleNavigate('home')} className={getNavClass('home')}>{t('nav.home')}</button>
            <button onClick={() => handleNavigate('services')} className={getNavClass('services')}>{t('nav.services')}</button>
            <button onClick={() => handleNavigate('prices')} className={getNavClass('prices')}>{t('nav.prices')}</button>
            <button onClick={() => handleNavigate('portfolio')} className={getNavClass('portfolio')}>{t('nav.portfolio')}</button>
            <button onClick={() => handleNavigate('about')} className={getNavClass('about')}>{t('nav.about')}</button>
            <button onClick={() => handleNavigate('contact')} className={getNavClass('contact')}>{t('nav.contact')}</button>
            <button onClick={() => handleNavigate('portal')} className={getNavClass('portal')}>{t('nav.portal')}</button>
          </nav>

          {/* Top Actions: Language switcher, Dark mode trigger, CTA Order now */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* English and Bangla Mode Buttons */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/40 font-mono text-[10px] font-bold shrink-0 shadow-inner">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1.5 rounded-lg transition-all font-sans ${
                  language === 'bn'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="বাংলা"
              >
                বাংলা
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? <Sun size={18} className="text-orange-400" /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => handleNavigate('order')}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-orange-500/15"
            >
              {t('nav.order')}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-1.5 lg:hidden">
            {/* English and Bangla Mode Buttons Mobile */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/40 font-mono text-[9px] font-bold shadow-inner">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 rounded-lg transition-all font-sans ${
                  language === 'bn'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                বাংলা
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDarkMode ? <Sun size={18} className="text-orange-400" /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2 flex flex-col"
            >
              <button onClick={() => handleNavigate('home')} className={getNavClass('home')}>{t('nav.home')}</button>
              <button onClick={() => handleNavigate('services')} className={getNavClass('services')}>{t('nav.services')}</button>
              <button onClick={() => handleNavigate('prices')} className={getNavClass('prices')}>{t('nav.prices')}</button>
              <button onClick={() => handleNavigate('portfolio')} className={getNavClass('portfolio')}>{t('nav.portfolio')}</button>
              <button onClick={() => handleNavigate('about')} className={getNavClass('about')}>{t('nav.about')}</button>
              <button onClick={() => handleNavigate('contact')} className={getNavClass('contact')}>{t('nav.contact')}</button>
              <button onClick={() => handleNavigate('portal')} className={getNavClass('portal')}>{t('nav.portal')}</button>
              
              <button
                onClick={() => handleNavigate('order')}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {t('nav.orderOnline')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Body Stage */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loading ? (
          <div className="py-32 text-center space-y-4">
            <Loader2 className="animate-spin text-blue-600 mx-auto" size={44} />
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-lg">Shakil Digital Studio App loading...</h3>
            <p className="text-xs text-slate-400 font-light">Retrieving services catalog & prices from backend...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial="page-enter"
              animate="page-enter-active"
              className="transition-all duration-300"
            >
              {currentPage === 'home' && (
                <Home onNavigate={handleNavigate} services={services} />
              )}
              {currentPage === 'services' && (
                <Services services={services} onNavigate={handleNavigate} />
              )}
              {currentPage === 'prices' && (
                <PriceList prices={prices} services={services} onNavigate={handleNavigate} />
              )}
              {currentPage === 'order' && (
                <OrderNow 
                  services={services} 
                  prices={prices} 
                  prefilledParams={prefilledParams} 
                  onOrderSuccess={(id) => {}} 
                  onNavigate={handleNavigate}
                />
              )}
              {currentPage === 'portfolio' && (
                <Portfolio galleryItems={galleryItems} onNavigate={handleNavigate} />
              )}
              {currentPage === 'about' && (
                <AboutUs />
              )}
              {currentPage === 'contact' && (
                <Contact />
              )}
              {currentPage === 'portal' && (
                <CustomerPortal onNavigate={handleNavigate} />
              )}
              {currentPage === 'admin' && (
                <AdminDashboard 
                  services={services} 
                  prices={prices} 
                  galleryItems={galleryItems} 
                  onRefreshData={fetchAllData}
                  onNavigate={handleNavigate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer Block */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8 print:hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Logo Brand summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                SP
              </div>
              <span className="text-sm font-black tracking-tight text-white font-display">
                {t('brand.fullName')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              {t('footer.summary')}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="https://facebook.com/shakildigitalprinters" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook size={16} />
              </a>
              <a href="https://wa.me/8801936488304" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors">
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{t('nav.services')}</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleNavigate('services')} className="hover:text-white">{t('nav.services')}</button></li>
              <li><button onClick={() => handleNavigate('prices')} className="hover:text-white">{t('nav.prices')}</button></li>
              <li><button onClick={() => handleNavigate('order')} className="hover:text-white">{t('nav.orderOnline')}</button></li>
              <li><button onClick={() => handleNavigate('portfolio')} className="hover:text-white">{t('nav.portfolio')}</button></li>
            </ul>
          </div>

          {/* Corporate hours & contacts */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">{t('nav.contact')}</h4>
            <div className="space-y-2 text-xs font-light">
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-orange-500" />
                <span>{t('brand.address')}</span>
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <PhoneCall size={14} className="text-orange-500" />
                <span>{t('brand.phone')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={14} className="text-orange-500" />
                <span>{t('brand.hours')}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-center text-xs text-slate-500 font-light">
          <p>© {new Date().getFullYear()} {t('brand.fullName')}. {t('footer.rights')}</p>
        </div>
      </footer>

    </div>
  );
}
