'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk, FaEye, FaEyeSlash } from 'react-icons/fa6';
import toast from 'react-hot-toast';

export default function AdminProfileEditPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    current_password: '',
    password: '',
    password_confirmation: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    const userData = localStorage.getItem('admin-user');
    
    if (!token) {
      router.push('/admin/login');
    } else if (userData) {
      try {
        const user = JSON.parse(userData);
        setForm(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || ''
        }));
      } catch (e) {}
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (form.password && form.password !== form.password_confirmation) {
        toast.error('كلمة المرور غير متطابقة');
        setLoading(false);
        return;
      }
      
      const userData = localStorage.getItem('admin-user');
      if (userData) {
        const user = JSON.parse(userData);
        user.name = form.name;
        user.email = form.email;
        user.phone = form.phone;
        user.address = form.address;
        localStorage.setItem('admin-user', JSON.stringify(user));
      }
      
      toast.success('تم تحديث الملف الشخصي بنجاح');
      router.push('/admin/profile');
    } catch (error) {
      toast.error('فشل تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-navbar container-page max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <FaArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">تعديل الملف الشخصي</h1>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-6">المعلومات الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-medium mb-2">الاسم الكامل *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
            <div><label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
            <div><label className="block text-sm font-medium mb-2">رقم الهاتف</label><input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-2">العنوان</label><input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-6">تغيير كلمة المرور</h2>
          <p className="text-sm text-gray-500 mb-4">اترك الحقول فارغة إذا كنت لا ترغب في تغيير كلمة المرور</p>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium mb-2">كلمة المرور الحالية</label><div className="relative"><input type={showPassword ? 'text' : 'password'} value={form.current_password} onChange={e => setForm({...form, current_password: e.target.value})} className="w-full p-3 border rounded-xl" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <FaEyeSlash /> : <FaEye />}</button></div></div>
            <div><label className="block text-sm font-medium mb-2">كلمة المرور الجديدة</label><div className="relative"><input type={showNewPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-3 border rounded-xl" /><button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{showNewPassword ? <FaEyeSlash /> : <FaEye />}</button></div></div>
            <div><label className="block text-sm font-medium mb-2">تأكيد كلمة المرور الجديدة</label><input type="password" value={form.password_confirmation} onChange={e => setForm({...form, password_confirmation: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</button>
          <Link href="/admin/profile" className="btn bg-gray-200 text-gray-700 hover:bg-gray-300">إلغاء</Link>
        </div>
      </motion.form>
    </div>
  );
}
