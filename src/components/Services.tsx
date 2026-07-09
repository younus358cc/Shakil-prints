import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Info, HelpCircle } from 'lucide-react';
import { Service } from '../types';
import { LucideIcon } from './LucideIcon';
import { useLanguage } from '../LanguageContext';

interface ServicesProps {
  services: Service[];
  onNavigate: (page: string, params?: any) => void;
}

export default function Services({ services, onNavigate }: ServicesProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Studio', 'Printing', 'Wide Format', 'Corporate', 'Designing', 'Cards'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          {t('services.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          {t('services.subtitle')}
        </p>
      </div>

      {/* Filters and Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'All' ? t('portfolio.filterAll') : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder={t('services.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-600 transition-all group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    <LucideIcon name={service.iconName} size={24} />
                  </div>
                  {service.popular && (
                    <span className="text-[10px] uppercase font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded-md">
                      Popular
                    </span>
                  )}
                </div>

                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                  {service.category.toUpperCase()}
                </span>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mt-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-4">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{t('services.startPrice')}</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white font-mono">৳{service.startingPrice} <span className="text-[10px] font-normal text-slate-400">up</span></span>
                </div>
                <button
                  onClick={() => onNavigate('order', { serviceId: service.id })}
                  className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white font-medium text-xs rounded-xl shadow-sm transition-all hover:scale-102 flex items-center space-x-1"
                >
                  <span>{t('btn.orderNow')}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
          <Info size={36} className="text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white">No services found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try refining your search terms or checking another category tab.</p>
        </div>
      )}

      {/* Info FAQ footer card */}
      <section className="bg-slate-100 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start gap-6 mt-6">
        <div className="p-3 bg-blue-600 text-white rounded-xl">
          <HelpCircle size={24} />
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900 dark:text-white">Frequently Asked Printing Questions</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>What files are supported?</strong> We accept high resolution PDF, JPG, PNG, and standard Word files (.docx) up to 25MB for online submissions. For bigger files or Photoshop source PSDs, please contact us via email or WhatsApp so we can arrange direct Drive links.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>How long does printing take?</strong> Small items like passport photos or normal color/BW prints are completed instantly. Banners, heavy binding publications, or business cards typically take 12 to 36 hours.
          </p>
        </div>
      </section>
    </div>
  );
}
