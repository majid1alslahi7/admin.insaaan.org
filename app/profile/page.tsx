'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarDays, FaCircleUser, FaEnvelope, FaPhone, FaPencil, FaShieldHalved } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { usersAPI } from '@/lib/api';

type ProfileUser = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  created_at?: string;
  last_login_at?: string | null;
};

const statusLabels: Record<string, string> = {
  active: 'نشط',
  inactive: 'غير نشط',
  banned: 'محظور',
};

function formatDate(value?: string | null) {
  if (!value) return 'غير محدد';
  return new Date(value).toLocaleDateString('ar-SA');
}

export default function ProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const profile = (await usersAPI.profile()) as ProfileUser;
        if (!active) return;
        setUser(profile);
        localStorage.setItem('admin-user', JSON.stringify(profile));
      } catch {
        const cachedUser = localStorage.getItem('admin-user');
        if (cachedUser && active) setUser(JSON.parse(cachedUser) as ProfileUser);
        toast.error('تعذر تحديث بيانات الملف الشخصي');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">الملف الشخصي</h1>
          <p className="text-sm text-gray-500">بيانات الحساب الحالي من الباكند</p>
        </div>
        <Link href="/profile/edit" className="btn btn-primary">
          <FaPencil /> تعديل
        </Link>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
            {user?.avatar ? (
              <Image src={user.avatar} alt={user.name || 'Profile'} fill sizes="112px" className="object-cover" unoptimized />
            ) : (
              <FaCircleUser className="text-6xl" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user?.name || 'مدير النظام'}</h2>
            <p className="text-gray-500">{user?.email || 'غير محدد'}</p>
            <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
              {statusLabels[user?.status || 'active'] || user?.status || 'نشط'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
            <FaEnvelope className="text-primary-500" />
            <div>
              <p className="text-xs text-gray-500">البريد الإلكتروني</p>
              <p className="font-medium">{user?.email || 'غير محدد'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
            <FaPhone className="text-primary-500" />
            <div>
              <p className="text-xs text-gray-500">الهاتف</p>
              <p className="font-medium">{user?.phone || 'غير محدد'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
            <FaShieldHalved className="text-primary-500" />
            <div>
              <p className="text-xs text-gray-500">الحالة</p>
              <p className="font-medium">{statusLabels[user?.status || 'active'] || user?.status || 'نشط'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-900">
            <FaCalendarDays className="text-primary-500" />
            <div>
              <p className="text-xs text-gray-500">تاريخ الإنشاء</p>
              <p className="font-medium">{formatDate(user?.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
