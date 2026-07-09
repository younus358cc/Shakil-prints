import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calculator, FileText, CheckCircle } from 'lucide-react';
import { PriceItem, Service } from '../types';
import { useLanguage } from '../LanguageContext';

interface PriceListProps {
  prices: PriceItem[];
  services: Service[];
  onNavigate: (page: string, params?: any) => void;
}

export default function PriceList({ prices, services, onNavigate }: PriceListProps) {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('All');

  // Interactive Price Calculator state
  const [calcServiceId, setCalcServiceId] = useState(services[0]?.id || '');
  const [calcQuantity, setCalcQuantity] = useState(10);
  const [calcColorOption, setCalcColorOption] = useState<'Color' | 'Black & White'>('Color');

  // Filter prices
  const filteredPrices = prices.filter(item => {
    const matchesSearch = item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.paperType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.size.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = selectedService === 'All' || item.serviceId === selectedService;
    
    return matchesSearch && matchesService;
  });

  // Calculate dynamic quote
  const calculateEstimate = () => {
    const selectedSrv = services.find(s => s.id === calcServiceId);
    if (!selectedSrv) return 0;
    
    // Find matching unit price from price list if available
    const matchingPrice = prices.find(p => p.serviceId === calcServiceId);
    let baseRate = matchingPrice ? matchingPrice.pricePerUnit : selectedSrv.startingPrice;

    // Apply color discount
    if (calcColorOption === 'Black & White') {
      baseRate = Math.max(2, Math.round(baseRate * 0.4)); // B&W is cheaper
    }

    // Apply volume discount (e.g., above 100 units gets 15% discount, above 500 gets 30%)
    let total = baseRate * calcQuantity;
    if (calcQuantity >= 500) {
      total = total * 0.7; // 30% discount
    } else if (calcQuantity >= 100) {
      total = total * 0.85; // 15% discount
    }

    return Math.round(total);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          {t('prices.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          {isEn 
            ? "No hidden fees. We provide honest, competitive rate cards. Choose quantity scales to trigger instant volume discounts."
            : "কোনো গোপন চার্জ নেই। আমরা দিচ্ছি ১০০% সৎ ও প্রতিযোগিতামূলক মূল্যের নিশ্চয়তা। বড় অর্ডারে তাত্ক্ষণিক ডিসকাউন্ট পেতে পরিমাণ বাড়ান।"
          }
        </p>
      </div>

      {/* Main Grid: Left Pricing Tables, Right Live Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Price Table Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Service selector */}
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none"
            >
              <option value="All">{isEn ? "All Services" : "সব সার্ভিস"}</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder={isEn ? "Filter size, paper..." : "সাইজ বা পেপার ফিল্টার করুন..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 w-full sm:w-60 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-mono border-b border-slate-100 dark:border-slate-800">
                    <th className="py-4 px-6 font-semibold">{isEn ? "Service Name" : "সার্ভিসের নাম"}</th>
                    <th className="py-4 px-6 font-semibold">{isEn ? "Paper / Material" : "কাগজ / ম্যাটেরিয়াল"}</th>
                    <th className="py-4 px-6 font-semibold">{isEn ? "Size" : "সাইজ"}</th>
                    <th className="py-4 px-6 font-semibold text-right">{isEn ? "Unit Price" : "একক মূল্য"}</th>
                    <th className="py-4 px-6 font-semibold text-right">{isEn ? "Min Qty" : "নূন্যতম পরিমাণ"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {filteredPrices.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/55 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                        {item.serviceName}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400">
                        {item.paperType}
                      </td>
                      <td className="py-4 px-6 text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {item.size}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-950 dark:text-white font-mono text-xs">
                        ৳{item.pricePerUnit}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-400 dark:text-slate-500 font-mono text-xs">
                        {item.minQuantity}
                      </td>
                    </tr>
                  ))}
                  {filteredPrices.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        {isEn ? "No customized pricing items found matching your filter criteria." : "আপনার সার্চের সাথে মেলে এমন কোনো প্রাইস লিস্ট পাওয়া যায়নি।"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Estimate Calculator */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl sticky top-6 border border-white/10 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Calculator size={20} />
              </div>
              <h3 className="text-xl font-bold font-display">{isEn ? "Instant Cost Estimator" : "তাত্ক্ষণিক খরচ হিসাবকারী"}</h3>
            </div>
            
            <p className="text-xs text-blue-200 font-light">
              {isEn 
                ? "Estimate your printing charges immediately. Standard volume discounts are auto-applied on calculations."
                : "আপনার প্রিন্টিং খরচ তাত্ক্ষণিকভাবে হিসাব করুন। বাল্ক অর্ডারের স্ট্যান্ডার্ড ডিসকাউন্ট স্বয়ংক্রিয়ভাবে হিসাব করা হবে।"
              }
            </p>

            <hr className="border-white/10" />

            {/* Selector inputs */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-blue-200">{isEn ? "Select Service" : "সার্ভিস নির্বাচন করুন"}</label>
                <select
                  value={calcServiceId}
                  onChange={(e) => setCalcServiceId(e.target.value)}
                  className="w-full bg-blue-950/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-400"
                >
                  {services.map(s => (
                    <option key={s.id} value={s.id} className="text-slate-900">{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-blue-200">{isEn ? "Quantity (units/copies)" : "পরিমাণ (কপি সংখ্যা)"}</label>
                <input
                  type="number"
                  min="1"
                  value={calcQuantity}
                  onChange={(e) => setCalcQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-blue-950/60 border border-white/15 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-400 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-blue-200">{isEn ? "Color Palette Option" : "কালার অপশন"}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Color', 'Black & White'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCalcColorOption(opt)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        calcColorOption === opt
                          ? 'bg-orange-500 border-orange-500 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-blue-200 hover:bg-white/10'
                      }`}
                    >
                      {opt === 'Color' ? (isEn ? 'Color' : 'রঙিন') : (isEn ? 'Black & White' : 'সাদাকালো')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-blue-950/80 rounded-2xl p-4 border border-white/5 space-y-2">
              <span className="text-xs text-blue-300 block">{isEn ? "Total Est. Price" : "সর্বমোট আনুমানিক খরচ"}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-display text-orange-400 font-mono">৳{calculateEstimate()}</span>
                {calcQuantity >= 100 && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold">
                    {calcQuantity >= 500 
                      ? (isEn ? '30% Bulk Discount Applied' : '৩০% বাল্ক ডিসকাউন্ট প্রযোজ্য') 
                      : (isEn ? '15% Bulk Discount Applied' : '১৫% বাল্ক ডিসকাউন্ট প্রযোজ্য')
                    }
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onNavigate('order', { serviceId: calcServiceId, quantity: calcQuantity, colorOption: calcColorOption })}
              className="w-full bg-orange-500 hover:bg-orange-600 font-bold py-3.5 rounded-xl text-sm transition-all hover:scale-102 flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20"
            >
              <FileText size={16} />
              <span>{isEn ? "Proceed to Order Page" : "অর্ডার করুন"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing policies checklist */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
          {isEn ? "Our Pricing Standards" : "আমাদের মূল্যমান নির্ধারণী স্ট্যান্ডার্ড"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-light">
              {isEn ? (
                <><strong>Bulk Multipliers:</strong> Lower cost-per-page scales dynamically when ordering photocopies or prints in volumes exceeding 100 pages.</>
              ) : (
                <><strong>বাল্ক গুণক:</strong> ১০০ পৃষ্ঠার বেশি ফটোকপি বা প্রিন্টিংয়ের অর্ডারে প্রতি পৃষ্ঠার খরচ স্বয়ংক্রিয়ভাবে অনেকাংশে কমে যায়।</>
              )}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-light">
              {isEn ? (
                <><strong>Premium Inks:</strong> Every price list item includes premium original ink coverage with 100% saturation guarantees.</>
              ) : (
                <><strong>প্রিমিয়াম কালি:</strong> আমাদের প্রতিটি প্রিন্ট এবং ফটোকপিতে আমরা আসল ও প্রিমিয়াম কালি ব্যবহারে ১০০% কালার স্যাচুরেশন গ্যারান্টি দিই।</>
              )}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-light">
              {isEn ? (
                <><strong>Corporate Rates:</strong> Organizations can apply for local monthly billing cycles by presenting commercial trade licenses.</>
              ) : (
                <><strong>করপোরেট রেট:</strong> বিভিন্ন প্রতিষ্ঠান তাদের বৈধ ট্রেড লাইসেন্স উপস্থাপন করে মাসিক পেমেন্ট বা করপোরেট রেটের সুবিধা নিতে পারেন।</>
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
