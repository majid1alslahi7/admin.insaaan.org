'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaArrowRightToBracket, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { authAPI } from '@/lib/admin/api';
import { tokens } from '@/lib/tokens';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // استعادة البيانات المحفوظة
  useEffect(() => {
    const savedEmail = localStorage.getItem('admin-email');
    const savedRemember = localStorage.getItem('admin-remember') === 'true';
    if (savedRemember && savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authAPI.login(email, password);
      
      // حفظ التوكن والمستخدم
      localStorage.setItem('admin-token', data.token);
      localStorage.setItem('admin-user', JSON.stringify(data.user));
      
      // حفظ البريد إذا تم تفعيل "تذكرني"
      if (rememberMe) {
        localStorage.setItem('admin-email', email);
        localStorage.setItem('admin-remember', 'true');
      } else {
        localStorage.removeItem('admin-email');
        localStorage.removeItem('admin-remember');
      }
      
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/admin/dashboard');
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
      toast.error('فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-4 relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [45, 0, 45] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary-500/10 blur-3xl" 
        />
        <motion.div 
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-accent-500/10 blur-3xl" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, type: "spring" }}
        className="relative z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/20 dark:border-gray-700/50"
      >
        {/* الشعار */}
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ delay: 0.2, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
              <Image src="/icon1.png" alt="Logo" width={64} height={64} className="w-full h-full object-cover" />
            </div>
          </div>
        </motion.div>

        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"
          >
            {tokens.brand.name}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="text-gray-500 dark:text-gray-400 mt-1 text-sm"
          >
            لوحة التحكم الإدارية
          </motion.p>
        </div>

        {/* رسالة الخطأ */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm mb-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* حقل البريد */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
            <div className="relative group">
              <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full pr-12 pl-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                placeholder="admin@eusran.org" 
                required 
              />
            </div>
          </div>

          {/* حقل كلمة المرور */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">كلمة المرور</label>
            <div className="relative group">
              <FaLock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full pr-24 pl-4 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
              </button>
            </div>
          </div>

          {/* تذكرني */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
                className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" 
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">تذكرني</span>
            </label>
          </div>

          {/* زر الدخول */}
          <motion.button 
            type="submit" 
            disabled={loading} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الدخول...
              </>
            ) : (
              <>
                <FaArrowRightToBracket /> دخول
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
