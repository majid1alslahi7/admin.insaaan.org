'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaMapPin, FaCalendar, FaPencil, FaArrowLeft, FaShield, FaClock } from 'react-icons/fa6';
import { authAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    const userData = localStorage.getItem('admin-user');
    
    if (!token) {
      router.push('/admin/login');
    } else if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: 'مدير النظام', email: 'admin@eusran.org' });
      }
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="pt-navbar min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-navbar container-page min-h-screen">
      {/* رأس الصفحة */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <FaArrowLeft />
        </Link>
        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
        <Link href="/admin/profile/edit" className="btn btn-primary mr-auto">
          <FaPencil /> تعديل الملف الشخصي
        </Link>
      </div>

      {/* بطاقة المعلومات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* الصورة والمعلومات الأساسية */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <FaUser className="text-5xl text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">{user?.name || 'مدير النظام'}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">مدير النظام</p>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mb-3">
                <FaEnvelope className="text-primary-500" />
                <span>{user?.email || 'admin@eusran.org'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 mb-3">
                <FaPhone className="text-primary-500" />
                <span>{user?.phone || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <FaMapPin className="text-primary-500" />
                <span>{user?.address || 'غير محدد'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* التفاصيل والإحصائيات */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          {/* معلومات الحساب */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaUser className="text-primary-500" /> معلومات الحساب
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-500 mb-1">الاسم الكامل</label>
                <p className="font-medium">{user?.name || 'مدير النظام'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">البريد الإلكتروني</label>
                <p className="font-medium">{user?.email || 'admin@eusran.org'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">رقم الهاتف</label>
                <p className="font-medium">{user?.phone || 'غير محدد'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">الدور</label>
                <p className="font-medium">مدير النظام</p>
              </div>
            </div>
          </div>

          {/* الأمان */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaShield className="text-primary-500" /> الأمان
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">كلمة المرور</p>
                  <p className="text-sm text-gray-500">آخر تحديث: منذ 30 يوم</p>
                </div>
                <Link href="/admin/profile/edit" className="text-primary-500 hover:text-primary-600">
                  تغيير كلمة المرور
                </Link>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">التحقق بخطوتين</p>
                  <p className="text-sm text-gray-500">غير مفعل</p>
                </div>
                <button className="text-primary-500 hover:text-primary-600">تفعيل</button>
              </div>
            </div>
          </div>

          {/* النشاط */}
          <div className="card">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <FaClock className="text-primary-500" /> آخر النشاطات
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">تسجيل الدخول - قبل 5 دقائق</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">تحديث الإعدادات - أمس</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">تسجيل الدخول - 2026-04-18</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
