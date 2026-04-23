'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaEye, FaEyeSlash, FaFloppyDisk } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { usersAPI } from '@/lib/api';

type ProfileForm = {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  current_password: string;
  password: string;
  password_confirmation: string;
};

type ProfileUser = {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
};

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const user = (await usersAPI.profile()) as ProfileUser;
        if (!active) return;
        setForm((current) => ({
          ...current,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          avatar: user.avatar || '',
        }));
      } catch {
        const cachedUser = localStorage.getItem('admin-user');
        if (cachedUser && active) {
          const user = JSON.parse(cachedUser) as ProfileUser;
          setForm((current) => ({
            ...current,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            avatar: user.avatar || '',
          }));
        }
        toast.error('تعذر تحميل بيانات الملف الشخصي');
      } finally {
        if (active) setInitializing(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (form.password && form.password !== form.password_confirmation) {
      toast.error('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      const updateData: {
        name: string;
        phone: string;
        avatar: string;
        current_password?: string;
        password?: string;
        password_confirmation?: string;
      } = {
        name: form.name,
        phone: form.phone,
        avatar: form.avatar,
      };

      if (form.password) {
        updateData.current_password = form.current_password;
        updateData.password = form.password;
        updateData.password_confirmation = form.password_confirmation;
      }

      const updatedUser = (await usersAPI.updateProfile(updateData)) as ProfileUser;
      localStorage.setItem('admin-user', JSON.stringify({ ...updatedUser, email: form.email }));
      toast.success('تم تحديث الملف الشخصي بنجاح', { icon: '✓', style: { background: '#159C4B', color: '#fff' } });
      router.push('/profile');
    } catch {
      toast.error('فشل تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  }

  if (initializing) {
    return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <FaArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">تعديل الملف الشخصي</h1>
          <p className="text-sm text-gray-500">البريد للعرض فقط؛ الباكند يسمح بتعديل الاسم والهاتف والصورة وكلمة المرور</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">الاسم</label>
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">الهاتف</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
            <h3 className="font-bold mb-2">تغيير كلمة المرور</h3>
            <p className="text-sm text-gray-500 mb-3">اترك الحقول فارغة إذا لم ترغب في تغيير كلمة المرور</p>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.current_password}
                  onChange={(event) => setForm({ ...form, current_password: event.target.value })}
                  placeholder="كلمة المرور الحالية"
                  className="w-full p-3 pl-11 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
                />
                <button type="button" onClick={() => setShowPass((value) => !value)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="كلمة المرور الجديدة"
                className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
                minLength={8}
              />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password_confirmation}
                onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })}
                placeholder="تأكيد كلمة المرور"
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
              value={form.avatar}
              onChange={(url) => setForm({ ...form, avatar: url })}
              folder="users/avatars"
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              <FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <Link href="/profile" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
