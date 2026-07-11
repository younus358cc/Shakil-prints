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
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Studio', 'Printing', 'Wide Format', 'Corporate', 'Designing', 'Cards'];

  const categoryTranslation: Record<string, string> = {
    'All': isEn ? 'All' : 'সব',
    'Studio': isEn ? 'Studio' : 'স্টুডিও',
    'Printing': isEn ? 'Printing' : 'প্রিন্টিং',
    'Wide Format': isEn ? 'Wide Format' : 'ওয়াইড ফরম্যাট',
    'Corporate': isEn ? 'Corporate' : 'কর্পোরেট',
    'Designing': isEn ? 'Designing' : 'ডিজাইনিং',
    'Cards': isEn ? 'Cards' : 'কার্ডসমূহ'
  };

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
              {categoryTranslation[cat] || cat}
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
          {filteredServices.map((service, idx) => {
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
            const displayCategory = isEn ? service.category : (
              service.category === 'Studio' ? 'স্টুডিও' :
              service.category === 'Printing' ? 'প্রিন্টিং' :
              service.category === 'Wide Format' ? 'ওয়াইড ফরম্যাট' :
              service.category === 'Corporate' ? 'কর্পোরেট' :
              service.category === 'Designing' ? 'ডিজাইনিং' :
              service.category === 'Cards' ? 'কার্ডসমূহ' : service.category
            );
            return (
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
                        {isEn ? "Popular" : "জনপ্রিয়"}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                    {displayCategory.toUpperCase()}
                  </span>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white mt-1 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {displayName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed mb-4">
                    {displayDesc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{t('services.startPrice')}</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono">৳{service.startingPrice} <span className="text-[10px] font-normal text-slate-400">{isEn ? "up" : "থেকে"}</span></span>
                  </div>
                  <button
                    onClick={() => onNavigate('order', { serviceId: service.id })}
                    className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white font-medium text-xs rounded-xl shadow-sm transition-all hover:scale-102 flex items-center space-x-1"
                  >
                    <span>{t('btn.orderNow')}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-800">
          <Info size={36} className="text-slate-400 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 dark:text-white">{isEn ? "No services found" : "কোনো সেবা পাওয়া যায়নি"}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{isEn ? "Try refining your search terms or checking another category tab." : "অন্যান্য ক্যাটাগরি ট্যাব পরীক্ষা করুন বা সার্চ টার্ম পরিবর্তন করে চেষ্টা করুন।"}</p>
        </div>
      )}

      {/* Info FAQ footer card */}
      <section className="bg-slate-100 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start gap-6 mt-6">
        <div className="p-3 bg-blue-600 text-white rounded-xl">
          <HelpCircle size={24} />
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900 dark:text-white">{isEn ? "Frequently Asked Printing Questions" : "প্রিন্টিং সংক্রান্ত সাধারণ প্রশ্নাবলী"}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>{isEn ? "What files are supported?" : "কোন কোন ফাইল সাপোর্ট করে?"}</strong> {isEn ? "We accept high resolution PDF, JPG, PNG, and standard Word files (.docx) up to 25MB for online submissions. For bigger files or Photoshop source PSDs, please contact us via email or WhatsApp so we can arrange direct Drive links." : "আমরা অনলাইন সাবমিশনের জন্য ২৫ মেগাবাইট পর্যন্ত হাই রেজোলিউশন PDF, JPG, PNG এবং সাধারণ ওয়ার্ড ফাইল (.docx) গ্রহণ করি। বড় সাইজের ফাইল বা ফটোশপ সোর্স ফাইলের (PSD) জন্য দয়া করে আমাদের ইমেইল বা হোয়াটসঅ্যাপে যোগাযোগ করুন।"}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>{isEn ? "How long does printing take?" : "প্রিন্টিং করতে কত সময় লাগে?"}</strong> {isEn ? "Small items like passport photos or normal color/BW prints are completed instantly. Banners, heavy binding publications, or business cards typically take 12 to 36 hours." : "পাসপোর্ট সাইজ ছবি বা সাধারণ সাদাকালো/রঙিন প্রিন্টের মতো ছোট আইটেমগুলো তাৎক্ষণিকভাবে সম্পন্ন করা হয়। ব্যানার, বই বাঁধাই বা বিজনেস কার্ড তৈরিতে সাধারণত ১২ থেকে ৩৬ ঘণ্টা সময় লাগে।"}
          </p>
        </div>
      </section>
    </div>
  );
}
