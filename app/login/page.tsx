'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEnvelope, FaLock, FaArrowRightToBracket, FaEye, FaEyeSlash } from 'react-icons/fa6';
import { authAPI } from '@/lib/api';
import { tokens } from '@/lib/tokens';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      localStorage.setItem('admin-token', data.token);
      localStorage.setItem('admin-user', JSON.stringify(data.user));
      
      if (rememberMe) {
        localStorage.setItem('admin-email', email);
        localStorage.setItem('admin-remember', 'true');
      } else {
        localStorage.removeItem('admin-email');
        localStorage.removeItem('admin-remember');
      }
      
      toast.success('تم تسجيل الدخول بنجاح');
      router.push('/dashboard');
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
      toast.error('فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image src="/icon1.png" alt="Logo" width={80} height={80} className="rounded-xl" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">{tokens.brand.name}</h1>
        <p className="text-gray-500 text-center mb-6">لوحة التحكم</p>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">كلمة المرور</label>
            <div className="relative">
              <FaLock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full pr-20 p-3 border rounded-xl" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="ml-2" />
            <label className="text-sm">تذكرني</label>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 flex items-center justify-center gap-2">
            <FaArrowRightToBracket /> {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
