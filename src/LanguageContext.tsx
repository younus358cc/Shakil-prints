import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav links
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.prices': 'Price List',
    'nav.portfolio': 'Portfolio',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.portal': 'Track Order',
    'nav.admin': 'Operator Login',
    'nav.order': 'Order Now',
    'nav.orderOnline': 'Order Online Now',

    // Hero / Brand headers
    'brand.name': 'SHAKIL DIGITAL',
    'brand.sub': 'PRINTERS & STUDIO',
    'brand.fullName': 'SHAKIL DIGITAL PRINTERS & STUDIO',
    'brand.tagline': 'Fast. Pristine. High-Gamut.',
    'brand.motto': 'Your Trusted Hub for Premium Printing & Professional Studio in Melandah Bazar',
    'brand.address': 'Mahmudpur road- Melandah Bazar',
    'brand.hours': 'Sat - Thu: 9AM - 10PM',
    'brand.hoursShort': 'Sat-Thu: 9 AM - 10 PM',
    'brand.phone': '01936-488304',

    // Buttons / CTA
    'btn.orderNow': 'Order Now',
    'btn.learnMore': 'Learn More',
    'btn.explore': 'Explore Portfolio',
    'btn.submit': 'Submit',
    'btn.track': 'Track',
    'btn.back': 'Back',
    'btn.applyOrder': 'Apply & Order Prints',
    'btn.operatorLogin': 'Operator Login',
    'btn.viewGallery': 'View Gallery',

    // Stats
    'stats.completed': 'Completed Projects',
    'stats.customers': 'Happy Customers',
    'stats.experience': 'Years Experience',

    // Home Section
    'home.welcome': 'Welcome to Shakil Digital Printers',
    'home.welcomeSub': 'We bring your designs to life with top-quality commercial and personal printing services.',
    'home.features': 'Why Choose Us?',
    'home.feat1.title': 'Superior Color Gamut',
    'home.feat1.desc': 'Our state-of-the-art plotters and printing presses deliver vibrant, rich, and high-fidelity colors.',
    'home.feat2.title': 'Lightning Fast Delivery',
    'home.feat2.desc': 'Get your urgent digital documents, photo prints, and business cards printed in minutes.',
    'home.feat3.title': 'Custom Visual Designers',
    'home.feat3.desc': 'Personalize your ID cards, wedding invitations, and banners using our interactive visual customizers.',

    // Services Page
    'services.title': 'Our Professional Printing Services',
    'services.subtitle': 'State-of-the-art digital, offset, and flex printing solutions designed to fit your budgets.',
    'services.search': 'Search services...',
    'services.startPrice': 'Starting from',
    'services.orderThis': 'Order This Service',

    // Prices Page
    'prices.title': 'Transparent Pricing Table',
    'prices.subtitle': 'Clear pricing with bulk discounts for commercial and digital printing.',
    'prices.searchPlaceholder': 'Search items or categories...',
    'prices.colName': 'Service / Item Name',
    'prices.colCat': 'Category',
    'prices.colUnit': 'Unit Price',
    'prices.colBulk': 'Bulk Price (Min Qty)',
    'prices.orderText': 'Order Now',

    // Portfolio & Customizers
    'portfolio.title': 'Work Showcase & Live Designers',
    'portfolio.subtitle': 'Browse high-quality print templates or customize yours in real-time.',
    'portfolio.filterAll': 'All Designs',
    'portfolio.idTitle': 'Interactive ID Card Creator',
    'portfolio.idSub': 'Choose a layout preset, personalize fields instantly, and click "Apply & Order Prints" to submit.',
    'portfolio.bannerTitle': 'Interactive Banner Creator',
    'portfolio.bannerSub': 'Choose a layout preset, customize the promotional headers, dates, and click "Apply & Order Prints" to submit.',
    'portfolio.frontSide': 'Front Side',
    'portfolio.backSide': 'Back Side',
    'portfolio.chooseStyle': '1. Choose Layout Style',
    'portfolio.chooseBannerStyle': '1. Choose Banner Theme Preset',
    'portfolio.personalizeDetails': '2. Personalize Cardholder Details',
    'portfolio.personalizeBanner': '2. Personalize Headline & Promotional Text',
    'portfolio.profilePhoto': '3. Profile Photo Selection',
    'portfolio.ratioSize': 'Size Ratio:',
    'portfolio.orgName': 'Institution / Organization Name',
    'portfolio.brandLogo': 'Short Brand Logo Text',
    'portfolio.accentColor': 'Accent Theme Color',
    'portfolio.fullName': 'Full Name',
    'portfolio.designation': 'Designation / Role / Grade Class',
    'portfolio.idNo': 'ID Number / Roll Code',
    'portfolio.bloodGroup': 'Blood Group',
    'portfolio.emergencyPhone': 'Emergency Contact Phone',
    'portfolio.bannerHighlight': 'Highlight Tag / Top Badge Text',
    'portfolio.bannerMainTitle': 'Main Banner Title / Big Headline',
    'portfolio.bannerPromo': 'Promo Subtitle / Supporting Offer Info',
    'portfolio.bannerDate': 'Date / Timing Info',
    'portfolio.bannerContact': 'Emergency / Contact Phone',
    'portfolio.bannerBg': 'Banner Background Color',
    'portfolio.bannerText': 'Banner Headline Text Color',
    'portfolio.grommetsMsg': 'Banners are printed on weather-resistant heavy star flex with grommets pre-installed',
    'portfolio.pvcMsg': 'Orders are printed on premium 30-mil high-gloss PVC with lanyards included',
    'portfolio.aspectWide': '3:1 (Wide)',
    'portfolio.aspectClassic': '2:1 (Classic)',
    'portfolio.aspectPano': '4:1 (Panoramic)',

    // Order Now Page
    'order.title': 'Place Your Custom Print Order',
    'order.subtitle': 'Provide details about your file and dimensions, or use pre-configured services.',
    'order.lblService': 'Select Printing Service',
    'order.lblQty': 'Enter Quantity',
    'order.lblColor': 'Color Options',
    'order.lblPhone': 'Active Contact Phone',
    'order.lblFile': 'Attach File or Image',
    'order.lblInstructions': 'Additional Instructions',
    'order.secEstimated': 'Order Price Estimation',
    'order.estPrice': 'Estimated Base Total',
    'order.estDelivery': 'Estimated Turnaround',
    'order.estDays': 'Same-Day or Next-Day printing',
    'order.btnSubmitOrder': 'Submit Digital Printing Order',
    'order.phInstructions': 'Please specify dimensions, colors, paper type, or paste customized tool designs here...',

    // Track Page
    'track.title': 'Track Your Print Order',
    'track.subtitle': 'Check real-time preparation status, operator remarks, and payment details.',
    'track.lblOrderId': 'Enter Order ID',
    'track.btnSubmit': 'Search Order Status',
    'track.status': 'Current Status',
    'track.remarks': 'Operator Remarks',
    'track.cost': 'Total Price',
    'track.pvcQty': 'Quantity',

    // About Page
    'about.title': 'About Shakil Digital Printers',
    'about.subtitle': 'Serving Mahmudpur and Melandah Bazar with quality and precision since inception.',
    'about.mission': 'Our Mission',
    'about.missionDesc': 'To democratize access to world-class printing tools and commercial signage output for rural communities and business owners.',
    'about.tech': 'Our Modern Hardware Fleet',
    'about.techDesc': 'We employ state-of-the-art Japanese plotters, commercial Konica digital press machines, and high-DPI thermo-graphic photographers.',

    // Contact Page
    'contact.title': 'Get in Touch with Us',
    'contact.subtitle': 'Reach out for custom order estimations or site measurements for large banners.',
    'contact.formName': 'Your Name',
    'contact.formEmail': 'Email Address',
    'contact.formPhone': 'Phone Number',
    'contact.formMsg': 'Message / Inquiry Details',
    'contact.btnSend': 'Send Inquiry Message',

    // Footer
    'footer.summary': 'Leading printing shop located in Melandah Bazar. We offer pristine photo studios, rapid commercial documents copying, high gamut wedding card layouts, and industrial plotter banners.',
    'footer.adminHeader': 'Administration',
    'footer.adminDesc': 'Authorized operators can log into the console to track inventories and download PDF layouts.',
    'footer.rights': 'All Rights Reserved. Made in Bangladesh.'
  },
  bn: {
    // Nav links
    'nav.home': 'হোম',
    'nav.services': 'সেবাসমূহ',
    'nav.prices': 'মূল্য তালিকা',
    'nav.portfolio': 'পোর্টফোলিও',
    'nav.about': 'আমাদের সম্পর্কে',
    'nav.contact': 'যোগাযোগ',
    'nav.portal': 'অর্ডার ট্র্যাক',
    'nav.admin': 'অপারেটর লগইন',
    'nav.order': 'অর্ডার করুন',
    'nav.orderOnline': 'অনলাইনে অর্ডার করুন',

    // Hero / Brand headers
    'brand.name': 'শাকিল ডিজিটাল',
    'brand.sub': 'প্রিন্টার্স ও স্টুডিও',
    'brand.fullName': 'শাকিল ডিজিটাল প্রিন্টার্স ও স্টুডিও',
    'brand.tagline': 'দ্রুত। নিখুঁত। উচ্চ-মানের রঙ।',
    'brand.motto': 'মেলান্দহ বাজারে প্রিমিয়াম প্রিন্টিং এবং পেশাদার স্টুডিওর জন্য আপনার বিশ্বস্ত প্রতিষ্ঠান',
    'brand.address': 'মাহমুদপুর রোড- মেলান্দহ বাজার',
    'brand.hours': 'শনি - বৃহস্পতি: সকাল ৯টা - রাত ১০টা',
    'brand.hoursShort': 'শনি-বৃহস্পতি: সকাল ৯টা - রাত ১০টা',
    'brand.phone': '০১9৩৬-৪৮৮৩০৪',

    // Buttons / CTA
    'btn.orderNow': 'অর্ডার করুন',
    'btn.learnMore': 'আরও জানুন',
    'btn.explore': 'পোর্টফোলিও দেখুন',
    'btn.submit': 'জমা দিন',
    'btn.track': 'ট্র্যাক করুন',
    'btn.back': 'ফিরে যান',
    'btn.applyOrder': 'ডিজাইন প্রয়োগ ও অর্ডার করুন',
    'btn.operatorLogin': 'অপারেটর লগইন',
    'btn.viewGallery': 'গ্যালারি দেখুন',

    // Stats
    'stats.completed': 'সম্পন্ন প্রজেক্ট',
    'stats.customers': 'সন্তুষ্ট গ্রাহক',
    'stats.experience': 'বছরের অভিজ্ঞতা',

    // Home Section
    'home.welcome': 'শাকিল ডিজিটাল প্রিন্টার্স-এ আপনাকে স্বাগতম',
    'home.welcomeSub': 'আমরা উন্নত মানের বাণিজ্যিক এবং ব্যক্তিগত প্রিন্টিং সেবার মাধ্যমে আপনার ডিজাইনকে বাস্তবে রূপ দেই।',
    'home.features': 'কেন আমাদের বেছে নেবেন?',
    'home.feat1.title': 'সেরা কালার গ্যামাট',
    'home.feat1.desc': 'আমাদের সর্বাধুনিক প্লটার এবং প্রিন্টিং প্রেসগুলো আপনাকে দেয় প্রানবন্ত, নিখুঁত এবং উচ্চ-মানের কালার।',
    'home.feat2.title': 'বিদ্যুৎ গতিতে ডেলিভারি',
    'home.feat2.desc': 'জরুরি ডিজিটাল নথিপত্র, ফটো প্রিন্ট এবং বিজনেস কার্ড মাত্র কয়েক মিনিটে প্রিন্ট করে নিন।',
    'home.feat3.title': 'কাস্টম ভিজ্যুয়াল ডিজাইনার',
    'home.feat3.desc': 'আমাদের লাইভ ভিজ্যুয়াল এডিটরের মাধ্যমে সহজেই আপনার আইডি কার্ড, বিয়ের কার্ড এবং ব্যানার কাস্টমাইজ করুন।',

    // Services Page
    'services.title': 'আমাদের পেশাদার প্রিন্টিং সেবাসমূহ',
    'services.subtitle': 'আপনার বাজেটের মধ্যে সর্বাধুনিক ডিজিটাল, অফসেট এবং ফ্লেক্স প্রিন্টিং সল্যুশন।',
    'services.search': 'সেবা খুঁজুন...',
    'services.startPrice': 'শুরু হয়েছে মাত্র',
    'services.orderThis': 'এই সেবাটি অর্ডার করুন',

    // Prices Page
    'prices.title': 'স্বচ্ছ মূল্য তালিকা',
    'prices.subtitle': 'বাণিজ্যিক এবং ডিজিটাল প্রিন্টিং-এর জন্য পাইকারি ছাড়সহ স্পষ্ট মূল্য তালিকা।',
    'prices.searchPlaceholder': 'সেবা বা ক্যাটাগরি খুঁজুন...',
    'prices.colName': 'সেবা / পণ্যের নাম',
    'prices.colCat': 'ক্যাটাগরি',
    'prices.colUnit': 'একক মূল্য',
    'prices.colBulk': 'পাইকারি মূল্য (নূন্যতম পরিমাণ)',
    'prices.orderText': 'অর্ডার করুন',

    // Portfolio & Customizers
    'portfolio.title': 'আমাদের কাজ এবং লাইভ কাস্টমাইজার',
    'portfolio.subtitle': 'উচ্চ-মানের প্রিন্ট টেমপ্লেট ব্রাউজ করুন অথবা সরাসরি নিজেই কাস্টমাইজ করুন।',
    'portfolio.filterAll': 'সকল ডিজাইন',
    'portfolio.idTitle': 'লাইভ আইডি কার্ড কাস্টমাইজার',
    'portfolio.idSub': 'একটি লেআউট বেছে নিন, তথ্যগুলো পরিবর্তন করুন এবং অর্ডার করতে "ডিজাইন প্রয়োগ ও অর্ডার করুন" বাটনে ক্লিক করুন।',
    'portfolio.bannerTitle': 'লাইভ ব্যানার কাস্টমাইজার',
    'portfolio.bannerSub': 'একটি থিম লেআউট বেছে নিন, টাইটেল ও অফার টেক্সটগুলো কাস্টমাইজ করুন এবং অর্ডার করতে বাটনে ক্লিক করুন।',
    'portfolio.frontSide': 'সামনের দিক',
    'portfolio.backSide': 'পেছনের দিক',
    'portfolio.chooseStyle': '১. আইডি কার্ডের স্টাইল নির্বাচন করুন',
    'portfolio.chooseBannerStyle': '১. ব্যানারের থিম প্রিসেট নির্বাচন করুন',
    'portfolio.personalizeDetails': '২. কার্ডহোল্ডারের তথ্য পরিবর্তন করুন',
    'portfolio.personalizeBanner': '২. ব্যানার টাইটেল ও অফারের তথ্য পরিবর্তন করুন',
    'portfolio.profilePhoto': '৩. প্রোফাইল ছবি নির্বাচন করুন',
    'portfolio.ratioSize': 'সাইজ অনুপাত:',
    'portfolio.orgName': 'প্রতিষ্ঠান / সংস্থার নাম',
    'portfolio.brandLogo': 'সংক্ষিপ্ত ব্র্যান্ড লোগো টেক্সট',
    'portfolio.accentColor': 'মূল থিম কালার',
    'portfolio.fullName': 'পূর্ণ নাম',
    'portfolio.designation': 'পদবী / দায়িত্ব / শ্রেণী-রোল',
    'portfolio.idNo': 'আইডি নম্বর / রোল কোড',
    'portfolio.bloodGroup': 'রক্তের গ্রুপ',
    'portfolio.emergencyPhone': 'জরুরি যোগাযোগের ফোন নম্বর',
    'portfolio.bannerHighlight': 'হাইলাইট ট্যাগ / বিশেষ ব্যাজ',
    'portfolio.bannerMainTitle': 'মূল ব্যানার টাইটেল / বড় হেডলাইন',
    'portfolio.bannerPromo': 'প্রোমো সাবটাইটেল / অফারের বিস্তারিত',
    'portfolio.bannerDate': 'তারিখ / সময়সূচী',
    'portfolio.bannerContact': 'যোগাযোগের ফোন নম্বর',
    'portfolio.bannerBg': 'ব্যানারের ব্যাকগ্রাউন্ড কালার',
    'portfolio.bannerText': 'ব্যানারের হেডলাইনের টেক্সট কালার',
    'portfolio.grommetsMsg': 'ব্যানারগুলো রোদ-বৃষ্টি প্রতিরোধী হেভি স্টার ফ্লেক্সে রিঙে সজ্জ্বিত করে প্রিন্ট করা হয়',
    'portfolio.pvcMsg': 'আইডি কার্ডগুলো প্রিমিয়াম ৩০-মিল হাই-গ্লস পিভিসিতে রিবনসহ প্রিন্ট করা হয়',
    'portfolio.aspectWide': '৩:১ (চওড়া)',
    'portfolio.aspectClassic': '২:১ (স্বাভাবিক)',
    'portfolio.aspectPano': '৪:১ (প্যানোরামিক)',

    // Order Now Page
    'order.title': 'আপনার কাস্টম অর্ডার সম্পন্ন করুন',
    'order.subtitle': 'আপনার ফাইল এবং প্রয়োজনীয় সাইজের বিবরণ দিন, অথবা সরাসরি নির্ধারিত সেবা নির্বাচন করুন।',
    'order.lblService': 'প্রিন্টিং সেবা নির্বাচন করুন',
    'order.lblQty': 'পরিমাণ লিখুন',
    'order.lblColor': 'রঙের ধরণ',
    'order.lblPhone': 'সচল মোবাইল নম্বর',
    'order.lblFile': 'ফাইল বা ছবি সংযুক্ত করুন',
    'order.lblInstructions': 'অতিরিক্ত নির্দেশনা (যদি থাকে)',
    'order.secEstimated': 'মূল্যের আনুমানিক হিসাব',
    'order.estPrice': 'আনুমানিক বেস টোটাল',
    'order.estDelivery': 'আনুমানিক ডেলিভারি সময়',
    'order.estDays': 'আজকেই অথবা সর্বোচ্চ আগামীকালের মধ্যে',
    'order.btnSubmitOrder': 'প্রিন্ট অর্ডার জমা দিন',
    'order.phInstructions': 'অনুগ্রহ করে সাইজ, রঙ, কাগজের ধরন উল্লেখ করুন অথবা এখানে কাস্টম টুলস থেকে তৈরি নির্দেশনা পেস্ট করুন...',

    // Track Page
    'track.title': 'আপনার অর্ডার ট্র্যাক করুন',
    'track.subtitle': 'রিয়েল-টাইম কাজের অগ্রগতি, অপারেটরের মন্তব্য এবং পেমেন্ট স্ট্যাটাস দেখুন।',
    'track.lblOrderId': 'অর্ডার আইডি লিখুন',
    'track.btnSubmit': 'অর্ডার স্ট্যাটাস খুঁজুন',
    'track.status': 'বর্তমান অগ্রগতি',
    'track.remarks': 'অপারেটরের মন্তব্য',
    'track.cost': 'মোট বিল',
    'track.pvcQty': 'পরিমাণ',

    // About Page
    'about.title': 'শাকিল ডিজিটাল প্রিন্টার্স সম্পর্কে',
    'about.subtitle': 'প্রতিষ্ঠার পর থেকেই মাহমুদপুর এবং মেলান্দহ বাজারে সততা ও দক্ষতার সাথে সেবা দিয়ে আসছে।',
    'about.mission': 'আমাদের লক্ষ্য',
    'about.missionDesc': 'মেলান্দহ ও মাহমুদপুর এলাকার ব্যবসায়ী ও জনসাধারণের জন্য বিশ্বমানের প্রিন্টিং সেবা অত্যন্ত কম মূল্যে নিশ্চিত করা।',
    'about.tech': 'আমাদের আধুনিক যন্ত্রপাতি',
    'about.techDesc': 'আমরা জাপানি প্লটার, কনিকাল ডিজিটাল প্রেস মেশিন এবং উচ্চ রেজুলেশনের থার্মো-গ্রাফিক ক্যামেরা ব্যবহার করি।',

    // Contact Page
    'contact.title': 'আমাদের সাথে যোগাযোগ করুন',
    'contact.subtitle': 'কাস্টম ডিজাইন অথবা ব্যানার তৈরির জন্য আমাদের সরাসরি মেসেজ করুন বা আমাদের ঠিকানায় চলে আসুন।',
    'contact.formName': 'আপনার নাম',
    'contact.formEmail': 'ইমেইল অ্যাড্রেস',
    'contact.formPhone': 'ফোন নম্বর',
    'contact.formMsg': 'মেসেজ / বিস্তারিত তথ্য',
    'contact.btnSend': 'মেসেজ পাঠান',

    // Footer
    'footer.summary': 'মেলান্দহ বাজারের শীর্ষস্থানীয় ডিজিটাল প্রিন্টিং ও স্টুডিও। আমরা দিচ্ছি উন্নত মানের ছবি প্রিন্ট, দ্রুত ফটোকপি ও ডকুমেন্ট প্রস্তুত, আকর্ষণীয় বিয়ের কার্ড ডিজাইন এবং ফ্লেক্স ব্যানার প্রিন্ট সুবিধা।',
    'footer.adminHeader': 'অ্যাডমিনিস্ট্রেশন',
    'footer.adminDesc': 'অনুমোদিত অপারেটররা লগইন করে অর্ডার ও ইনভেন্টরি পর্যবেক্ষণ করতে পারবেন।',
    'footer.rights': 'সর্বস্বত্ব সংরক্ষিত। বাংলাদেশে তৈরি।'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('shakil_lang');
    if (savedLang === 'en' || savedLang === 'bn') {
      setLanguageState(savedLang as Language);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shakil_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
