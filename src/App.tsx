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
    await fetch(`https://ihma-backend.onrender.com/api/${type}/${id}`, { method: 'DELETE' });
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
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {logos.logo1 && <img src={logos.logo1} alt="Logo 1" className="h-14 w-14 object-contain" referrerPolicy="no-referrer" />}
            <div>
              <h1 className="text-2xl font-sans font-black text-blue-900 leading-none tracking-tight">ARSC - IHMA</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-1 font-black">Student Council</p>
            </div>
            {logos.logo2 && <img src={logos.logo2} alt="Logo 2" className="h-14 w-14 object-contain" referrerPolicy="no-referrer" />}
          </div>
        </div>

        <div className="flex items-center gap-8">
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
                  activeTab === item.id 
                    ? "bg-blue-900 text-white shadow-md" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-blue-800"
                )}
              >
                <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-white" : "text-slate-300")} />
                {item.label}
              </button>
            ))}
          </nav>
          
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
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-slate-100 px-4 py-2 flex overflow-x-auto no-scrollbar gap-2 sticky top-[88px] z-30">
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
              activeTab === item.id 
                ? "bg-blue-900 text-white shadow-sm" 
                : "text-slate-400 hover:bg-slate-50 hover:text-blue-800"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {activeTab === 'home' && (
                <HomeView content={homeContent} />
              )}

              {activeTab === 'news' && (
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">News & Events</h2>
                    <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
                    <div className="relative flex-1 w-full">
                      <input 
                        type="text" 
                        placeholder="Search news..." 
                        className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-50 outline-none font-bold text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Newspaper className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => setEditingNews({} as News)}
                        className="flowy-button bg-blue-900 text-white flex items-center gap-2 whitespace-nowrap"
                      >
                        <Plus className="w-5 h-5" />
                        Add News
                      </button>
                    )}
                  </div>

                  {news.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                    <div className="flowy-card p-24 text-center border-dashed border-2 border-slate-100">
                      <Newspaper className="w-16 h-16 text-blue-100 mx-auto mb-6" />
                      <p className="text-slate-300 text-xl font-bold">No results found</p>
                    </div>
                  ) : (
                    <div className="grid gap-10">
                      {news
                        .filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.content.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(item => (
                        <NewsItem 
                          key={item.id} 
                          item={item} 
                          isAdmin={isAdmin} 
                          onDelete={() => handleDelete('news', item.id)}
                          onEdit={() => setEditingNews(item)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'officers' && (
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">ARSC Officers</h2>
                    <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
                  </div>

                  {isAdmin && (
                    <div className="flex justify-center mb-12">
                      <button 
                        onClick={() => setEditingOfficer({} as Officer)}
                        className="flowy-button bg-blue-900 text-white flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Officer
                      </button>
                    </div>
                  )}

                  {officers.length === 0 ? (
                    <div className="flowy-card p-24 text-center border-dashed border-2 border-slate-100">
                      <Users className="w-16 h-16 text-blue-100 mx-auto mb-6" />
                      <p className="text-slate-300 text-xl font-bold">Coming Soon</p>
                    </div>
                  ) : (
                    <div className="space-y-20">
                      {['Executive', 'Judiciary', 'Legislative', 'Ministries', 'Departmental', 'Teacher Servant', 'Sister Servant'].map(cat => {
                        const catOfficers = officers.filter(o => o.category === cat);
                        if (catOfficers.length === 0) return null;
                        return (
                          <div key={cat} className="space-y-10">
                            <div className="flex items-center gap-6">
                              <h3 className="text-4xl font-black text-blue-900 tracking-tight">{cat}</h3>
                              <div className="h-px flex-1 bg-slate-100" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                              {catOfficers.map(officer => (
                                <motion.div 
                                  key={officer.id} 
                                  whileHover={{ y: -12 }}
                                  className="flowy-card p-10 text-center group relative"
                                >
                                  {isAdmin && (
                                    <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                      <button 
                                        onClick={() => setEditingOfficer(officer)}
                                        className="p-2.5 bg-blue-50 text-blue-800 rounded-full hover:bg-blue-800 hover:text-white transition-all"
                                      >
                                        <Settings className="w-5 h-5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDelete('officers', officer.id)}
                                        className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
                                      >
                                        <XCircle className="w-5 h-5" />
                                      </button>
                                    </div>
                                  )}
                                  <div 
                                    className="mx-auto mb-8 rounded-3xl overflow-hidden border-4 border-slate-50 p-1 group-hover:border-blue-400 transition-all duration-500 inline-block cursor-zoom-in"
                                    onClick={() => officer.image_url && setZoomedImage(officer.image_url)}
                                  >
                                    {officer.image_url ? (
                                      <img src={officer.image_url} className="max-w-full h-auto rounded-2xl max-h-64" referrerPolicy="no-referrer" />
                                    ) : (
                                      <div className="w-48 h-48 bg-slate-50 flex items-center justify-center rounded-2xl">
                                        <Users className="w-12 h-12 text-slate-200" />
                                      </div>
                                    )}
                                  </div>
                                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{officer.name}</h3>
                                  <p className="text-blue-800 font-black uppercase text-[10px] tracking-[0.2em] mt-3">{officer.position}</p>
                                  <p className="text-slate-400 text-sm mt-2 font-medium">{officer.year}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'memories' && (
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="text-6xl font-sans font-black text-blue-900 tracking-tight">Hall of Memories</h2>
                    <div className="h-1.5 w-40 bg-red-600 mx-auto mt-6 rounded-full" />
                  </div>

                  {isAdmin && (
                    <div className="flex justify-center mb-12">
                      <button 
                        onClick={() => setEditingMemory({} as Memory)}
                        className="flowy-button bg-blue-900 text-white flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Memory
                      </button>
                    </div>
                  )}

                  {memories.length === 0 ? (
                    <div className="flowy-card p-24 text-center border-dashed border-2 border-slate-100">
                      <History className="w-16 h-16 text-blue-100 mx-auto mb-6" />
                      <p className="text-slate-300 text-xl font-bold">Coming Soon</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {memories.map(memory => (
                        <motion.div 
                          key={memory.id} 
                          whileHover={{ y: -8 }}
                          className="flowy-card overflow-hidden group relative flex flex-col"
                        >
                          {isAdmin && (
                            <div className="absolute top-6 right-6 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              <button 
                                onClick={() => setEditingMemory(memory)}
                                className="p-2.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                              >
                                <Settings className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete('memories', memory.id)}
                                className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                              <div 
                                className="aspect-[16/9] overflow-hidden cursor-zoom-in"
                                onClick={() => memory.image_url && setZoomedImage(memory.image_url)}
                              >
                                {memory.image_url ? (
                                  <img src={memory.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                                ) : (
                                  <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                                    <History className="w-12 h-12 text-slate-200" />
                                  </div>
                                )}
                              </div>
                          <div className="p-8 text-center">
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{memory.caption}</h3>
                            <p className="text-blue-800 font-black uppercase text-[10px] tracking-[0.2em] mt-3">Batch {memory.batch}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'voting' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-5xl font-sans font-black text-blue-900 mb-12 tracking-tight">Voting Portal</h2>
                  {!isAdmin && user?.has_voted ? (
                    <motion.div 
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="flowy-card p-16 text-center bg-emerald-50/30 border-emerald-100"
                    >
                      <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto mb-8" />
                      <h3 className="text-3xl font-black text-emerald-900 mb-4 tracking-tight">Vote Cast Successfully</h3>
                      <p className="text-emerald-700 font-bold">Thank you for participating in the ARSC elections!</p>
                    </motion.div>
                  ) : (
                    <VotingForm 
                      candidates={candidates} 
                      user={user} 
                      restriction={votingRestriction} 
                      onVote={() => { fetchData(); setUser(prev => prev ? { ...prev, has_voted: 1 } : null); }}
                      isAdmin={isAdmin}
                      partylists={partylists}
                      onDelete={(id) => handleDelete('candidates', id)}
                      onZoom={setZoomedImage}
                    />
                  )}
                </div>
              )}

              {activeTab === 'suggestions' && (
                <SuggestionsView studentId={user?.id} />
              )}

              {activeTab === 'admin' && isAdmin && (
                <AdminPanel 
                  onUpdate={fetchData} 
                  logos={logos} 
                  restriction={votingRestriction}
                  stats={stats}
                  editingNews={editingNews}
                  setEditingNews={setEditingNews}
                  editingOfficer={editingOfficer}
                  setEditingOfficer={setEditingOfficer}
                  editingMemory={editingMemory}
                  setEditingMemory={setEditingMemory}
                  fetchData={fetchData}
                  homeContent={homeContent}
                  inquiries={inquiries}
                  suggestions={suggestions}
                  onZoom={setZoomedImage}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Modal 
        isOpen={!!editingNews} 
        onClose={() => setEditingNews(null)} 
        title={editingNews?.id ? "Edit News" : "Add News"}
      >
        <AddNews 
          onComplete={() => { setEditingNews(null); fetchData(); }} 
          initialData={editingNews?.id ? editingNews : undefined} 
        />
      </Modal>

      <Modal 
        isOpen={!!editingOfficer} 
        onClose={() => setEditingOfficer(null)} 
        title={editingOfficer?.id ? "Edit Officer" : "Add Officer"}
      >
        <AddOfficer 
          onComplete={() => { setEditingOfficer(null); fetchData(); }} 
          initialData={editingOfficer?.id ? editingOfficer : undefined} 
        />
      </Modal>

      <Modal 
        isOpen={!!editingMemory} 
        onClose={() => setEditingMemory(null)} 
        title={editingMemory?.id ? "Edit Memory" : "Add Memory"}
      >
        <AddMemory 
          onComplete={() => { setEditingMemory(null); fetchData(); }} 
          initialData={editingMemory?.id ? editingMemory : undefined} 
        />
      </Modal>

      <ZoomModal 
        imageUrl={zoomedImage || ''} 
        isOpen={!!zoomedImage} 
        onClose={() => setZoomedImage(null)} 
      />
    </div>
  );
}

const ZoomModal = ({ imageUrl, isOpen, onClose }: { imageUrl: string, isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl cursor-zoom-out" onClick={onClose}>
      <motion.img 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        src={imageUrl} 
        className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
        onClick={e => e.stopPropagation()}
        referrerPolicy="no-referrer"
      />
      <button onClick={onClose} className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-all">
        <XCircle className="w-8 h-8" />
      </button>
    </div>
  );
};

const HomeManager = ({ content, onUpdate }: { content: HomeContent[], onUpdate: () => void }) => {
  const [editing, setEditing] = useState<Partial<HomeContent> | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id ? `https://ihma-backend.onrender.com/api/home-content/${editing.id}` : 'https://ihma-backend.onrender.com/api/home-content';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editing)
    });
    setEditing(null);
    onUpdate();
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-black text-blue-900 tracking-tight">Home Page Content</h3>
        <button 
          onClick={() => setEditing({ title: '', content: '' })}
          className="flowy-button bg-blue-900 text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Section
        </button>
      </div>

      <div className="grid gap-6">
        {content.map(section => (
          <div key={section.id} className="flowy-card p-8 flex items-center justify-between group">
            <div className="space-y-2">
              <h4 className="text-xl font-black text-blue-900">{section.title}</h4>
              <p className="text-slate-400 font-bold text-sm line-clamp-1">{section.content}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={() => setEditing(section)}
                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={async () => {
                  if (confirm('Delete this section?')) {
                    await fetch(`https://ihma-backend.onrender.com/api/home-content/${section.id}`, { method: 'DELETE' });
                    onUpdate();
                  }
                }}
                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!editing} 
        onClose={() => setEditing(null)} 
        title={editing?.id ? "Edit Section" : "Add Section"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Section Title</label>
            <input 
              type="text" 
              value={editing?.title || ''}
              onChange={e => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white/50 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Content</label>
            <textarea 
              value={editing?.content || ''}
              onChange={e => setEditing({ ...editing, content: e.target.value })}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white/50 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-700 min-h-[200px]"
              required
            />
          </div>
          <button type="submit" className="w-full flowy-button bg-blue-900 text-white">Save Section</button>
        </form>
      </Modal>
    </div>
  );
};

const VotingForm = ({ candidates, user, restriction, onVote, isAdmin, partylists, onDelete, onZoom }: { candidates: Candidate[], user: Student | null, restriction: string, onVote: () => void, isAdmin: boolean, partylists: Partylist[], onDelete?: (id: number) => void, onZoom?: (url: string) => void }) => {
  const [selectedVotes, setSelectedVotes] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  // Filter candidates based on individual voting restriction
  const eligibleCandidates = candidates.filter(c => {
    if (isAdmin) return true;
    if (!c.voting_restriction || c.voting_restriction === 'everyone') return true;
    const restrictions = c.voting_restriction.split(',');
    return restrictions.includes(user?.year || '');
  });

  const categories = ['Executive', 'Legislative', 'Departmental', 'Judiciary', 'Ministries', 'Teacher Servant', 'Sister Servant'];
  const partylistPlatforms = partylists.filter(p => p.platform_image_url);

  const handleVote = async () => {
    if (isAdmin) return alert("Admins cannot vote.");
    setSubmitting(true);
    const votes = Object.entries(selectedVotes).map(([pos, id]) => ({ position: pos, candidate_id: id }));
    await fetch('https://ihma-backend.onrender.com/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id: user?.id, votes })
    });
    onVote();
    setSubmitting(false);
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Part 1: Partylist Platforms */}
      {partylistPlatforms.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-black text-blue-900 tracking-tight">Partylist Platforms</h3>
            <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full" />
          </div>
          <div className="grid gap-6">
            {partylistPlatforms.map((p) => (
              <div key={p.id} className="flowy-card overflow-hidden">
                <div className="bg-blue-800 px-6 py-3 text-white font-black tracking-tight">{p.name} Platform</div>
                <img src={p.platform_image_url} className="w-full h-auto" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voting Sections */}
      {eligibleCandidates.length === 0 ? (
        <div className="flowy-card p-20 text-center border-dashed border-2 border-slate-100">
          <Vote className="w-16 h-16 text-blue-100 mx-auto mb-6" />
          <p className="text-slate-400 text-xl font-bold">No eligible candidates found for your grade level.</p>
        </div>
      ) : (
        categories.map(cat => {
          const catCandidates = eligibleCandidates.filter(c => c.category === cat);
          if (catCandidates.length === 0) return null;
          const positions = Array.from(new Set(catCandidates.map(c => c.position)));

          return (
            <div key={cat} className="space-y-8">
              <div className="text-center">
                <h3 className="text-3xl font-black text-blue-900 tracking-tight">{cat} Candidates</h3>
                <div className="h-1 w-12 bg-red-600 mx-auto mt-2 rounded-full" />
              </div>
              
              {positions.map(pos => (
                <div key={pos} className="flowy-card p-8">
                  <h4 className="text-xl font-black mb-6 text-slate-800 border-b border-slate-100 pb-3 tracking-tight">{pos}</h4>
                  <div className="space-y-4">
                    {catCandidates.filter(c => c.position === pos).map(c => (
                      <label key={c.id} className={cn(
                        "flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                        selectedVotes[pos] === c.id 
                          ? "border-blue-800 bg-blue-50/50 shadow-md" 
                          : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                            selectedVotes[pos] === c.id ? "border-blue-800 bg-blue-800" : "border-slate-300"
                          )}>
                            {selectedVotes[pos] === c.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          {c.image_url && (
                            <img 
                              src={c.image_url} 
                              alt={c.name} 
                              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm cursor-zoom-in" 
                              referrerPolicy="no-referrer"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onZoom?.(c.image_url!);
                              }}
                            />
                          )}
                          <input 
                            type="radio" 
                            name={pos} 
                            checked={selectedVotes[pos] === c.id}
                            onChange={() => setSelectedVotes(prev => ({ ...prev, [pos]: c.id }))}
                            className="hidden"
                          />
                          <div>
                            <span className="font-bold text-slate-700 block">{c.name}</span>
                            <span className="text-[10px] font-black uppercase text-blue-800 tracking-widest">{c.partylist_name || 'Independent'}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{c.grade_level}</span>
                          {isAdmin && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete?.(c.id);
                              }}
                              className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}

      {!isAdmin && (
        <button 
          onClick={handleVote}
          disabled={submitting || Object.keys(selectedVotes).length === 0}
          className="w-full flowy-button bg-blue-900 text-white disabled:opacity-50 disabled:shadow-none sticky bottom-8 z-30 shadow-2xl"
        >
          {submitting ? 'Processing Ballot...' : 'Submit Official Vote'}
        </button>
      )}
    </div>
  );
};

const AdminPanel = ({ 
  onUpdate, 
  logos, 
  restriction, 
  stats,
  editingNews,
  setEditingNews,
  editingOfficer,
  setEditingOfficer,
  editingMemory,
  setEditingMemory,
  fetchData,
  homeContent,
  inquiries,
  suggestions,
  onZoom
}: { 
  onUpdate: () => void, 
  logos: any, 
  restriction: string, 
  stats: any,
  editingNews: News | null,
  setEditingNews: (n: News | null) => void,
  editingOfficer: Officer | null,
  setEditingOfficer: (o: Officer | null) => void,
  editingMemory: Memory | null,
  setEditingMemory: (m: Memory | null) => void,
  fetchData: () => void,
  homeContent: HomeContent[],
  inquiries: Inquiry[],
  suggestions: Suggestion[],
  onZoom?: (url: string) => void
}) => {
  const [activeSubTab, setActiveSubTab] = useState('news');
  const [showResultPresenter, setShowResultPresenter] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('logo', file);
    formData.append('key', key);
    await fetch('https://ihma-backend.onrender.com/api/settings/logo', { method: 'POST', body: formData });
    onUpdate();
  };

  const handleStudentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    await fetch('https://ihma-backend.onrender.com/api/upload-students', { method: 'POST', body: formData });
    onUpdate();
    alert("Student database updated!");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-6xl font-sans font-black text-blue-900 text-center mb-16 tracking-tight">Admin Dashboard</h2>
      
      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar justify-center">
        {['home', 'positions', 'voting', 'students', 'sections', 'inquiries', 'suggestions', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={cn(
              "px-8 py-4 rounded-2xl text-sm font-black capitalize transition-all whitespace-nowrap",
              activeSubTab === tab 
                ? "bg-blue-900 text-white shadow-lg shadow-blue-100" 
                : "bg-white text-slate-400 border border-slate-100 hover:border-blue-300 hover:text-blue-800"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flowy-card p-10">
        {activeSubTab === 'home' && <HomeManager content={homeContent} onUpdate={fetchData} />}
        {activeSubTab === 'positions' && <PositionManager onUpdate={onUpdate} />}
        {activeSubTab === 'voting' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <TermManager onUpdate={onUpdate} />
              <PartylistManager onUpdate={onUpdate} />
            </div>
            <div className="border-t border-slate-100 pt-10">
              <AddCandidate onComplete={onUpdate} />
            </div>
            {stats && (
              <div className="border-t border-slate-100 pt-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Election Results & Monitoring</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowResultPresenter(true)}
                      className="px-6 py-3 bg-blue-50 text-blue-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all"
                    >
                      Result Presenter
                    </button>
                  </div>
                </div>

                <Modal 
                  isOpen={showResultPresenter} 
                  onClose={() => setShowResultPresenter(false)} 
                  title="Election Results Presenter"
                >
                  <div className="space-y-12 py-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-6 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Students</p>
                        <p className="text-3xl font-black text-blue-900">{stats.totalStudents}</p>
                      </div>
                      <div className="bg-emerald-50 p-6 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Voted</p>
                        <p className="text-3xl font-black text-emerald-700">{stats.votedCount}</p>
                      </div>
                      <div className="bg-amber-50 p-6 rounded-3xl text-center">
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Turnout</p>
                        <p className="text-3xl font-black text-amber-700">{((stats.votedCount / stats.totalStudents) * 100 || 0).toFixed(1)}%</p>
                      </div>
                    </div>
                    
                    <div className="space-y-10">
                      {Array.from(new Set(stats.results.map((r: any) => r.position))).map((pos: any) => {
                        const candidates = stats.results.filter((r: any) => r.position === pos).sort((a: any, b: any) => b.votes - a.votes);
                        const winner = candidates[0];
                        return (
                          <div key={pos} className="space-y-4">
                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2">{pos}</h4>
                            <div className="grid grid-cols-1 gap-4">
                              {candidates.map((c: any, idx: number) => (
                                <div key={c.id} className={cn(
                                  "p-5 rounded-2xl flex items-center justify-between",
                                  idx === 0 ? "bg-blue-800 text-white shadow-lg shadow-blue-100" : "bg-slate-50 text-slate-700"
                                )}>
                                  <div className="flex items-center gap-4">
                                    <div className={cn(
                                      "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0",
                                      idx === 0 ? "bg-white/20" : "bg-slate-200"
                                    )}>
                                      {idx + 1}
                                    </div>
                                    {c.image_url && (
                                      <img 
                                        src={c.image_url} 
                                        alt={c.name} 
                                        className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 cursor-zoom-in" 
                                        referrerPolicy="no-referrer"
                                        onClick={() => onZoom?.(c.image_url!)}
                                      />
                                    )}
                                    <div>
                                      <p className="font-black tracking-tight">{c.name}</p>
                                      <p className={cn(
                                        "text-[10px] font-black uppercase tracking-widest",
                                        idx === 0 ? "text-white/60" : "text-slate-400"
                                      )}>{c.partylist_name || 'Independent'}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-black text-xl">{c.votes}</p>
                                    <p className={cn(
                                      "text-[10px] font-black uppercase tracking-widest",
                                      idx === 0 ? "text-white/60" : "text-slate-400"
                                    )}>votes</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Modal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100">
                    <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-2">Total Students</p>
                    <p className="text-4xl font-bold text-blue-900">{stats.totalStudents}</p>
                  </div>
                  <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                    <p className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-2">Voted</p>
                    <p className="text-4xl font-bold text-emerald-700">{stats.votedCount}</p>
                  </div>
                  <div className="bg-amber-50 p-8 rounded-[2rem] border border-amber-100">
                    <p className="text-xs text-amber-400 font-black uppercase tracking-widest mb-2">Turnout</p>
                    <p className="text-4xl font-bold text-amber-700">{((stats.votedCount / stats.totalStudents) * 100 || 0).toFixed(1)}%</p>
                  </div>
                </div>

                <div className="mb-12">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Turnout by Grade Level</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[4,5,6,7,8,9,10,11,12].map(grade => {
                      const gradeVoters = stats.voters.filter((v: any) => v.year === `Grade ${grade}`);
                      const gradeVoted = gradeVoters.filter((v: any) => v.has_voted).length;
                      const total = gradeVoters.length;
                      const percent = (gradeVoted / total) * 100 || 0;
                      return (
                        <div key={grade} className="p-4 bg-slate-50 rounded-2xl border border-slate-50 text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Grade {grade}</p>
                          <p className="text-lg font-black text-slate-800">{percent.toFixed(0)}%</p>
                          <p className="text-[10px] text-slate-400 mt-1">{gradeVoted}/{total}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-12">
                  {Array.from(new Set(stats.results.map((r: any) => r.position))).map((pos: any) => (
                    <div key={pos} className="space-y-6">
                      <h4 className="text-lg font-black text-slate-800 border-b border-slate-50 pb-2 tracking-tight">{pos}</h4>
                      <div className="space-y-4">
                        {stats.results.filter((r: any) => r.position === pos).map((r: any) => (
                          <div key={r.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-50">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-black text-slate-800 text-lg tracking-tight">{r.name}</p>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{r.partylist_name || 'Independent'}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-blue-900 text-xl">{r.votes} <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">votes</span></p>
                              </div>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(r.votes / stats.votedCount) * 100 || 0}%` }}
                                className="h-full bg-blue-800" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {activeSubTab === 'students' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-6 text-slate-800">Add Student Manually</h3>
                <AddStudent onComplete={onUpdate} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-800">Upload Student Database</h3>
                <p className="text-sm text-slate-500 mb-6">Upload a CSV file with a <code className="bg-slate-100 px-2 py-1 rounded text-blue-800 font-bold">student_number</code> column.</p>
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-[2.5rem] cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group">
                  <Upload className="w-10 h-10 text-slate-300 mb-4 group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                  <span className="text-sm font-bold text-slate-500 group-hover:text-blue-800">Click to upload CSV</span>
                  <input type="file" accept=".csv" className="hidden" onChange={handleStudentUpload} />
                </label>
              </div>
            </div>
            {stats && (
              <div className="border-t border-slate-100 pt-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800">Voter Monitoring</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to reset ALL votes? This cannot be undone.')) {
                          await fetch('https://ihma-backend.onrender.com/api/students/reset-all-votes', { method: 'POST' });
                          onUpdate();
                        }
                      }}
                      className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all"
                    >
                      Reset All Votes
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to CLEAR ALL students? This will delete all student records and their votes. This cannot be undone.')) {
                          await fetch('https://ihma-backend.onrender.com/api/students/clear-all', { method: 'POST' });
                          onUpdate();
                        }
                      }}
                      className="px-4 py-2 bg-blue-50 text-blue-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-800 hover:text-white transition-all"
                    >
                      Clear All Students
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                        <th className="pb-6">Name</th>
                        <th className="pb-6">Year & Section</th>
                        <th className="pb-6">Status</th>
                        <th className="pb-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {stats.voters.map((v: any, i: number) => (
                        <tr key={i} className="text-sm group hover:bg-slate-50 transition-colors">
                          <td className="py-5 font-bold text-slate-700">{v.name || 'Not Registered'}</td>
                          <td className="py-5 text-slate-500 font-medium">{v.year} — {v.section}</td>
                          <td className="py-5">
                            {v.has_voted ? (
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Voted</span>
                            ) : (
                              <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>
                            )}
                          </td>
                          <td className="py-5 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                              {v.has_voted && (
                                <button 
                                  onClick={async () => {
                                    if (confirm(`Reset vote for ${v.name || 'this student'}?`)) {
                                      await fetch(`https://ihma-backend.onrender.com/api/students/${v.id}/reset-vote`, { method: 'POST' });
                                      onUpdate();
                                    }
                                  }}
                                  className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all"
                                  title="Reset Vote"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={async () => {
                                  if (confirm(`Delete student ${v.name || 'this student'}?`)) {
                                    await fetch(`https://ihma-backend.onrender.com/api/students/${v.id}`, { method: 'DELETE' });
                                    onUpdate();
                                  }
                                }}
                                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                title="Delete Student"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
        {activeSubTab === 'sections' && <SectionManager onUpdate={onUpdate} />}
        {activeSubTab === 'inquiries' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Student Inquiries</h3>
            <div className="grid gap-6">
              {inquiries.length === 0 ? (
                <div className="p-24 text-center border-dashed border-2 border-slate-100 rounded-[2.5rem]">
                  <Mail className="w-16 h-16 text-blue-100 mx-auto mb-6" />
                  <p className="text-slate-300 text-xl font-bold">No inquiries yet</p>
                </div>
              ) : (
                inquiries.map(inq => (
                  <div key={inq.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 relative group">
                    <button 
                      onClick={async () => {
                        if (confirm('Delete this inquiry?')) {
                          await fetch(`https://ihma-backend.onrender.com/api/inquiries/${inq.id}`, { method: 'DELETE' });
                          fetchData();
                        }
                      }}
                      className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-black text-xl">
                        {inq.name[0]}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-800">{inq.name}</h4>
                        <p className="text-sm text-slate-400 font-bold">{inq.email} • {new Date(inq.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2">{inq.subject}</p>
                      <p className="text-slate-600 font-bold leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'suggestions' && (
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Student Suggestions</h3>
            <div className="grid gap-6">
              {suggestions.length === 0 ? (
                <div className="p-24 text-center border-dashed border-2 border-slate-100 rounded-[2.5rem]">
                  <MessageSquare className="w-16 h-16 text-blue-100 mx-auto mb-6" />
                  <p className="text-slate-300 text-xl font-bold">No suggestions yet</p>
                </div>
              ) : (
                suggestions.map(sug => (
                  <div key={sug.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 relative group">
                    <button 
                      onClick={async () => {
                        if (confirm('Delete this suggestion?')) {
                          await fetch(`https://ihma-backend.onrender.com/api/suggestions/${sug.id}`, { method: 'DELETE' });
                          fetchData();
                        }
                      }}
                      className="absolute top-6 right-6 p-2 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <div className="flex items-center justify-between">
                      <div className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {sug.category}
                      </div>
                      <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">{new Date(sug.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xl text-slate-700 font-bold leading-relaxed italic">"{sug.content}"</p>
                    <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
                      <UserCircle className="w-5 h-5 text-slate-300" />
                      <span className="text-sm font-bold text-slate-400">
                        {sug.is_anonymous ? 'Anonymous Student' : `${sug.students?.name} (${sug.students?.year} - ${sug.students?.section})`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'settings' && (
          <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Logo 1</h3>
                  {logos.logo1 && (
                    <button 
                      onClick={async () => {
                        if (confirm('Delete Logo 1?')) {
                          await fetch('https://ihma-backend.onrender.com/api/settings/logo/logo1', { method: 'DELETE' });
                          onUpdate();
                        }
                      }}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <label className="block relative aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 cursor-pointer overflow-hidden hover:border-blue-300 transition-all group">
                  {logos.logo1 ? (
                    <img src={logos.logo1} className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="w-10 h-10 text-slate-200 mb-3 group-hover:text-blue-300 transition-colors" />
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500">Upload Logo 1</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={(e) => handleLogoUpload(e, 'logo1')} />
                </label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Logo 2</h3>
                  {logos.logo2 && (
                    <button 
                      onClick={async () => {
                        if (confirm('Delete Logo 2?')) {
                          await fetch('https://ihma-backend.onrender.com/api/settings/logo/logo2', { method: 'DELETE' });
                          onUpdate();
                        }
                      }}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <label className="block relative aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 cursor-pointer overflow-hidden hover:border-blue-300 transition-all group">
                  {logos.logo2 ? (
                    <img src={logos.logo2} className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="w-10 h-10 text-slate-200 mb-3 group-hover:text-blue-300 transition-colors" />
                      <span className="text-xs font-bold text-slate-400 group-hover:text-blue-500">Upload Logo 2</span>
                    </div>
                  )}
                  <input type="file" className="hidden" onChange={(e) => handleLogoUpload(e, 'logo2')} />
                </label>
              </div>
            </div>
            <div className="pt-16 border-t border-slate-100">
              <ChangePassword />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Admin Sub-Components ---

const AddNews = ({ onComplete, initialData }: { onComplete: () => void, initialData?: News }) => {
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
};
