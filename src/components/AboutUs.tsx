import { motion } from 'motion/react';
import { Award, Users, BookOpen, Clock, Heart, Smile } from 'lucide-react';

export default function AboutUs() {
  const stats = [
    { label: "Successful Printings", count: "150,000+", icon: Award },
    { label: "Happy Regular Customers", count: "8,500+", icon: Smile },
    { label: "Experienced Design Team", count: "12+ Staff", icon: Users },
    { label: "Hours in Business Queue", count: "24/7 Support", icon: Clock }
  ];

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white font-display">
          About Shakil Digital Printers
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-light">
          A commitment to color precision, cutting-edge technology, and unmatched customer service since 2018.
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
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 font-mono">Our Heritage & Craft</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display leading-tight">
            Delivering Premium Digital Printing Excellence
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            At <strong>Shakil Digital Printers & Studio</strong>, we are passionate about turning digital designs into physical masterpieces. Since our inception, we have served students, visual designers, corporate offices, and local institutions with high-fidelity color prints, expert photo studio operations, and robust document binding packages.
          </p>
          <p className="text-slate-600 dark:text-slate-400 font-light leading-relaxed">
            We operate state-of-the-art heavy laser printers capable of high-velocity monochrome and color document replication, wide-format industrial flex plotter machines for outdoor commercial banners, and professional digital camera setups configured for perfect identity photography.
          </p>
          <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 font-semibold text-sm">
            <Heart size={18} className="fill-current text-rose-500" />
            <span>Dedicated to 100% Customer Satisfaction & Detail Accuracy.</span>
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
        <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white font-display">Our Core Printing Values</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center">
              <Award size={20} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Impeccable Color Fidelity</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              We employ professional CMYK color calibration algorithms on our machines to guarantee that what you see on your digital screen aligns beautifully with physical outputs.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Community Driven</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              We understand academic timelines and localized corporate pressures, offering highly customized student discounts and credit schemes for local partners.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">Express Delivery</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              We treat your printing goals as our emergency. We promise quick digital handoffs and prompt door-to-door courier dispatches for bulk print orders.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
