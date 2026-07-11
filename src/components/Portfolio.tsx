import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, Info, X, Sparkles, User, Building, CreditCard, Check, 
  RefreshCw, Upload, Phone, QrCode, ShieldCheck, Heart, Award,
  Megaphone, Percent, MapPin, Calendar, Clock, Flag, Tag
} from 'lucide-react';
import { GalleryItem } from '../types';
import { useLanguage } from '../LanguageContext';

interface PortfolioProps {
  galleryItems: GalleryItem[];
  onNavigate?: (page: string, params?: any) => void;
}

const BANNER_TEMPLATES = [
  {
    id: 'store',
    name: 'Retail & Store Promotion',
    defaultTitle: 'GRAND WINTER SALE',
    defaultSubtitle: 'GET FLAT 50% CASHBACK ON ALL CARD PURCHASES',
    defaultDate: 'OFFER VALID UNTIL END OF THE MONTH',
    defaultBgColor: '#dc2626', // Deep Red
    defaultTextColor: '#ffffff',
    tagline: 'BIGGEST ANNUAL FESTIVAL'
  },
  {
    id: 'event',
    name: 'Concert & Festival Nights',
    defaultTitle: 'EID FESTIVAL NIGHT',
    defaultSubtitle: 'LIVE MUSICAL SHOWS, MULTI-CUISINE FOOD & GAME STALLS',
    defaultDate: 'FRIDAY NIGHT FROM 4:00 PM TO 11:30 PM',
    defaultBgColor: '#1e3a8a', // Deep Blue
    defaultTextColor: '#fef08a', // Pale Yellow
    tagline: 'ENTRY TICKETS ABSOLUTELY FREE'
  },
  {
    id: 'campaign',
    name: 'Election / Social Campaign',
    defaultTitle: 'ELECT SHAKIL AHMED',
    defaultSubtitle: 'YOUR FAITHFUL, DEVOTED SERVANT FOR MELANDAH BAZAR DEVELOPMENT',
    defaultDate: 'VOTE ON THE COMING GENERAL SELECTION',
    defaultBgColor: '#15803d', // Deep Green
    defaultTextColor: '#ffffff',
    tagline: 'HONEST, TRANSPARENT & RELIABLE'
  },
  {
    id: 'services',
    name: 'Studio & Services Promo',
    defaultTitle: 'SHAKIL DIGITAL STUDIO',
    defaultSubtitle: 'PRISTINE PHOTO PORTRAITS, FAST WEDDING CARDS & FLEX SIGNAGE',
    defaultDate: 'OPEN EVERY SAT-THU: 9 AM - 10 PM',
    defaultBgColor: '#f97316', // Orange
    defaultTextColor: '#ffffff',
    tagline: 'MAHMUDPUR ROAD - MELANDAH'
  }
];

const TEMPLATES = [
  {
    id: 'corporate',
    name: 'Corporate Professional',
    defaultOrg: 'Apex Software Lab',
    defaultRole: 'Lead UI/UX Designer',
    defaultColor: '#2563eb', // Blue
    defaultLogo: 'APEX',
    tagline: 'SECURE STAFF PASS'
  },
  {
    id: 'student',
    name: 'Academic Student Pass',
    defaultOrg: 'Melandah Govt College',
    defaultRole: 'Class XII (Science)',
    defaultColor: '#16a34a', // Green
    defaultLogo: 'MGC',
    tagline: 'STUDENT IDENTITY'
  },
  {
    id: 'press',
    name: 'Press / Media Badge',
    defaultOrg: 'Dhaka Post Media',
    defaultRole: 'Senior Reporter',
    defaultColor: '#dc2626', // Red
    defaultLogo: 'PRESS',
    tagline: 'OFFICIAL MEDIA PASS'
  },
  {
    id: 'health',
    name: 'Healthcare Provider',
    defaultOrg: 'City Medical Center',
    defaultRole: 'Registered Nurse (ICU)',
    defaultColor: '#0d9488', // Teal
    defaultLogo: 'CARE',
    tagline: 'MEDICAL STAFF'
  }
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
];

export default function Portfolio({ galleryItems, onNavigate }: PortfolioProps) {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null);

  // ID Card Customizer States
  const [selectedTemplate, setSelectedTemplate] = useState('corporate');
  const [fullName, setFullName] = useState('Tahmid Hasan');
  const [orgName, setOrgName] = useState('Apex Software Lab');
  const [role, setRole] = useState('Lead UI/UX Designer');
  const [idNumber, setIdNumber] = useState('SPS-2026-9042');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [phone, setPhone] = useState('01936-488304');
  const [logoText, setLogoText] = useState('APEX');
  const [customColor, setCustomColor] = useState('#2563eb');
  const [photoUrl, setPhotoUrl] = useState(PRESET_AVATARS[0]);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');

  // Banner Customizer States
  const [selectedBannerTemplate, setSelectedBannerTemplate] = useState('store');
  const [bannerTitle, setBannerTitle] = useState('GRAND WINTER SALE');
  const [bannerSubtitle, setBannerSubtitle] = useState('GET FLAT 50% CASHBACK ON ALL CARD PURCHASES');
  const [bannerDate, setBannerDate] = useState('OFFER VALID UNTIL END OF THE MONTH');
  const [bannerBgColor, setBannerBgColor] = useState('#dc2626');
  const [bannerTextColor, setBannerTextColor] = useState('#ffffff');
  const [bannerTagline, setBannerTagline] = useState('BIGGEST ANNUAL FESTIVAL');
  const [bannerContact, setBannerContact] = useState('01936-488304');
  const [bannerAspect, setBannerAspect] = useState<'3:1' | '2:1' | '4:1'>('3:1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters = ['All', 'Banner', 'Business Card', 'Photo Print', 'Flex', 'ID Card', 'Wedding Cards'];

  const filteredItems = galleryItems.filter(item => {
    return activeFilter === 'All' || item.category === activeFilter;
  });

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setOrgName(tmpl.defaultOrg);
      setRole(tmpl.defaultRole);
      setCustomColor(tmpl.defaultColor);
      setLogoText(tmpl.defaultLogo);
      if (templateId === 'corporate') {
        setIdNumber('SPS-2026-9042');
        setBloodGroup('O+');
      } else if (templateId === 'student') {
        setIdNumber('ROLL-20412');
        setBloodGroup('A+');
      } else if (templateId === 'press') {
        setIdNumber('PRESS-9021');
        setBloodGroup('B+');
      } else if (templateId === 'health') {
        setIdNumber('HOSP-5512');
        setBloodGroup('AB+');
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOrderCustomDesign = () => {
    if (!onNavigate) return;
    
    const instructions = `
====================================
CUSTOM PVC ID CARD PRINT DESIGN ORDER
====================================
Template Style: ${TEMPLATES.find(t => t.id === selectedTemplate)?.name || selectedTemplate}
Organization/Institution Name: ${orgName}
Cardholder Full Name: ${fullName}
Designation / Role / Class: ${role}
ID / Student Roll Number: ${idNumber}
Blood Group: ${bloodGroup}
Emergency Contact Phone: ${phone}
Primary Theme Accent Color: ${customColor}
Brand/Logo Short Text: ${logoText}
====================================
Note: Please use the online generated layout for high-gamut PVC printing.
`;

    onNavigate('order', {
      serviceId: 's9', // ID Card Printing
      quantity: 1,
      colorOption: 'Color',
      additionalInstructions: instructions.trim()
    });
  };

  const handleBannerTemplateChange = (templateId: string) => {
    setSelectedBannerTemplate(templateId);
    const tmpl = BANNER_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setBannerTitle(tmpl.defaultTitle);
      setBannerSubtitle(tmpl.defaultSubtitle);
      setBannerDate(tmpl.defaultDate);
      setBannerBgColor(tmpl.defaultBgColor);
      setBannerTextColor(tmpl.defaultTextColor);
      setBannerTagline(tmpl.tagline);
    }
  };

  const handleOrderCustomBanner = () => {
    if (!onNavigate) return;
    
    const instructions = `
====================================
CUSTOM PRINTED FLEX BANNER ORDER
====================================
Template Style: ${BANNER_TEMPLATES.find(t => t.id === selectedBannerTemplate)?.name || selectedBannerTemplate}
Main Title/Headline: ${bannerTitle}
Subtitle / Promotional Offer: ${bannerSubtitle}
Event Date / Timing: ${bannerDate}
Top Highlight Tagline: ${bannerTagline}
Contact Number: ${bannerContact}
Banner Aspect Ratio (Proportion): ${bannerAspect}
Primary Banner Background Color: ${bannerBgColor}
Secondary Banner Text Color: ${bannerTextColor}
====================================
Note: Please scale-to-fit for professional digital commercial flex plotter printing.
`;

    onNavigate('order', {
      serviceId: 's1', // Banner/Flex printing
      quantity: 1,
      colorOption: 'Color',
      additionalInstructions: instructions.trim()
    });
  };

  // Barcode visualization representation
  const Barcode = () => (
    <div className="flex justify-center items-end space-x-[2px] h-9 bg-white p-1 rounded border border-slate-200 mt-1 select-none">
      <div className="w-[1.5px] h-full bg-slate-900" />
      <div className="w-[3px] h-full bg-slate-900" />
      <div className="w-[1px] h-full bg-slate-900" />
      <div className="w-[2.5px] h-full bg-slate-900" />
      <div className="w-[1px] h-full bg-slate-900" />
      <div className="w-[4px] h-full bg-slate-900" />
      <div className="w-[2px] h-full bg-slate-900" />
      <div className="w-[1px] h-full bg-slate-900" />
      <div className="w-[3.5px] h-full bg-slate-900" />
      <div className="w-[1px] h-full bg-slate-900" />
      <div className="w-[2px] h-full bg-slate-900" />
      <div className="w-[1px] h-full bg-slate-900" />
      <div className="w-[4px] h-full bg-slate-900" />
      <div className="w-[1.5px] h-full bg-slate-900" />
      <div className="w-[2.5px] h-full bg-slate-900" />
      <div className="w-[3.5px] h-full bg-slate-900" />
      <div className="w-[1px] h-full bg-slate-900" />
    </div>
  );

  // QR Code representation
  const QRCodePattern = () => (
    <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-200 flex flex-col justify-between shrink-0 select-none">
      <div className="grid grid-cols-5 gap-[1.5px] w-full h-full">
        {Array.from({ length: 25 }).map((_, i) => {
          const isCorner = 
            (i < 3 || (i % 5 < 3 && i < 15)) || 
            (i % 5 >= 3 && i < 3) || 
            (i >= 20 && i % 5 < 3);
          const fill = isCorner || ((i * 7 + 13) % 11 > 4);
          return (
            <div 
              key={i} 
              className={`w-full h-full rounded-[1px] ${fill ? 'bg-slate-950' : 'bg-transparent'}`}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          {t('portfolio.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          {t('portfolio.subtitle')}
        </p>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2 justify-center bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm max-w-4xl mx-auto">
        {filters.map(filter => {
          const label = filter === 'All' ? t('portfolio.filterAll') : (
            filter === 'Banner' ? (isEn ? 'Banner' : 'ব্যানার') :
            filter === 'Business Card' ? (isEn ? 'Business Card' : 'বিজনেস কার্ড') :
            filter === 'Photo Print' ? (isEn ? 'Photo Print' : 'ফটো প্রিন্ট') :
            filter === 'Flex' ? (isEn ? 'Flex' : 'ফ্লেক্স ব্যানার') :
            filter === 'ID Card' ? (isEn ? 'ID Card' : 'আইডি কার্ড') :
            filter === 'Wedding Cards' ? (isEn ? 'Wedding Cards' : 'আমন্ত্রণ পত্র') : filter
          );
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Interactive Banner Designer (Only shown when Banner filter is active) */}
      <AnimatePresence>
        {activeFilter === 'Banner' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 shadow-md space-y-8"
          >
            {/* Header / Intro inside block */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
                  <Megaphone size={18} className="animate-bounce" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">{isEn ? "Live Flex Banner Customizer" : "লাইভ ফ্লেক্স ব্যানার কাস্টমাইজার"}</span>
                </div>
                <h2 className="text-2xl font-black font-display text-slate-800 dark:text-white">
                  {t('portfolio.bannerTitle')}
                </h2>
                <p className="text-xs text-slate-400 font-light">
                  {t('portfolio.bannerSub')}
                </p>
              </div>

              {/* Ratio toggle */}
              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0 self-start md:self-center">
                <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono">{t('portfolio.ratioSize')}</span>
                {(['3:1', '2:1', '4:1'] as const).map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => setBannerAspect(ratio)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      bannerAspect === ratio
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {ratio === '3:1' ? t('portfolio.aspectWide') : ratio === '2:1' ? t('portfolio.aspectClassic') : t('portfolio.aspectPano')}
                  </button>
                ))}
              </div>
            </div>

            {/* Split layout: Controls / Live Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column - Controls (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* 1. Layout Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
                    {t('portfolio.chooseBannerStyle')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {BANNER_TEMPLATES.map(tmpl => {
                      const isActive = selectedBannerTemplate === tmpl.id;
                      const displayName = isEn ? tmpl.name : (
                        tmpl.id === 'store' ? 'স্টোর প্রোমোশন ব্যানার' :
                        tmpl.id === 'event' ? 'কনসার্ট ও উৎসব ব্যানার' :
                        tmpl.id === 'campaign' ? 'নির্বাচনী প্রচার ব্যানার' :
                        'স্টুডিও ও সার্ভিস প্রোমো'
                      );
                      const displayTagline = isEn ? tmpl.tagline : (
                        tmpl.id === 'store' ? 'সবচেয়ে বড় বার্ষিক মেলা' :
                        tmpl.id === 'event' ? 'প্রবেশ মূল্য সম্পূর্ণ ফ্রি' :
                        tmpl.id === 'campaign' ? 'সৎ, যোগ্য ও নির্ভরযোগ্য' :
                        'মাহমুদপুর রোড - মেলান্দহ'
                      );
                      return (
                        <button
                          key={tmpl.id}
                          onClick={() => handleBannerTemplateChange(tmpl.id)}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                            isActive
                              ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <span 
                            className="absolute right-0 top-0 w-8 h-8 rounded-bl-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-10"
                            style={{ backgroundColor: tmpl.defaultBgColor }}
                          />
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {displayName}
                          </h4>
                          <span className="text-[9px] text-slate-400 block mt-0.5 font-mono truncate">
                            {displayTagline}
                          </span>
                          {isActive && (
                            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                              <Check size={8} className="stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Text Fields */}
                <div className="space-y-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
                    {t('portfolio.personalizeBanner')}
                  </span>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {t('portfolio.bannerHighlight')}
                      </label>
                      <div className="relative">
                        <Tag size={13} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={bannerTagline}
                          onChange={e => setBannerTagline(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          maxLength={40}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {t('portfolio.bannerMainTitle')}
                      </label>
                      <div className="relative">
                        <Sparkles size={13} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={bannerTitle}
                          onChange={e => setBannerTitle(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-black focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {t('portfolio.bannerPromo')}
                      </label>
                      <input
                        type="text"
                        value={bannerSubtitle}
                        onChange={e => setBannerSubtitle(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                        maxLength={80}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          Date / Timing Info
                        </label>
                        <input
                          type="text"
                          value={bannerDate}
                          onChange={e => setBannerDate(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          Emergency / Contact Phone
                        </label>
                        <input
                          type="text"
                          value={bannerContact}
                          onChange={e => setBannerContact(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          maxLength={20}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          Banner Background Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={bannerBgColor}
                            onChange={e => setBannerBgColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <span className="text-[10px] font-mono text-slate-400">{bannerBgColor.toUpperCase()}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          Banner Headline Text Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={bannerTextColor}
                            onChange={e => setBannerTextColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <span className="text-[10px] font-mono text-slate-400">{bannerTextColor.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column - Live Render Box (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center py-6 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 p-4 relative overflow-hidden min-h-[500px]">
                
                {/* Background decorative elements */}
                <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-pink-500/5 blur-2xl pointer-events-none" />

                {/* Simulated Metal Grommets / Hanging Eyelets frame around the flex */}
                <div className="w-full max-w-[500px] bg-slate-300/30 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-300 dark:border-slate-800 shadow-xl relative">
                  
                  {/* Metal eyelets representation on top corners */}
                  <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-slate-950" />
                  </div>
                  <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-slate-950" />
                  </div>
                  <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-slate-950" />
                  </div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600 border border-slate-500 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-slate-800 dark:bg-slate-950" />
                  </div>

                  {/* Dynamic aspect ratio viewport */}
                  <div 
                    className="w-full overflow-hidden rounded-xl shadow-inner relative flex flex-col justify-between p-6 text-center select-none"
                    style={{
                      backgroundColor: bannerBgColor,
                      color: bannerTextColor,
                      aspectRatio: bannerAspect === '3:1' ? '3/1' : bannerAspect === '2:1' ? '2/1' : '4/1',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Artistic banner background vectors */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
                      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white to-transparent" />
                      <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-black to-transparent" />
                    </div>

                    {/* Corner decorative golden shapes for store & event */}
                    {(selectedBannerTemplate === 'store' || selectedBannerTemplate === 'event') && (
                      <>
                        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400 opacity-60" />
                        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400 opacity-60" />
                        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 opacity-60" />
                        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400 opacity-60" />
                      </>
                    )}

                    {/* Campaign flags for political */}
                    {selectedBannerTemplate === 'campaign' && (
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-red-600 via-white to-green-600 opacity-80" />
                    )}

                    {/* Header: Tagline / Highlight */}
                    <div className="z-10 flex justify-center">
                      <span className="px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-white text-slate-900 border border-slate-200 shadow-sm inline-block">
                        {bannerTagline || 'OFFICIAL PROMO'}
                      </span>
                    </div>

                    {/* Body: Title & Subtitle */}
                    <div className="z-10 my-auto py-2 space-y-1">
                      <h3 
                        className="font-black tracking-tight leading-none uppercase font-display select-text"
                        style={{ 
                          fontSize: bannerAspect === '4:1' ? '1.4rem' : bannerAspect === '3:1' ? '1.8rem' : '2.1rem',
                          color: bannerTextColor
                        }}
                      >
                        {bannerTitle}
                      </h3>
                      <p 
                        className="font-semibold tracking-wide max-w-md mx-auto line-clamp-2 leading-tight"
                        style={{
                          fontSize: bannerAspect === '4:1' ? '0.65rem' : '0.8rem',
                          opacity: 0.95
                        }}
                      >
                        {bannerSubtitle}
                      </p>
                    </div>

                    {/* Footer: Date & Contact */}
                    <div className="z-10 pt-1 border-t border-white/10 flex flex-wrap justify-between items-center text-[8px] font-bold tracking-wider font-mono opacity-90 gap-1">
                      <div className="flex items-center space-x-1">
                        <Calendar size={10} />
                        <span className="uppercase">{bannerDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone size={10} />
                        <span>HOTLINE: {bannerContact}</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Action guidelines */}
                <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400 font-light select-none z-10 bg-white/40 dark:bg-slate-900/40 px-4 py-1.5 rounded-full border border-slate-200/20">
                  <Sparkles size={12} className="text-indigo-500" />
                  <span>Real-time layout adjusts automatically to scale up to 10ft × 3ft PVC vinyls!</span>
                </div>

              </div>

            </div>

            {/* Action buttons footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-light">
                <Info size={16} className="text-yellow-500 animate-pulse" />
                <span>{t('portfolio.grommetsMsg')}</span>
              </div>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOrderCustomBanner}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-indigo-500/10 active:scale-95 animate-pulse"
                >
                  <Sparkles size={14} />
                  <span>{t('btn.applyOrder')}</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive ID Card Designer (Only shown when ID Card filter is active) */}
      <AnimatePresence>
        {activeFilter === 'ID Card' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-6 md:p-8 shadow-md space-y-8"
          >
            {/* Header / Intro inside block */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <Sparkles size={18} className="animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">{isEn ? "Live PVC Customizer" : "লাইভ পিভিসি কাস্টমাইজার"}</span>
                </div>
                <h2 className="text-2xl font-black font-display text-slate-800 dark:text-white">
                  {t('portfolio.idTitle')}
                </h2>
                <p className="text-xs text-slate-400 font-light">
                  {t('portfolio.idSub')}
                </p>
              </div>
              
              <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800 shrink-0 self-start md:self-center">
                <button
                  onClick={() => setCardSide('front')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    cardSide === 'front' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t('portfolio.frontSide')}
                </button>
                <button
                  onClick={() => setCardSide('back')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    cardSide === 'back' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {t('portfolio.backSide')}
                </button>
              </div>
            </div>

            {/* Split layout: Controls / Live Canvas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column - Controls (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* 1. Layout Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
                    {t('portfolio.chooseStyle')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATES.map(tmpl => {
                      const isActive = selectedTemplate === tmpl.id;
                      const displayName = isEn ? tmpl.name : (
                        tmpl.id === 'corporate' ? 'পেশাদার করপোরেট' :
                        tmpl.id === 'student' ? 'অ্যাকাডেমিক স্টুডেন্ট' :
                        tmpl.id === 'press' ? 'প্রেস / মিডিয়া ব্যাজ' :
                        'স্বাস্থ্যকর্মী আইডি'
                      );
                      return (
                        <button
                          key={tmpl.id}
                          onClick={() => handleTemplateChange(tmpl.id)}
                          className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                            isActive
                              ? 'border-blue-600 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <span 
                            className="absolute right-0 top-0 w-8 h-8 rounded-bl-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-10"
                            style={{ backgroundColor: tmpl.defaultColor }}
                          />
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {displayName}
                          </h4>
                          <span className="text-[9px] text-slate-400 block mt-0.5 font-mono truncate">
                            {tmpl.defaultLogo} Template
                          </span>
                          {isActive && (
                            <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center text-white">
                              <Check size={8} className="stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Text Fields */}
                <div className="space-y-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
                    {t('portfolio.personalizeDetails')}
                  </span>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {t('portfolio.orgName')}
                      </label>
                      <div className="relative">
                        <Building size={13} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={orgName}
                          onChange={e => setOrgName(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          maxLength={32}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          {t('portfolio.brandLogo')}
                        </label>
                        <input
                          type="text"
                          value={logoText}
                          onChange={e => setLogoText(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          maxLength={8}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          {t('portfolio.accentColor')}
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={customColor}
                            onChange={e => setCustomColor(e.target.value)}
                            className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden"
                          />
                          <span className="text-[10px] font-mono text-slate-400">{customColor.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {t('portfolio.fullName')}
                      </label>
                      <div className="relative">
                        <User size={13} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          maxLength={24}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {t('portfolio.designation')}
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        maxLength={28}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          {t('portfolio.idNo')}
                        </label>
                        <input
                          type="text"
                          value={idNumber}
                          onChange={e => setIdNumber(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          maxLength={16}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                          {t('portfolio.bloodGroup')}
                        </label>
                        <select
                          value={bloodGroup}
                          onChange={e => setBloodGroup(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-2 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block mb-1">
                        {t('portfolio.emergencyPhone')}
                      </label>
                      <div className="relative">
                        <Phone size={13} className="absolute left-3.5 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          maxLength={15}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Photo selection / custom upload */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 block">
                    {t('portfolio.photoSelect')}
                  </label>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoUrl(url)}
                        className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all relative ${
                          photoUrl === url ? 'border-blue-600 scale-105' : 'border-transparent hover:scale-105'
                        }`}
                      >
                        <img src={url} alt="Preset avatar" className="w-full h-full object-cover" />
                        {photoUrl === url && (
                          <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                            <Check size={12} className="text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-10 h-10 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
                      title="Upload Custom Portrait"
                    >
                      <Upload size={14} />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column - Live Render Box (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center py-6 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/50 dark:border-slate-800/60 p-4 relative overflow-hidden min-h-[500px]">
                
                {/* Background decorative circles */}
                <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
                <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-orange-500/5 blur-2xl pointer-events-none" />

                {/* Card Holder Shell Component */}
                <div className="relative group/card max-w-[280px] w-full">
                  {/* Badge Strap / Holder Attachment representation */}
                  <div className="flex flex-col items-center mb-[-12px] relative z-10 select-none">
                    <div className="w-10 h-3 bg-slate-400 dark:bg-slate-700 rounded-full shadow-sm" />
                    <div className="w-5 h-6 bg-slate-500 dark:bg-slate-600 rounded-md shadow-sm border border-slate-400 dark:border-slate-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-900" />
                    </div>
                  </div>

                  {/* Glass Protective Case frame */}
                  <div className="bg-slate-300/40 dark:bg-slate-800/40 backdrop-blur-sm p-3.5 rounded-[28px] border-2 border-slate-300/50 dark:border-slate-800/80 shadow-2xl relative">
                    
                    {/* Hanger slot */}
                    <div className="w-12 h-2.5 mx-auto bg-slate-800/20 dark:bg-slate-200/20 rounded-full mb-3 select-none" />

                    <AnimatePresence mode="wait">
                      {cardSide === 'front' ? (
                        /* ================== FRONT SIDE ================== */
                        <motion.div
                          key="front"
                          initial={{ rotateY: -90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          exit={{ rotateY: 90, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white dark:bg-slate-900 h-[400px] rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                        >
                          {/* Colored design bands / Ribbons */}
                          <div 
                            className="absolute top-0 left-0 w-full h-24 opacity-20 pointer-events-none" 
                            style={{ 
                              background: `linear-gradient(135deg, ${customColor} 0%, transparent 100%)` 
                            }} 
                          />
                          <div 
                            className="absolute top-0 right-0 w-32 h-20 rounded-bl-full opacity-10 pointer-events-none" 
                            style={{ backgroundColor: customColor }} 
                          />

                          {/* Front Header */}
                          <div className="p-4 flex items-center justify-between z-10 border-b border-slate-100 dark:border-slate-800/60 select-none">
                            <div className="flex items-center space-x-1.5">
                              <div 
                                className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white"
                                style={{ backgroundColor: customColor }}
                              >
                                {logoText.substring(0, 2)}
                              </div>
                              <span className="text-[10px] font-black tracking-wider text-slate-800 dark:text-white uppercase truncate max-w-[130px]">
                                {orgName}
                              </span>
                            </div>
                            
                            {/* Realistic Gold Chip */}
                            <div className="w-5 h-4 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-[3px] border border-yellow-500 flex flex-wrap p-[1px] shadow-sm">
                              <div className="w-1/2 h-1/2 border-r border-b border-yellow-700/40" />
                              <div className="w-1/2 h-1/2 border-b border-yellow-700/40" />
                              <div className="w-1/2 h-1/2 border-r border-yellow-700/40" />
                              <div className="w-1/2 h-1/2" />
                            </div>
                          </div>

                          {/* Front Body */}
                          <div className="flex-grow flex flex-col items-center justify-center px-4 py-3 text-center space-y-3 z-10">
                            
                            {/* Cardholder Portrait Frame */}
                            <div className="relative">
                              <div 
                                className="w-24 h-24 rounded-full p-1 shadow-md bg-white dark:bg-slate-900 border-2"
                                style={{ borderColor: customColor }}
                              >
                                <img 
                                  src={photoUrl} 
                                  alt={fullName} 
                                  className="w-full h-full object-cover rounded-full" 
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div 
                                className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-white border border-white shadow-sm"
                                style={{ backgroundColor: customColor }}
                              >
                                {selectedTemplate === 'corporate' && <Award size={10} />}
                                {selectedTemplate === 'student' && <User size={10} />}
                                {selectedTemplate === 'press' && <ShieldCheck size={10} />}
                                {selectedTemplate === 'health' && <Heart size={10} />}
                              </div>
                            </div>

                            {/* Cardholder Identity Details */}
                            <div className="space-y-1">
                              <h3 
                                className="text-sm font-black font-display uppercase tracking-wide truncate max-w-[210px]"
                                style={{ color: customColor }}
                              >
                                {fullName}
                              </h3>
                              <p className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                                {role}
                              </p>
                            </div>

                            {/* Info Table Details Grid */}
                            <div className="w-full bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-left space-y-1.5 text-[9px] select-none font-mono">
                              <div className="flex justify-between">
                                <span className="text-slate-400">{t('portfolio.idCardNo')}</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold">{idNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">{t('portfolio.bloodGrp')}</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold">{bloodGroup}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">{t('portfolio.emergencyLabel')}</span>
                                <span className="text-slate-700 dark:text-slate-300 font-bold">{phone}</span>
                              </div>
                            </div>
                          </div>

                          {/* Front Footer */}
                          <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40 z-10 flex flex-col space-y-1">
                            <Barcode />
                            <div className="flex justify-between text-[7px] text-slate-400 font-mono">
                              <span>{isEn ? "SECURE PRINT PASS" : "সুরক্ষিত প্রিন্ট পাস"}</span>
                              <span>{isEn ? "* AUTHORIZED SIGNATORY" : "* অনুমোদিত স্বাক্ষরকারী"}</span>
                            </div>
                          </div>

                        </motion.div>
                      ) : (
                        /* ================== BACK SIDE ================== */
                        <motion.div
                          key="back"
                          initial={{ rotateY: 90, opacity: 0 }}
                          animate={{ rotateY: 0, opacity: 1 }}
                          exit={{ rotateY: -90, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white dark:bg-slate-900 h-[400px] rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between"
                        >
                          {/* Back Header */}
                          <div className="space-y-1 text-center select-none">
                            <span 
                              className="text-[8px] uppercase font-bold tracking-widest px-3 py-1 rounded-full text-white inline-block shadow-sm"
                              style={{ backgroundColor: customColor }}
                            >
                              {TEMPLATES.find(t => t.id === selectedTemplate)?.tagline || 'OFFICIAL ID'}
                            </span>
                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 pt-1.5 uppercase truncate">
                              {orgName}
                            </h4>
                          </div>

                          {/* Back Terms of Use & Security Seals */}
                          <div className="my-3 space-y-3 flex-grow flex flex-col justify-center">
                            
                            {/* Security statement */}
                            <div className="text-[8px] leading-normal text-slate-400 font-light space-y-1">
                              <p>
                                {isEn ? `1. This card is non-transferable and remains the absolute property of ` : `১. এই কার্ডটি হস্তান্তরযোগ্য নয় এবং এটি সম্পূর্ণ মালিকানাধীন `} <strong className="text-slate-600 dark:text-slate-300">{orgName}</strong>.
                              </p>
                              <p>
                                {isEn ? "2. Loss or damage of this card must be immediately reported to the authority." : "২. এই কার্ডটির ক্ষতি বা হারিয়ে যাওয়ার তথ্য অবিলম্বে কর্তৃপক্ষকে জানাতে হবে।"}
                              </p>
                              <p>
                                {isEn ? "3. If found, please return to: " : "৩. সন্ধান পাওয়া গেলে দয়া করে এই ঠিকানায় ফেরত দিন: "} <strong className="text-slate-600 dark:text-slate-300">{isEn ? "Mahmudpur road- Melandah Bazar" : "মাহমুদপুর রোড- মেলান্দহ বাজার"}</strong>.
                              </p>
                            </div>

                            {/* Split QR & Sign */}
                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                              <QRCodePattern />
                              
                              {/* Signature block */}
                              <div className="text-right space-y-1 flex-grow">
                                <div className="border-b border-slate-300 dark:border-slate-700 pb-1 relative">
                                  <span className="font-serif italic text-xs text-slate-500 select-none block transform -rotate-3 leading-none h-4">
                                    {isEn ? `${fullName.split(' ')[0]} Sign` : `${fullName.split(' ')[0]} এর স্বাক্ষর`}
                                  </span>
                                </div>
                                <span className="text-[6px] uppercase text-slate-400 font-mono tracking-wider block">
                                  {isEn ? "AUTHORIZED SIGNATURE" : "অনুমোদিত স্বাক্ষর"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Back Footer strip */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center select-none">
                            <span className="text-[8px] font-bold text-slate-400 font-mono">
                              {isEn ? "PRINTED AT SHAKIL DIGITAL PRINTERS" : "শাকিল ডিজিটাল প্রিন্টারে মুদ্রিত"}
                            </span>
                            <p className="text-[7px] text-slate-300 dark:text-slate-500 font-mono mt-0.5">
                              01936-488304 | info@shakildigitalprinters.com
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Switch side instructions overlay */}
                <div className="mt-4 flex items-center space-x-2 text-xs text-slate-400 font-light select-none z-10 bg-white/40 dark:bg-slate-900/40 px-4 py-1.5 rounded-full border border-slate-200/20">
                  <RefreshCw size={12} className="text-blue-500 animate-spin-slow" />
                  <span>{isEn ? "Use the header buttons to switch Front & Back views" : "সামনের ও পিছনের দিক দেখতে উপরের বোতাম ব্যবহার করুন"}</span>
                </div>

              </div>

            </div>

            {/* Action buttons footer */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-slate-400 text-xs font-light">
                <Info size={16} className="text-orange-500 animate-pulse" />
                <span>{isEn ? "Orders are printed on premium 30-mil high-gloss PVC with lanyards included" : "অর্ডারগুলো প্রিমিয়াম ৩০-মিল হাই-গ্লস পিভিসি এবং ফিতাসহ প্রিন্ট করা হয়"}</span>
              </div>
              
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOrderCustomDesign}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 active:scale-95 animate-pulse"
                >
                  <Sparkles size={14} />
                  <span>{t('btn.applyOrder')}</span>
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.03 }}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
            >
              {/* Image box */}
              <div className="aspect-4/3 overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                  <button
                    onClick={() => setLightboxImage(item)}
                    className="p-3 bg-white text-slate-900 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
                  >
                    <Eye size={20} />
                  </button>
                </div>
              </div>

              {/* Details card */}
              <div className="p-5">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full">
                  {item.category}
                </span>
                <h3 className="font-semibold text-slate-800 dark:text-white mt-3 text-base">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Portfolio Info Footer Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white p-8 rounded-3xl shadow-lg border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Sparkles className="text-orange-400" size={18} />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">{isEn ? "Premium Customization" : "প্রিমিয়াম কাস্টমাইজেশন"}</span>
          </div>
          <h4 className="text-xl font-bold font-display">{isEn ? "Seen something you like?" : "আপনার পছন্দসই কিছু দেখেছেন?"}</h4>
          <p className="text-sm text-blue-200 font-light max-w-2xl">
            {isEn ? "We can replicate any layout style or design pattern tailored for your customized business specifications. Just click to order and attach your layout reference." : "আমরা আপনার কাস্টমাইজড বিজনেস স্পেসিফিকেশন অনুযায়ী যেকোনো লেআউট স্টাইল বা ডিজাইন প্যাটার্ন তৈরি করতে পারি। অর্ডার করতে ক্লিক করুন এবং আপনার রেফারেন্স লেআউট সংযুক্ত করুন।"}
          </p>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shrink-0"
        >
          {isEn ? "Place Order Custom Style" : "কাস্টম স্টাইল অর্ডার করুন"}
        </button>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="aspect-16/10 relative">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6 bg-slate-900 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400 font-mono">
                    {lightboxImage.category}
                  </span>
                  <h3 className="text-xl font-bold font-display text-white mt-1">
                    {lightboxImage.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 text-slate-400 text-xs font-light">
                  <Info size={16} className="text-orange-400" />
                  <span>{isEn ? "Real print output captured under studio lighting" : "স্টুডিও লাইটের নিচে ধারণকৃত বাস্তব প্রিন্ট আউটপুট"}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
