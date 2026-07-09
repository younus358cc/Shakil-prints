import { motion } from 'motion/react';
import { Award, Users, BookOpen, Clock, Heart, Smile } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function AboutUs() {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const stats = [
    { label: isEn ? "Successful Printings" : "সফল প্রিন্টিং সম্পন্ন", count: "150,000+", icon: Award },
    { label: isEn ? "Happy Regular Customers" : "নিয়মিত সন্তুষ্ট গ্রাহক", count: "8,500+", icon: Smile },
    { label: isEn ? "Experienced Design Team" : "অভিজ্ঞ ডিজাইন টিম", count: isEn ? "12+ Staff" : "১২+ কর্মী", icon: Users },
    { label: isEn ? "Hours in Business Queue" : "২৪/৭ সার্বক্ষণিক সহায়তা", count: isEn ? "24/7 Support" : "২৪/৭ সাপোর্ট", icon: Clock }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          {isEn ? "About Shakil Digital Printers" : "শাকিল ডিজিটাল প্রিন্টার্স সম্পর্কে"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          {isEn 
            ? "A commitment to color precision, cutting-edge technology, and unmatched customer service since 2018."
            : "২০১৮ সাল থেকে কালার পারফেকশন, সর্বাধুনিক প্রযুক্তি এবং অনন্য গ্রাহক সেবায় অঙ্গীকারবদ্ধ।"
          }
        </p>
      </div>

      {/* Grid: Image and Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 relative">
          <div className="absolute -top-6 -left-6 h-48 w-48 rounded-3xl bg-blue-100 dark:bg-blue-950/40 -z-10" />
          <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-3xl bg-orange-100 dark:bg-orange-950/40 -z-10" />
          
          <img
            src="https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=600&auto=format&fit=crop&q=80"
            alt="Printing workshop setup"
            className="w-full aspect-4/3 object-cover rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 font-mono">
            {isEn ? "Our Heritage & Craft" : "আমাদের ঐতিহ্য ও শৈলী"}
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
            {isEn ? "Delivering Premium Digital Printing Excellence" : "প্রিমিয়াম ডিজিটাল প্রিন্টিং শ্রেষ্ঠত্ব প্রদান"}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            {isEn ? (
              <>At <strong>Shakil Digital Printers & Studio</strong>, we are passionate about turning digital designs into physical masterpieces. Since our inception, we have served students, visual designers, corporate offices, and local institutions with high-fidelity color prints, expert photo studio operations, and robust document binding packages.</>
            ) : (
              <><strong>শাকিল ডিজিটাল প্রিন্টার্স অ্যান্ড স্টুডিও</strong>-তে আমরা ডিজিটাল ডিজাইনকে বাস্তব মাস্টারপিস বা সুন্দর প্রিন্টে রূপান্তর করতে অত্যন্ত আন্তরিক। প্রতিষ্ঠার পর থেকেই আমরা শিক্ষার্থী, ডিজাইনার, করপোরেট অফিস এবং স্থানীয় প্রতিষ্ঠানগুলোকে হাই-ফিডেলিটি কালার প্রিন্ট, প্রফেশনাল ফটো স্টুডিও সেবা এবং উন্নত বাইন্ডিং সলিউশন দিয়ে আসছি।</>
            )}
          </p>
          <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            {isEn ? (
              <>We operate state-of-the-art heavy laser printers capable of high-velocity monochrome and color document replication, wide-format industrial flex plotter machines for outdoor commercial banners, and professional digital camera setups configured for perfect identity photography.</>
            ) : (
              <>আমরা দ্রুততম সময়ে সাদাকালো ও রঙিন ডকুমেন্ট প্রিন্টিংয়ের জন্য সর্বাধুনিক ভারী লেজার প্রিন্টার, আউটডোর ব্যানারের জন্য ওয়াইড-ফরম্যাট ইন্ডাস্ট্রিয়াল ফ্লেক্স প্লটার এবং সঠিক পাসপোর্ট সাইজ ছবির জন্য চমৎকার ডিজিটাল ক্যামেরা সেটআপ ও স্টুডিও লাইট পরিচালনা করি।</>
            )}
          </p>
          <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 font-semibold text-sm">
            <Heart size={18} className="fill-current text-rose-500" />
            <span>{isEn ? "Dedicated to 100% Customer Satisfaction & Detail Accuracy." : "১০০% গ্রাহক সন্তুষ্টি এবং নির্ভুল কাজের প্রতি আমরা সদা নিবেদিত।"}</span>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-3xl p-10 shadow-lg border border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-orange-400 flex items-center justify-center mx-auto">
                <stat.icon size={20} />
              </div>
              <h4 className="text-2xl sm:text-3xl font-black font-display font-mono text-orange-400">{stat.count}</h4>
              <p className="text-xs text-blue-200 font-light">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values card matrix */}
      <section className="space-y-8">
        <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white font-display">
          {isEn ? "Our Core Printing Values" : "আমাদের মূল প্রিন্টিং মূল্যবোধ"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {isEn ? "Impeccable Color Fidelity" : "নির্ভুল কালার ফিডেলিটি"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              {isEn 
                ? "We employ professional CMYK color calibration algorithms on our machines to guarantee that what you see on your digital screen aligns beautifully with physical outputs."
                : "ডিজিটাল স্ক্রিনে আপনি যা দেখছেন তা যেন প্রিন্টেও হুবহু একই রকম আসে, তা নিশ্চিত করতে আমরা প্রফেশনাল সিএমওয়াইকে কালার ক্যালিব্রেশন ব্যবহার করি।"
              }
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {isEn ? "Community Driven" : "স্থানীয় জনগোষ্ঠীর সহায়তায়"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              {isEn 
                ? "We understand academic timelines and localized corporate pressures, offering highly customized student discounts and credit schemes for local partners."
                : "আমরা শিক্ষার্থীদের প্রাতিষ্ঠানিক ডেডলাইন ও করপোরেট চাহিদার গুরুত্ব বুঝি। তাই শিক্ষার্থীদের জন্য বিশেষ ডিসকাউন্ট এবং অংশীদারদের সুবিধাজনক স্কিম অফার করি।"
              }
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              {isEn ? "Express Delivery" : "এক্সপ্রেস ডেলিভারি"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              {isEn 
                ? "We treat your printing goals as our emergency. We promise quick digital handoffs and prompt door-to-door courier dispatches for bulk print orders."
                : "আপনার কাজকে আমরা সর্বোচ্চ অগ্রাধিকার দেই। আমরা দ্রুততম সময়ে ডিজিটাল ফাইল চেক এবং যেকোনো বাল্ক অর্ডারের ক্ষেত্রে দ্রুত হোম ডেলিভারির নিশ্চয়তা দিই।"
              }
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
