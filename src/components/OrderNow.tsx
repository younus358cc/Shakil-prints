import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, UploadCloud, File, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, Loader2, Sparkles, Printer } from 'lucide-react';
import { Service, PriceItem } from '../types';
import { useLanguage } from '../LanguageContext';

interface OrderNowProps {
  services: Service[];
  prices: PriceItem[];
  prefilledParams?: {
    serviceId?: string;
    quantity?: number;
    colorOption?: 'Color' | 'Black & White';
    additionalInstructions?: string;
    selectedFile?: { name: string; size: string; data: string };
  };
  onOrderSuccess: (orderId: string) => void;
  onNavigate: (page: string) => void;
}

export default function OrderNow({ services, prices, prefilledParams, onOrderSuccess, onNavigate }: OrderNowProps) {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [paperSize, setPaperSize] = useState('A4');
  const [colorOption, setColorOption] = useState<'Color' | 'Black & White'>('Color');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  
  // File upload state
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; data: string } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Pre-fill parameters if supplied
  useEffect(() => {
    if (prefilledParams) {
      if (prefilledParams.serviceId) setServiceId(prefilledParams.serviceId);
      if (prefilledParams.quantity) setQuantity(prefilledParams.quantity);
      if (prefilledParams.colorOption) setColorOption(prefilledParams.colorOption);
      if (prefilledParams.additionalInstructions) setAdditionalInstructions(prefilledParams.additionalInstructions);
      if (prefilledParams.selectedFile) setSelectedFile(prefilledParams.selectedFile);
    }
  }, [prefilledParams]);

  // Paper Sizes options depending on selected service
  const getPaperSizes = () => {
    const srv = services.find(s => s.id === serviceId);
    if (!srv) return ['Standard'];
    if (srv.name === 'Photo Printing') return ['4R (4x6)', '5R (5x7)', 'A4 (8x12)', 'Passport Size'];
    if (srv.name === 'Passport Size Photos') return ['Passport (Set of 8)', 'Stamp (Set of 12)'];
    if (srv.name === 'Banner Printing' || srv.name === 'Flex Printing') return ['Per Sq. Ft.'];
    if (srv.name === 'Business Card Printing') return ['Standard (3.5x2)'];
    if (srv.name === 'ID Card Printing') return ['Standard ID'];
    return ['A4', 'Letter', 'Legal', 'A3', 'Custom'];
  };

  // Pre-select first paper size when service changes
  useEffect(() => {
    const sizes = getPaperSizes();
    if (sizes.length > 0 && !sizes.includes(paperSize)) {
      setPaperSize(sizes[0]);
    }
  }, [serviceId]);

  // Compute estimate
  const currentEstimate = () => {
    const srv = services.find(s => s.id === serviceId);
    if (!srv) return 0;
    
    // Check custom price item matches
    const matchingPrice = prices.find(p => p.serviceId === serviceId && p.size === paperSize);
    let baseRate = matchingPrice ? matchingPrice.pricePerUnit : srv.startingPrice;

    if (colorOption === 'Black & White') {
      baseRate = Math.max(2, Math.round(baseRate * 0.4)); // Discount B&W
    }

    let total = baseRate * quantity;
    if (quantity >= 500) {
      total = total * 0.7; // 30% discount
    } else if (quantity >= 100) {
      total = total * 0.85; // 15% discount
    }

    return Math.round(total);
  };

  // Handle File Selection
  const processFile = (file: File) => {
    setUploadError('');
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setUploadError(isEn ? 'Only PDF, JPG, PNG, or DOCX files are allowed.' : 'শুধুমাত্র PDF, JPG, PNG বা DOCX ফাইল অনুমোদিত।');
      return;
    }

    if (file.size > 25 * 1024 * 1024) { // 25MB limit
      setUploadError(isEn ? 'File exceeds 25MB limit.' : 'ফাইলটি ২৫ মেগাবাইটের বেশি বড় হতে পারবে না।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setSelectedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        data: resultStr
      });
    };
    reader.onerror = () => {
      setUploadError(isEn ? 'Failed to parse file.' : 'ফাইল লোড করতে ব্যর্থ হয়েছে।');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!customerName.trim()) return setErrorMsg(isEn ? 'Customer Name is required.' : 'গ্রাহকের নাম আবশ্যক।');
    if (!phoneNumber.trim()) return setErrorMsg(isEn ? 'Phone Number is required.' : 'মোবাইল নম্বর আবশ্যক।');
    if (!deliveryAddress.trim()) return setErrorMsg(isEn ? 'Delivery Address is required.' : 'ডেলিভারি ঠিকানা আবশ্যক।');

    setLoading(true);
    const selectedSrv = services.find(s => s.id === serviceId);

    const payload = {
      customerName,
      phoneNumber,
      email,
      deliveryAddress,
      serviceId,
      serviceName: selectedSrv?.name || 'Printed Service',
      quantity,
      paperSize,
      colorOption,
      fileName: selectedFile?.name || '',
      fileData: selectedFile?.data || '',
      additionalInstructions,
      totalPrice: currentEstimate()
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessOrder(data.order);
        onOrderSuccess(data.order.id);
      } else {
        setErrorMsg(data.message || (isEn ? 'Failed to place order. Try again.' : 'অর্ডার করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।'));
      }
    } catch (err) {
      setErrorMsg(isEn ? 'Network error. Failed to connect to server.' : 'নেটওয়ার্ক ত্রুটি। সার্ভারের সাথে সংযোগ করা সম্ভব হয়নি।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <AnimatePresence mode="wait">
        {!successOrder ? (
          <motion.div
            key="order-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">{isEn ? "Place Online Order" : "অনলাইন অর্ডার করুন"}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{isEn ? "Fill details, upload files, and lock dynamic prices instantly." : "ফর্ম পূরণ করুন, ফাইল আপলোড করুন এবং তাৎক্ষণিকভাবে আপনার সম্ভাব্য মূল্য দেখে নিন।"}</p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Personal Information Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">{isEn ? "1. Customer Information" : "১. গ্রাহকের তথ্য"}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Full Name *" : "সম্পূর্ণ নাম *"}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zahid Hasan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Phone Number *" : "মোবাইল নম্বর *"}</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 01712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Email Address (Optional)" : "ইমেইল অ্যাড্রেস (ঐচ্ছিক)"}</label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Delivery Address *" : "ডেলিভারি ঠিকানা *"}</label>
                    <input
                      type="text"
                      required
                      placeholder={isEn ? "Home address or office sector" : "বাসা বা অফিসের ঠিকানা"}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Printing Configuration Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">{isEn ? "2. Printing Specifications" : "২. প্রিন্টিং স্পেসিফিকেশন"}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Select Service Type" : "সেবার ধরন নির্বাচন করুন"}</label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      {services.map(s => {
                        const displayName = isEn ? s.name : (
                          s.id === '1' ? 'পিভিসি আইডি কার্ড' :
                          s.id === '2' ? 'কাস্টম ফ্লেক্স ব্যানার' :
                          s.id === '3' ? 'লাক্সারি বিজনেস কার্ড' :
                          s.id === '4' ? 'অ্যাকাডেমিক আইডি কার্ড' :
                          s.id === '5' ? 'ডিজিটাল ফটো প্রিন্টিং' :
                          s.id === '6' ? 'আমন্ত্রণ ও ওয়েডিং কার্ড' : s.name
                        );
                        return <option key={s.id} value={s.id}>{displayName}</option>;
                      })}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Quantity (Units)" : "পরিমাণ (সংখ্যা)"}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Paper Size / Scale" : "কাগজের সাইজ / স্কেল"}</label>
                    <select
                      value={paperSize}
                      onChange={(e) => setPaperSize(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                    >
                      {getPaperSizes().map(sz => {
                        const displaySz = isEn ? sz : (
                          sz === 'Passport Size' ? 'পাসপোর্ট সাইজ' :
                          sz === 'Passport (Set of 8)' ? 'পাসপোর্ট (৮টির সেট)' :
                          sz === 'Stamp (Set of 12)' ? 'স্ট্যাম্প (১২টির সেট)' :
                          sz === 'Per Sq. Ft.' ? 'প্রতি বর্গফুট' :
                          sz === 'Standard ID' ? 'স্ট্যান্ডার্ড আইডি' : sz
                        );
                        return <option key={sz} value={sz}>{displaySz}</option>;
                      })}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Color Profile" : "রঙের প্রোফাইল"}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Color', 'Black & White'] as const).map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setColorOption(opt)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            colorOption === opt
                              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {opt === 'Color' ? (isEn ? 'Color' : 'রঙিন') : (isEn ? 'Black & White' : 'সাদাকালো')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Upload & instructions */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider font-mono">{isEn ? "3. Document Upload & Notes" : "৩. ডকুমেন্ট আপলোড ও বিশেষ নির্দেশনা"}</h3>

                {/* Drag and drop panel */}
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${
                    dragActive 
                      ? 'border-blue-500 bg-blue-500/5' 
                      : selectedFile 
                        ? 'border-emerald-500 bg-emerald-500/5' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                    onChange={handleFileChange}
                  />

                  {!selectedFile ? (
                    <div className="space-y-2">
                      <UploadCloud size={36} className="text-slate-400 mx-auto" />
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{isEn ? "Drag and drop file here, or click to browse" : "ডকুমেন্ট ফাইল ড্র্যাগ করে এখানে ড্রপ করুন অথবা ব্রাউজ করতে ক্লিক করুন"}</p>
                      <p className="text-xs text-slate-400">{isEn ? "Supports PDF, JPG, PNG, DOCX up to 25MB" : "পিডিএফ, জেপিজি, পিএনজি, ডক ফাইল সর্বোচ্চ ২৫ মেগাবাইট পর্যন্ত গ্রহণযোগ্য"}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-emerald-500/20 rounded-xl p-3 max-w-md mx-auto">
                      <div className="flex items-center space-x-3 text-left">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg shrink-0">
                          <File size={20} />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[180px]">{selectedFile.name}</p>
                          <p className="text-[10px] text-slate-400">{selectedFile.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                           setSelectedFile(null);
                        }}
                        className="text-xs font-bold text-rose-500 hover:text-rose-600 px-2 py-1 bg-rose-50 dark:bg-rose-950/20 rounded"
                      >
                        {isEn ? "Remove" : "মুছে ফেলুন"}
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-rose-500 text-xs mt-2 font-medium">{uploadError}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{isEn ? "Additional Instructions" : "বিশেষ কোনো নির্দেশনা"}</label>
                  <textarea
                    rows={3}
                    placeholder={isEn ? "Provide binding specifications, matte/glossy preference, crop details, etc..." : "বই বাঁধাইয়ের বিবরণ, পেপারের ধরন (ম্যাট/গ্লসি) বা অন্যান্য প্রয়োজনীয় নির্দেশনাবলী লিখুন..."}
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-sm transition-all hover:scale-101 shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 disabled:bg-slate-400 disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{isEn ? "Uploading File & Processing Order..." : "ফাইল আপলোড এবং অর্ডার প্রসেস করা হচ্ছে..."}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>{isEn ? `Confirm Order Now - ৳${currentEstimate()}` : `এখনই অর্ডার নিশ্চিত করুন - ৳${currentEstimate()}`}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Dynamic visual price helper widget */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-tr from-blue-900 to-indigo-950 text-white rounded-3xl p-6 border border-white/10 shadow-lg space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-orange-400" size={18} />
                  <span className="text-xs uppercase font-mono text-orange-400 font-bold">{isEn ? "LIVE ESTIMATION" : "লাইভ সম্ভাব্য মূল্য"}</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs text-blue-200">{isEn ? "Current configuration total:" : "বর্তমান কনফিগারেশনের মোট মূল্য:"}</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-extrabold text-white font-mono">৳{currentEstimate()}</span>
                    <span className="text-xs text-blue-300">{isEn ? "BDT" : "টাকা"}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-light text-blue-200">
                  <div className="flex justify-between">
                    <span>{isEn ? "Base Service starting rate" : "সেবার প্রারম্ভিক মূল্য"}</span>
                    <span className="font-semibold text-white font-mono">
                      ৳{services.find(s => s.id === serviceId)?.startingPrice || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isEn ? "Selected size multiplier" : "কাগজের সাইজ বা স্কেল"}</span>
                    <span className="font-semibold text-white font-mono">
                      {isEn ? paperSize : (
                        paperSize === 'Passport Size' ? 'পাসপোর্ট সাইজ' :
                        paperSize === 'Passport (Set of 8)' ? 'পাসপোর্ট (৮টির সেট)' :
                        paperSize === 'Stamp (Set of 12)' ? 'স্ট্যাম্প (১২টির সেট)' :
                        paperSize === 'Per Sq. Ft.' ? 'প্রতি বর্গফুট' :
                        paperSize === 'Standard ID' ? 'স্ট্যান্ডার্ড আইডি' : paperSize
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isEn ? "Quantity" : "পরিমাণ"}</span>
                    <span className="font-semibold text-white font-mono">
                      x{quantity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isEn ? "Color Mode Discount" : "রঙের মোড ডিসকাউন্ট"}</span>
                    <span className="font-semibold text-white font-mono">
                      {colorOption === 'Color' ? (isEn ? 'None (Full Saturation)' : 'ডিসকাউন্ট নেই') : (isEn ? '60% Discount Applied' : '৬০% ডিসকাউন্ট প্রযোজ্য')}
                    </span>
                  </div>
                </div>

                {quantity >= 100 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-xs text-orange-400 font-medium">
                    🔥 {isEn ? `Volume Discount trigger active: ${quantity >= 500 ? '30%' : '15%'} discount factored in!` : `ভলিউম ডিসকাউন্ট সক্রিয়: ${quantity >= 500 ? '৩০%' : '১৫%'} ছাড় অলরেডি হিসাব করা হয়েছে!`}
                  </div>
                )}
              </div>

              {/* Secure studio badges */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-center space-y-3">
                <Printer className="text-blue-600 dark:text-blue-400 mx-auto" size={32} />
                <h4 className="font-semibold text-sm text-slate-800 dark:text-white">{isEn ? "Studio Guarantee" : "স্টুডিও গ্যারান্টি"}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                  {isEn ? "We verify every uploaded print layout manually. If sizes or color profiles are misaligned, we will contact you via WhatsApp before printing begins." : "আমরা প্রতিটি আপলোড করা ফাইল ম্যানুয়ালি যাচাই করি। সাইজ বা কালার প্রোফাইলে কোনো সমস্যা থাকলে প্রিন্টিং শুরুর আগে আমরা সরাসরি আপনার হোয়াটসঅ্যাপে যোগাযোগ করব।"}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-sm text-center max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
              <CheckCircle size={36} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-mono">{isEn ? "Order Received Successfully" : "অর্ডার সফলভাবে জমা হয়েছে"}</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">{isEn ? "Thank you for your Order!" : "আপনার অর্ডারের জন্য ধন্যবাদ!"}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-light">
                {isEn ? "Your order has been placed into our production queue. Here is your tracking receipt:" : "আপনার অর্ডারটি আমাদের প্রোডাকশন লাইনে যুক্ত করা হয়েছে। নিচে আপনার ট্র্যাকিং রসিদ দেওয়া হলো:"}
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 space-y-3 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{isEn ? "Order ID:" : "অর্ডার আইডি:"}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">{successOrder.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{isEn ? "Service:" : "সেবার নাম:"}</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {isEn ? successOrder.serviceName : (
                    successOrder.serviceId === '1' ? 'পিভিসি আইডি কার্ড' :
                    successOrder.serviceId === '2' ? 'কাস্টม ফ্লেক্স ব্যানার' :
                    successOrder.serviceId === '3' ? 'লাক্সারি বিজনেস কার্ড' :
                    successOrder.serviceId === '4' ? 'অ্যাকাডেমিক আইডি কার্ড' :
                    successOrder.serviceId === '5' ? 'ডিজিটাল ফটো প্রিন্টিং' :
                    successOrder.serviceId === '6' ? 'আমন্ত্রণ ও ওয়েডিং কার্ড' : successOrder.serviceName
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{isEn ? "Quantity:" : "পরিমাণ:"}</span>
                <span className="font-semibold text-slate-800 dark:text-white font-mono">{successOrder.quantity} {isEn ? "units" : "টি"} ({
                  isEn ? successOrder.paperSize : (
                    successOrder.paperSize === 'Passport Size' ? 'পাসপোর্ট সাইজ' :
                    successOrder.paperSize === 'Passport (Set of 8)' ? 'পাসপোর্ট (৮টির সেট)' :
                    successOrder.paperSize === 'Stamp (Set of 12)' ? 'স্ট্যাম্প (১২টির সেট)' :
                    successOrder.paperSize === 'Per Sq. Ft.' ? 'প্রতি বর্গফুট' :
                    successOrder.paperSize === 'Standard ID' ? 'স্ট্যান্ডার্ড আইডি' : successOrder.paperSize
                  )
                })</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{isEn ? "Total Charged:" : "মোট চার্জ:"}</span>
                <span className="font-bold text-slate-950 dark:text-white font-mono text-sm">৳{successOrder.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-400">{isEn ? "Order Status:" : "অর্ডারের অবস্থা:"}</span>
                <span className="px-2 py-0.5 font-bold uppercase text-[9px] rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
                  {successOrder.status === 'Pending' ? (isEn ? 'Pending' : 'অপেক্ষমান') : successOrder.status}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl text-left border border-blue-100 dark:border-blue-900/50">
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-light">
                💡 <strong>{isEn ? "What's Next?" : "পরবর্তী ধাপ কী?"}</strong> {isEn ? "Copy your Order ID" : "আপনার অর্ডার আইডি কপি করুন"} ({successOrder.id})। {isEn ? "Please note down your Order ID. You can track progress or download your invoice on the homepage tracking console anytime." : "দয়া করে অর্ডার আইডিটি সংরক্ষণ করুন। পরবর্তীতে হোমপেজের ট্র্যাকিং পোর্টাল ব্যবহার করে যেকোনো সময় আপনার কাজের অগ্রগতি জানতে ও ইনভয়েস ডাউনলোড করতে পারবেন।"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>{isEn ? "Back to Home" : "হোম পেজে ফিরুন"}</span>
              </button>
              <button
                onClick={() => {
                  setSuccessOrder(null);
                  setSelectedFile(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold py-3 rounded-xl text-xs transition-all cursor-pointer"
              >
                {isEn ? "Place New Order" : "নতুন অর্ডার করুন"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
