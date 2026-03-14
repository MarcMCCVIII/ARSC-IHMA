import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  Newspaper, 
  Users, 
  History, 
  Vote,
  LogOut, 
  Settings, 
  Plus, 
  Upload, 
  ChevronRight,
  Camera,
  CheckCircle2,
  XCircle,
  BarChart3,
  UserCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Info,
  Target,
  Compass,
  Heart,
  MessageSquare
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface News {
  id: number;
  title: string;
  content: string;
  date: string;
  image_url: string;
}

interface Officer {
  id: number;
  name: string;
  position: string;
  year: string;
  image_url: string;
  is_current: number;
  category: string;
}

interface Position {
  id: number;
  name: string;
  category: string;
}

interface Student {
  id: number;
  student_number: string;
  name: string;
  year: string;
  section: string;
  has_voted: number;
}

interface Candidate {
  id: number;
  name: string;
  position: string;
  grade_level: string;
  partylist_id?: number;
  partylist_name?: string;
  category: string;
  term_id: number;
  voting_restriction: string;
  votes?: number;
  image_url?: string;
}

interface Term {
  id: number;
  name: string;
  is_active: number;
}

interface Partylist {
  id: number;
  name: string;
  platform_image_url?: string;
}

interface Memory {
  id: number;
  image_url: string;
  caption: string;
  batch: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

interface Suggestion {
  id: number;
  category: string;
  content: string;
  is_anonymous: boolean;
  student_id?: number;
  created_at: string;
  students?: {
    name: string;
    year: string;
    section: string;
  };
}

interface HomeContent {
  id: number;
  section_key: string;
  title: string;
  content: string;
  order_index: number;
}

const Modal = ({ isOpen, onClose, children, title }: { isOpen: boolean, onClose: () => void, children: React.ReactNode, title: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative border border-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md px-10 py-6 border-b border-slate-50 flex items-center justify-between z-10">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XCircle className="w-8 h-8 text-slate-400 hover:text-red-500 transition-colors" />
          </button>
        </div>
        <div className="p-10">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const HomeSection = ({ title, content, icon: Icon }: { title: string, content: string, icon: any, key?: any }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flowy-card p-10 space-y-6 text-center"
  >
    <div className="flex flex-col items-center gap-4">
      <div className="p-3 bg-blue-50 rounded-2xl text-blue-800">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-3xl font-black text-blue-900 tracking-tight">{title}</h3>
    </div>
    <div className="text-slate-500 font-bold leading-relaxed whitespace-pre-wrap text-lg">
      {content}
    </div>
  </motion.div>
);

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://ihma-backend.onrender.com/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left max-w-xl mx-auto bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input 
          type="text" 
          placeholder="Your Name" 
          required 
          className="w-full px-6 py-3 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          required 
          className="w-full px-6 py-3 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all"
          value={formData.email}
          onChange={e => setFormData({...formData, email: e.target.value})}
        />
      </div>
      <input 
        type="text" 
        placeholder="Subject" 
        required 
        className="w-full px-6 py-3 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all"
        value={formData.subject}
        onChange={e => setFormData({...formData, subject: e.target.value})}
      />
      <textarea 
        placeholder="Your Message" 
        required 
        rows={4}
        className="w-full px-6 py-3 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
        value={formData.message}
        onChange={e => setFormData({...formData, message: e.target.value})}
      />
      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full flowy-button bg-blue-900 text-white disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
      </button>
      {status === 'success' && <p className="text-emerald-600 font-bold text-center mt-2">Message sent successfully!</p>}
      {status === 'error' && <p className="text-red-600 font-bold text-center mt-2">Failed to send message. Please try again.</p>}
    </form>
  );
};

const SuggestionsView = ({ studentId }: { studentId?: number }) => {
  const [formData, setFormData] = useState({ category: 'General', content: '', is_anonymous: true });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://ihma-backend.onrender.com/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, student_id: studentId })
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ category: 'General', content: '', is_anonymous: true });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">Student Suggestion Box</h2>
        <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
        <p className="mt-8 text-slate-500 font-bold text-lg">Your voice matters! Share your ideas, concerns, or suggestions with the council.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flowy-card p-10"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Category</label>
            <select 
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="General">General Suggestion</option>
              <option value="Facilities">School Facilities</option>
              <option value="Events">Events & Activities</option>
              <option value="Academic">Academic Concerns</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Your Suggestion</label>
            <textarea 
              required
              rows={6}
              placeholder="What's on your mind?"
              className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 transition-all resize-none"
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input 
              type="checkbox" 
              id="anonymous"
              className="w-5 h-5 rounded-lg text-blue-900 focus:ring-blue-900"
              checked={formData.is_anonymous}
              onChange={e => setFormData({...formData, is_anonymous: e.target.checked})}
            />
            <label htmlFor="anonymous" className="text-sm font-bold text-slate-600 cursor-pointer">Submit anonymously</label>
          </div>

          <button 
            type="submit" 
            disabled={status === 'loading'}
            className="w-full flowy-button bg-blue-900 text-white disabled:opacity-50"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Suggestion'}
          </button>
          
          {status === 'success' && (
            <motion.p 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-600 font-bold text-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100"
            >
              Thank you! Your suggestion has been submitted.
            </motion.p>
          )}
          {status === 'error' && <p className="text-red-600 font-bold text-center">Something went wrong. Please try again.</p>}
        </form>
      </motion.div>
    </div>
  );
};

const HomeView = ({ content }: { content: HomeContent[] }) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'what_is_arsc': return Info;
      case 'mission': return Target;
      case 'vision': return Compass;
      case 'values': return Heart;
      case 'contact_info': return Mail;
      default: return Info;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="text-center mb-16">
        <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">Welcome to ARSC</h2>
        <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
      </div>

      <div className="grid gap-10">
        {content.map((section) => (
          <div key={section.id}>
            <HomeSection 
              title={section.title} 
              content={section.content} 
              icon={getIcon(section.section_key)} 
            />
            {section.section_key === 'contact_info' && <ContactForm />}
          </div>
        ))}
      </div>
    </div>
  );
};

const NewsItem = ({ item, isAdmin, onDelete, onEdit }: { item: News, isAdmin: boolean, onDelete: () => void | Promise<void>, onEdit: () => void, key?: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      layout
      className={cn(
        "flowy-card overflow-hidden group relative cursor-pointer transition-all duration-500",
        isExpanded && "md:col-span-2 lg:col-span-3"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex flex-col md:flex-row">
        {item.image_url && (
          <div className={cn(
            "w-full overflow-hidden transition-all duration-500",
            isExpanded ? "md:w-full" : "md:w-80 h-80"
          )}>
            <img 
              src={item.image_url} 
              className={cn(
                "w-full transition-transform duration-700",
                isExpanded ? "object-contain max-h-[600px] bg-slate-900" : "h-full object-cover group-hover:scale-105"
              )} 
              referrerPolicy="no-referrer" 
            />
          </div>
        )}
        <div className={cn(
          "p-10 flex-1 flex flex-col justify-center",
          isExpanded && "bg-white"
        )}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-blue-800 font-black uppercase tracking-[0.2em]">{item.date}</div>
            {isAdmin && (
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={onEdit}
                  className="p-2 bg-blue-50 text-blue-800 rounded-xl hover:bg-blue-800 hover:text-white transition-all"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={onDelete}
                  className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-4">{item.title}</h3>
          <AnimatePresence>
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-slate-500 leading-relaxed text-lg whitespace-pre-wrap">{item.content}</p>
              </motion.div>
            ) : (
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Click to read more</p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const Intro = ({ onComplete, logo }: { onComplete: () => void, logo?: string }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900 overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 5, duration: 1.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      {/* Background decorative elements */}
      <motion.div 
        className="absolute w-[600px] h-[600px] bg-blue-800/30 rounded-full blur-2xl"
        animate={{ 
          scale: [1, 1.5, 1],
          x: [200, -200, 200],
          y: [150, -150, 150]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          {logo ? (
            <motion.img
              key={logo}
              src={logo}
              alt="Logo"
              className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl"
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.5, ease: "backOut" }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <motion.div
              key="text-logo"
              className="text-9xl md:text-[18rem] text-white font-sans font-black leading-none select-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: 100, rotate: -10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 1.5, ease: "backOut" }}
            >
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="h-2 bg-red-600 rounded-full mt-6 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          initial={{ width: 0 }}
          animate={{ width: 240 }}
          transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

const Login = ({ onLogin, logos }: { onLogin: (role: 'admin' | 'student', data?: any) => void, logos: { logo1: string, logo2: string } }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('https://ihma-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, isAdmin })
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.role, data.student);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="flowy-card p-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex items-center justify-center gap-4 mb-8 w-full">
            {logos.logo1 && (
              <motion.img 
                src={logos.logo1} 
                alt="Logo 1" 
                className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-xl"
                initial={{ x: -30, opacity: 0, rotate: -10 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                referrerPolicy="no-referrer"
              />
            )}
            <div className="flex flex-col items-center shrink-0">
              <motion.h1 
                className="text-2xl md:text-3xl font-sans font-black text-blue-900 mb-1 tracking-tighter whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                ARSC - IHMA
              </motion.h1>
              <motion.div 
                className="h-1 bg-red-600 rounded-full w-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6 }}
              />
            </div>
            {logos.logo2 && (
              <motion.img 
                src={logos.logo2} 
                alt="Logo 2" 
                className="h-16 w-16 md:h-20 md:w-20 object-contain drop-shadow-xl"
                initial={{ x: 30, opacity: 0, rotate: 10 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Student Council Portal</p>
        </div>

        <div className="flex mb-8 bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setIsAdmin(false)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
              !isAdmin ? "bg-white shadow-md text-blue-800" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Student
          </button>
          <button 
            onClick={() => setIsAdmin(true)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all",
              isAdmin ? "bg-white shadow-md text-blue-800" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">
              {isAdmin ? "Admin Password" : "Student Number"}
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all text-slate-700"
                placeholder={isAdmin ? "Enter admin password" : "Enter your student number"}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-800 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-xs font-bold ml-1"
            >
              {error}
            </motion.p>
          )}
          <button 
            type="submit"
            className="w-full flowy-button bg-blue-800 text-white hover:bg-blue-900"
          >
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const ProfileSetup = ({ student, onComplete }: { student: Student, onComplete: (updated: Student) => void }) => {
  const [name, setName] = useState(student.name || '');
  const [year, setYear] = useState(student.year || '');
  const [section, setSection] = useState(student.section || '');
  const [availableSections, setAvailableSections] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://ihma-backend.onrender.com/api/sections')
      .then(res => res.json())
      .then(data => setAvailableSections(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://ihma-backend.onrender.com/api/students/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: student.id, name, year, section })
    });
    onComplete({ ...student, name, year, section });
  };

  const filteredSections = availableSections.filter(s => s.year === year);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flowy-card p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-sans font-black text-blue-900 mb-8 tracking-tight">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" 
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Year Level</label>
              <select 
                value={year} onChange={e => { setYear(e.target.value); setSection(''); }}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" 
                required
              >
                <option value="">Select Year</option>
                <option value="Grade 3">Grade 3</option>
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
                <option value="Grade 8">Grade 8</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 ml-1">Section</label>
              <select 
                value={section} onChange={e => setSection(e.target.value)}
                className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white/50 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" 
                required
                disabled={!year}
              >
                <option value="">Select Section</option>
                {filteredSections.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                {year && filteredSections.length === 0 && (
                  <option disabled>No sections added</option>
                )}
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full flowy-button bg-blue-900 text-white"
          >
            Complete Setup
          </button>
        </form>
      </motion.div>
    </div>
  );
};

const AddStudent = ({ onComplete }: { onComplete: () => void }) => {
  const [studentNumber, setStudentNumber] = useState('');
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    fetch('https://ihma-backend.onrender.com/api/sections').then(res => res.json()).then(setSections);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('https://ihma-backend.onrender.com/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        student_number: studentNumber, 
        name: name || null, 
        year: year || null, 
        section: section || null 
      })
    });
    const data = await res.json();
    if (data.success) {
      onComplete();
      setStudentNumber(''); setName(''); setYear(''); setSection('');
    } else {
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input placeholder="Student Number" value={studentNumber} onChange={e => setStudentNumber(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700" required />
      <input placeholder="Full Name (Optional)" value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700" />
      <div className="grid grid-cols-2 gap-4">
        <select value={year} onChange={e => setYear(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700">
          <option value="">Year (Optional)</option>
          {[3,4,5,6,7,8,9,10,11,12].map(y => <option key={y} value={`Grade ${y}`}>Grade {y}</option>)}
        </select>
        <select value={section} onChange={e => setSection(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700">
          <option value="">Section (Optional)</option>
          {sections.filter(s => s.year === year).map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
        </select>
      </div>
      <button type="submit" className="w-full flowy-button bg-blue-900 text-white">Add Student</button>
    </form>
  );
};

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [role, setRole] = useState<'admin' | 'student' | null>(null);
  const [user, setUser] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [logos, setLogos] = useState({ logo1: '', logo2: '' });
  const [loadingLogos, setLoadingLogos] = useState(true);
  const [homeContent, setHomeContent] = useState<HomeContent[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [partylists, setPartylists] = useState<Partylist[]>([]);
  const [votingRestriction, setVotingRestriction] = useState('everyone');
  const [stats, setStats] = useState<any>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    // Ensure light mode is always active
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }, []);

  useEffect(() => {
    // Fetch logos and settings immediately
    fetch('https://ihma-backend.onrender.com/api/settings')
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          console.error('Settings fetch failed:', res.status, text.substring(0, 100));
          throw new Error(`Failed to fetch settings: ${res.status}`);
        }
        return res.json();
      })
      .then(settings => {
        setLogos({ logo1: settings.logo1, logo2: settings.logo2 });
        setVotingRestriction(settings.voting_restriction);
        setLoadingLogos(false);
      })
      .catch(err => {
        console.error('Error in settings fetch:', err);
        setLoadingLogos(false);
      });
  }, []);

  useEffect(() => {
    if (role) {
      fetchData();
    }
  }, [role]);

  const fetchData = async () => {
    try {
      const [homeRes, newsRes, offRes, candRes, memRes, termRes, partyRes, setRes, statRes, inqRes, sugRes] = await Promise.all([
        fetch('https://ihma-backend.onrender.com/api/home-content'),
        fetch('https://ihma-backend.onrender.com/api/news'),
        fetch('https://ihma-backend.onrender.com/api/officers'),
        fetch('https://ihma-backend.onrender.com/api/candidates'),
        fetch('https://ihma-backend.onrender.com/api/memories'),
        fetch('https://ihma-backend.onrender.com/api/terms'),
        fetch('https://ihma-backend.onrender.com/api/partylists'),
        fetch('https://ihma-backend.onrender.com/api/settings'),
        fetch('https://ihma-backend.onrender.com/api/voting-stats'),
        fetch('https://ihma-backend.onrender.com/api/inquiries'),
        fetch('https://ihma-backend.onrender.com/api/suggestions')
      ]);

      const checkRes = async (res: Response, name: string) => {
        if (!res.ok) {
          const text = await res.text();
          console.error(`${name} fetch failed:`, res.status, text.substring(0, 100));
          throw new Error(`Failed to fetch ${name}: ${res.status}`);
        }
        return res.json();
      };

      const [homeData, newsData, offData, candData, memData, termData, partyData, setData, statData, inqData, sugData] = await Promise.all([
        checkRes(homeRes, 'home'),
        checkRes(newsRes, 'news'),
        checkRes(offRes, 'officers'),
        checkRes(candRes, 'candidates'),
        checkRes(memRes, 'memories'),
        checkRes(termRes, 'terms'),
        checkRes(partyRes, 'partylists'),
        checkRes(setRes, 'settings'),
        checkRes(statRes, 'stats'),
        checkRes(inqRes, 'inquiries'),
        checkRes(sugRes, 'suggestions')
      ]);

      setHomeContent(homeData);
      setNews(newsData);
      setOfficers(offData);
      setCandidates(candData);
      setMemories(memData);
      setTerms(termData);
      setPartylists(partyData);
      setLogos({ logo1: setData.logo1, logo2: setData.logo2 });
      setVotingRestriction(setData.voting_restriction);
      setStats(statData);
      setInquiries(inqData);
      setSuggestions(sugData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleDelete = async (type: 'news' | 'officers' | 'memories' | 'candidates', id: number) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    await fetch(`https://ihma-backend.onrender.com/api/${type}/${id}`, {
      method: 'DELETE'
    });
    fetchData();
  };

  if (showIntro) return <Intro onComplete={() => setShowIntro(false)} logo={logos.logo2 || undefined} />;
  if (!role) return <Login onLogin={(r, u) => { setRole(r); setUser(u); }} logos={logos} />;
  if (role === 'student' && user && (!user.name || !user.year)) {
    return <ProfileSetup student={user} onComplete={setUser} />;
  }

  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            {logos.logo1 && <img src={logos.logo2} alt="Logo 2" className="h-10 w-10 object-contain" referrerPolicy="no-referrer" />}
            <div>
              <h1 className="text-xl font-sans font-black text-blue-900 leading-none tracking-tight">ARSC - IHMA</h1>
              <p className="text-[8px] text-slate-400 uppercase tracking-[0.3em] mt-1 font-black">Student Council</p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'news', label: 'News', icon: Newspaper },
              { id: 'officers', label: 'Officers', icon: Users },
              { id: 'memories', label: 'Memories', icon: History },
              { id: 'voting', label: 'Voting', icon: Vote },
              { id: 'suggestions', label: 'Suggestions', icon: MessageSquare },
              ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : [])
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300",
                  activeTab === item.id ? "bg-blue-900 text-white shadow-md" : "text-slate-400 hover:bg-slate-50 hover:text-blue-800"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-white" : "text-slate-300")} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
            <UserCircle className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold text-blue-900">
              {isAdmin ? 'Administrator' : user?.name}
            </span>
          </div>
          <button 
            onClick={() => { setRole(null); setUser(null); }}
            className="p-2.5 hover:bg-red-50 hover:text-red-500 rounded-2xl text-slate-400 transition-all active:scale-90"
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-slate-100 px-4 py-2 flex overflow-x-auto no-scrollbar gap-2 sticky top-[73px] z-30">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'news', label: 'News', icon: Newspaper },
          { id: 'officers', label: 'Officers', icon: Users },
          { id: 'memories', label: 'Memories', icon: History },
          { id: 'voting', label: 'Voting', icon: Vote },
          { id: 'suggestions', label: 'Suggestions', icon: MessageSquare },
          ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : [])
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap",
              activeTab === item.id ? "bg-blue-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50 hover:text-blue-800"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === 'home' && <HomeView content={homeContent} />}
            
            {activeTab === 'news' && (
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">News & Events</h2>
                  <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {news.map(item => (
                    <NewsItem 
                      key={item.id} 
                      item={item} 
                      isAdmin={isAdmin} 
                      onDelete={() => handleDelete('news', item.id)}
                      onEdit={() => setEditingNews(item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'voting' && (
              <div className="max-w-5xl mx-auto pb-20">
                <div className="text-center mb-16">
                  <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">Vote Your Leaders</h2>
                  <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
                </div>
                
                {/* Voting Restriction Notice */}
                {user && votingRestriction !== 'everyone' && user.year !== votingRestriction && (
                  <div className="p-10 bg-red-50 border-2 border-red-100 rounded-[2.5rem] text-center mb-12">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-red-900 mb-2">Voting Restricted</h3>
                    <p className="text-red-600 font-bold">Currently, voting is only open for {votingRestriction}.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {candidates.map(candidate => (
<div key={candidate.id} className="flowy-card p-6 flex flex-col items-center group">

{/* Candidate Image */}
<div
className="relative w-full mb-6 cursor-pointer overflow-hidden rounded-2xl shadow-lg aspect-square"
onClick={() => setZoomedImage(candidate.image_url || null)}

<img
src={candidate.image_url || 'https://via.placeholder.com/300?text=Candidate'}
alt={candidate.name}
className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
referrerPolicy="no-referrer"
/>

<div className="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-all">
<Eye className="text-white opacity-0 group-hover:opacity-100 w-10 h-10 transition-opacity"/>
</div>
</div>

<h3 className="text-2xl font-black text-slate-800 mb-1">{candidate.name}</h3>

<p className="text-blue-600 font-black uppercase tracking-widest text-xs mb-2">
{candidate.position}
</p>

<p className="text-slate-400 font-bold italic mb-4">
Partylist: {candidate.partylist_name || 'Independent'}
</p>

{/* STUDENT VOTE BUTTON */}
{!isAdmin && user && user.has_voted === 0 && (
<button className="w-full flowy-button bg-blue-900 text-white">
Cast Vote
</button>
)}

{/* ADMIN DELETE BUTTON */}
{isAdmin && (
<button
onClick={() => handleDelete('candidates', candidate.id)}
className="mt-3 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"

Delete Candidate
</button>
)}

</div>
))}
            {activeTab === 'admin' && isAdmin && (
              <div className="max-w-6xl mx-auto space-y-12 pb-20">
                <div className="text-center mb-16">
                  <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">Admin Control</h2>
                  <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
                </div>

                {/* Candidate Management in Admin */}
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Candidates</h3>
                    <button className="flowy-button bg-blue-900 text-white flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Add Candidate
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.map(c => (
                      <div key={c.id} className="flowy-card p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <img 
                            src={c.image_url || 'https://via.placeholder.com/100'} 
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-black text-slate-800 leading-tight">{c.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.position}</p>
                          </div>
                        </div>
                        {/* DELETE CANDIDATE BUTTON */}
                        <button 
                          onClick={() => handleDelete('candidates', c.id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          title="Delete Candidate"
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
                {const AddNews = ({ onComplete, initialData }: { onComplete: () => void, initialData?: News }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [date, setDate] = useState(initialData?.date || '');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('date', date);
    if (image) formData.append('image', image);
    
    const url = initialData?.id ? `https://ihma-backend.onrender.com/api/news/${initialData.id}` : 'https://ihma-backend.onrender.com/api/news';
    const method = initialData?.id ? 'PUT' : 'POST';
    
    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      onComplete();
    } else {
      alert('Failed to save news. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required />
      <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 h-48" required />
      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required />
      <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl">
        <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full text-sm text-slate-400 file:mr-6 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 transition-all" />
      </div>
      <button type="submit" className="w-full flowy-button bg-blue-900 text-white hover:bg-blue-950">
        {initialData?.id ? 'Update News' : 'Post News'}
      </button>
    </form>
  );
};

const AddOfficer = ({ onComplete, initialData }: { onComplete: () => void, initialData?: Officer }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [category, setCategory] = useState(initialData?.category || 'Executive');
  const [year, setYear] = useState(initialData?.year || '');
  const [image, setImage] = useState<File | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    fetch('https://ihma-backend.onrender.com/api/positions').then(res => res.json()).then(setPositions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('category', category);
    formData.append('year', year);
    if (image) formData.append('image', image);
    
    const url = initialData?.id ? `https://ihma-backend.onrender.com/api/officers/${initialData.id}` : 'https://ihma-backend.onrender.com/api/officers';
    const method = initialData?.id ? 'PUT' : 'POST';
    
    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      onComplete();
    } else {
      alert('Failed to save officer. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required />
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700" required>
          <option value="Executive">Executive</option>
          <option value="Judiciary">Judiciary</option>
          <option value="Legislative">Legislative</option>
          <option value="Ministries">Ministries</option>
          <option value="Departmental">Departmental</option>
          <option value="Teacher Servant">Teacher Servant</option>
          <option value="Sister Servant">Sister Servant</option>
        </select>
        <select value={position} onChange={e => setPosition(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required>
          <option value="">Select Position</option>
          {positions.filter(p => p.category === category).map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <input placeholder="Year/Term" value={year} onChange={e => setYear(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required />
      </div>
      <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl">
        <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full text-sm text-slate-400 file:mr-6 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" />
      </div>
      <button type="submit" className="w-full flowy-button bg-blue-900 text-white hover:bg-blue-950">
        {initialData?.id ? 'Update Officer' : 'Save Officer'}
      </button>
    </form>
  );
};

const AddCandidate = ({ onComplete }: { onComplete: () => void }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [grade, setGrade] = useState('');
  const [partylistId, setPartylistId] = useState('');
  const [category, setCategory] = useState('Executive');
  const [termId, setTermId] = useState('');
  const [votingRestriction, setVotingRestriction] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  
  const [terms, setTerms] = useState<Term[]>([]);
  const [partylists, setPartylists] = useState<Partylist[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    fetch('https://ihma-backend.onrender.com/api/terms').then(res => res.json()).then(setTerms);
    fetch('https://ihma-backend.onrender.com/api/partylists').then(res => res.json()).then(setPartylists);
    fetch('https://ihma-backend.onrender.com/api/positions').then(res => res.json()).then(setPositions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('grade_level', grade);
    formData.append('partylist_id', partylistId);
    formData.append('category', category);
    formData.append('term_id', termId);
    formData.append('voting_restriction', votingRestriction.length > 0 ? votingRestriction.join(',') : 'everyone');
    if (image) formData.append('image', image);

    await fetch('https://ihma-backend.onrender.com/api/candidates', { 
      method: 'POST', 
      body: formData
    });
    onComplete();
    setName(''); setPosition(''); setGrade(''); setImage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add Candidate</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input placeholder="Candidate Name" value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required />
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700" required>
          <option value="Executive">Executive</option>
          <option value="Legislative">Legislative</option>
          <option value="Departmental">Departmental</option>
          <option value="Judiciary">Judiciary</option>
          <option value="Ministries">Ministries</option>
          <option value="Teacher Servant">Teacher Servant</option>
          <option value="Sister Servant">Sister Servant</option>
        </select>
        <select value={position} onChange={e => setPosition(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required>
          <option value="">Select Position</option>
          {positions.filter(p => p.category === category).map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <select 
          value={grade} onChange={e => setGrade(e.target.value)} 
          className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700" 
          required
        >
          <option value="">Candidate Grade Level</option>
          {[3,4,5,6,7,8,9,10,11,12].map(y => <option key={y} value={`Grade ${y}`}>Grade {y}</option>)}
        </select>
        <select value={partylistId} onChange={e => setPartylistId(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700">
          <option value="">Independent</option>
          {partylists.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={termId} onChange={e => setTermId(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required>
          <option value="">Select Term</option>
          {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div className="p-4 border-2 border-dashed border-slate-100 rounded-2xl">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Candidate Photo</p>
          <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 transition-all" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Voting Restriction (Who can vote for this candidate?)</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={votingRestriction.length === 0}
                onChange={() => setVotingRestriction([])}
                className="w-5 h-5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
              />
              <span className="text-sm font-bold text-slate-600 group-hover:text-blue-900 transition-colors">Everyone</span>
            </label>
            {[3,4,5,6,7,8,9,10,11,12].map(y => (
              <label key={y} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={votingRestriction.includes(`Grade ${y}`)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setVotingRestriction(prev => [...prev, `Grade ${y}`]);
                    } else {
                      setVotingRestriction(prev => prev.filter(v => v !== `Grade ${y}`));
                    }
                  }}
                  className="w-5 h-5 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-blue-900 transition-colors">Grade {y}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <button type="submit" className="w-full flowy-button bg-blue-900 text-white hover:bg-blue-950">Add Candidate</button>
    </form>
  );
};

const AddMemory = ({ onComplete, initialData }: { onComplete: () => void, initialData?: Memory }) => {
  const [caption, setCaption] = useState(initialData?.caption || '');
  const [batch, setBatch] = useState(initialData?.batch || '');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('batch', batch);
    if (image) formData.append('image', image);
    
    const url = initialData?.id ? `https://ihma-backend.onrender.com/api/memories/${initialData.id}` : 'https://ihma-backend.onrender.com/api/memories';
    const method = initialData?.id ? 'PUT' : 'POST';
    
    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      onComplete();
    } else {
      alert('Failed to save memory. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input placeholder="Caption (e.g. ARSC Officers)" value={caption} onChange={e => setCaption(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required />
      <input placeholder="Batch (e.g. 2020-2021)" value={batch} onChange={e => setBatch(e.target.value)} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" required />
      <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl">
        <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full text-sm text-slate-400 file:mr-6 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100 transition-all" />
      </div>
      <button type="submit" className="w-full flowy-button bg-blue-900 text-white hover:bg-blue-950">
        {initialData?.id ? 'Update Memory' : 'Add Memory'}
      </button>
    </form>
  );
};

const TermManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [name, setName] = useState('');

  const fetchTerms = () => fetch('https://ihma-backend.onrender.com/api/terms').then(res => res.json()).then(setTerms);
  useEffect(() => { fetchTerms(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://ihma-backend.onrender.com/api/terms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setName(''); fetchTerms(); onUpdate();
  };

  const handleActivate = async (id: number) => {
    await fetch(`https://ihma-backend.onrender.com/api/terms/${id}/activate`, { method: 'PUT' });
    fetchTerms(); onUpdate();
  };

  const handleDelete = async (id: number) => {
    await fetch(`https://ihma-backend.onrender.com/api/terms/${id}`, { method: 'DELETE' });
    fetchTerms(); onUpdate();
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Manage Voting Terms</h3>
      <form onSubmit={handleAdd} className="flex gap-4">
        <input placeholder="Term Name (e.g. 2024-2025)" value={name} onChange={e => setName(e.target.value)} className="flex-1 px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700" required />
        <button type="submit" className="p-4 bg-blue-900 text-white rounded-2xl hover:bg-blue-950 transition-all"><Plus /></button>
      </form>
      <div className="space-y-4">
        {terms.map(t => (
          <div key={t.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-50">
            <span className={cn("font-black tracking-tight", t.is_active ? "text-blue-900" : "text-slate-400")}>
              {t.name} {t.is_active === 1 && <span className="ml-3 text-[10px] bg-blue-100 text-blue-900 px-3 py-1 rounded-full uppercase font-black tracking-widest">Active</span>}
            </span>
            <div className="flex gap-4">
              {!t.is_active && (
                <button onClick={() => handleActivate(t.id)} className="text-xs font-black uppercase tracking-widest text-blue-800 hover:text-blue-950 transition-all">Activate</button>
              )}
              <button onClick={() => handleDelete(t.id)} className="text-red-300 hover:text-red-500 transition-all"><XCircle className="w-6 h-6" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PositionManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Executive');

  const fetchPositions = () => fetch('https://ihma-backend.onrender.com/api/positions').then(res => res.json()).then(setPositions);
  useEffect(() => { fetchPositions(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://ihma-backend.onrender.com/api/positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category })
    });
    setName(''); fetchPositions(); onUpdate();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`https://ihma-backend.onrender.com/api/positions/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) {
      alert(data.message);
    } else {
      fetchPositions(); onUpdate();
    }
  };

  return (
    <div className="space-y-10">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Manage Positions</h3>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
        <input placeholder="Position Name" value={name} onChange={e => setName(e.target.value)} className="flex-1 px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700" required />
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700" required>
          <option value="Executive">Executive</option>
          <option value="Judiciary">Judiciary</option>
          <option value="Legislative">Legislative</option>
          <option value="Ministries">Ministries</option>
          <option value="Departmental">Departmental</option>
          <option value="Teacher Servant">Teacher Servant</option>
          <option value="Sister Servant">Sister Servant</option>
        </select>
        <button type="submit" className="p-4 bg-blue-900 text-white rounded-2xl hover:bg-blue-950 transition-all"><Plus /></button>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {['Executive', 'Judiciary', 'Legislative', 'Ministries', 'Departmental', 'Teacher Servant', 'Sister Servant'].map(cat => (
          <div key={cat} className="space-y-4">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">{cat}</p>
            <div className="space-y-3">
              {positions.filter(p => p.category === cat).map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50">
                  <span className="text-sm font-black text-slate-700 tracking-tight">{p.name}</span>
                  <button onClick={() => handleDelete(p.id)} className="text-red-300 hover:text-red-500 transition-all"><XCircle className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PartylistManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [partylists, setPartylists] = useState<Partylist[]>([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const fetchPartylists = () => fetch('https://ihma-backend.onrender.com/api/partylists').then(res => res.json()).then(setPartylists);
  useEffect(() => { fetchPartylists(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (image) formData.append('platform_image', image);
    
    await fetch('https://ihma-backend.onrender.com/api/partylists', { method: 'POST', body: formData });
    setName(''); setImage(null); fetchPartylists(); onUpdate();
  };

  const handleDelete = async (id: number) => {
    await fetch(`https://ihma-backend.onrender.com/api/partylists/${id}`, { method: 'DELETE' });
    fetchPartylists(); onUpdate();
  };

  return (
    <div className="space-y-10">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Manage Partylists</h3>
      <form onSubmit={handleAdd} className="space-y-8">
        <div className="flex gap-4">
          <input placeholder="Partylist Name" value={name} onChange={e => setName(e.target.value)} className="flex-1 px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all" required />
          <button type="submit" className="p-4 bg-blue-900 text-white rounded-2xl hover:bg-blue-950 transition-all"><Plus /></button>
        </div>
        <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Platform Image (Optional)</p>
          <input type="file" onChange={e => setImage(e.target.files?.[0] || null)} className="w-full text-sm text-slate-400 file:mr-6 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all" />
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {partylists.map(p => (
          <div key={p.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-50 group hover:border-blue-100 transition-all">
            <div className="flex items-center gap-4">
              <span className="font-black text-slate-700 tracking-tight">{p.name}</span>
              {p.platform_image_url && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase font-black tracking-widest">Platform</span>}
            </div>
            <button onClick={() => handleDelete(p.id)} className="text-red-300 hover:text-red-500 transition-all"><XCircle className="w-6 h-6" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert("Passwords do not match");
    
    setLoading(true);
    const res = await fetch('https://ihma-backend.onrender.com/api/settings/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    setLoading(false);
    
    if (data.success) {
      alert("Password changed successfully");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">Change Admin Password</h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Current Password</label>
          <input 
            type="password" 
            value={currentPassword} 
            onChange={e => setCurrentPassword(e.target.value)} 
            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700" 
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">New Password</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={e => setNewPassword(e.target.value)} 
            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700" 
            required 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:border-blue-900 outline-none transition-all font-bold text-slate-700" 
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full flowy-button bg-blue-900 text-white hover:bg-blue-950 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
};

const SectionManager = ({ onUpdate }: { onUpdate: () => void }) => {
  const [sections, setSections] = useState<any[]>([]);
  const [year, setYear] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('https://ihma-backend.onrender.com/api/sections').then(res => res.json()).then(setSections);
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('https://ihma-backend.onrender.com/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, name })
    });
    setYear(''); setName('');
    const res = await fetch('https://ihma-backend.onrender.com/api/sections');
    setSections(await res.json());
    onUpdate();
  };

  const handleDelete = async (id: number) => {
    await fetch(`https://ihma-backend.onrender.com/api/sections/${id}`, { method: 'DELETE' });
    const res = await fetch('https://ihma-backend.onrender.com/api/sections');
    setSections(await res.json());
    onUpdate();
  };

  return (
    <div className="space-y-12">
      <form onSubmit={handleAdd} className="space-y-8">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add New Section</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <select 
            value={year} onChange={e => setYear(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" 
            required
          >
            <option value="">Select Year</option>
            {[3,4,5,6,7,8,9,10,11,12].map(y => <option key={y} value={`Grade ${y}`}>Grade {y}</option>)}
          </select>
          <input 
            placeholder="Section Name (e.g. St. Jude)" 
            value={name} onChange={e => setName(e.target.value)} 
            className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-slate-700" 
            required 
          />
        </div>
        <button type="submit" className="w-full flowy-button bg-blue-900 text-white hover:bg-blue-950">Add Section</button>
      </form>

      <div className="border-t border-slate-100 pt-12">
        <h3 className="text-2xl font-black mb-10 text-slate-800 tracking-tight">Manage Sections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map(s => (
            <div key={s.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-50 group hover:border-blue-100 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{s.year}</p>
                <p className="font-black text-slate-700 tracking-tight">{s.name}</p>
              </div>
              <button 
                onClick={() => handleDelete(s.id)}
                className="p-2 text-red-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* GLOBAL ZOOM MODAL */}
      <Modal 
        isOpen={!!zoomedImage} 
        onClose={() => setZoomedImage(null)} 
        title="Image Preview"
      >
        <div className="flex flex-col items-center">
          <img 
            src={zoomedImage || ''} 
            className="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl" 
            referrerPolicy="no-referrer"
          />
          <button 
            onClick={() => setZoomedImage(null)}
            className="mt-8 flowy-button bg-slate-900 text-white px-12"
          >
            Close Preview
          </button>
        </div>
      </Modal>
    </div>
  );
}
