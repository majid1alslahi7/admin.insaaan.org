'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaEye, FaEyeSlash, FaFloppyDisk } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { usersAPI } from '@/lib/api';

type UserForm = {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'banned' | string;
  password?: string;
  password_confirmation?: string;
};

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<UserForm | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        const user = (await usersAPI.getOne(Number(id))) as UserForm;
        if (active) setForm({ ...user, password: '', password_confirmation: '' });
      } catch {
        toast.error('تعذر تحميل بيانات المستخدم');
        router.push('/users');
      }
    }

    if (id) void loadUser();

    return () => {
      active = false;
    };
  }, [id, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;

    if (form.password && form.password !== form.password_confirmation) {
      toast.error('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    setLoading(true);
    try {
      const payload: UserForm = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        avatar: form.avatar,
        status: form.status,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await usersAPI.update(Number(id), payload);
      toast.success('تم تحديث المستخدم بنجاح', { icon: '✓', style: { background: '#159C4B', color: '#fff' } });
      router.push('/users');
    } catch {
      toast.error('فشل تحديث المستخدم');
    } finally {
      setLoading(false);
    }
  }

  if (!form) {
    return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/users" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">تعديل مستخدم</h1>
          <p className="text-sm text-gray-500">اترك كلمة المرور فارغة إذا لم ترغب بتغييرها</p>
        </div>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">الاسم *</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الهاتف</label>
              <input
                type="tel"
                value={form.phone || ''}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">الحالة</label>
              <select
                value={form.status || 'active'}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
                <option value="banned">محظور</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium mb-2">كلمة مرور جديدة</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password || ''}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="w-full p-3 pl-11 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
                  minLength={8}
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password_confirmation || ''}
                onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })}
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
                minLength={8}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card">
            <ImageUploader
              label="الصورة الشخصية"
              value={form.avatar || ''}
              onChange={(url) => setForm({ ...form, avatar: url })}
              folder="users/avatars"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              <FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث المستخدم'}
            </button>
            <Link href="/users" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
