'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import {
  FaBan,
  FaCircleCheck,
  FaMagnifyingGlass,
  FaTrashCan,
  FaUserPen,
  FaUserPlus,
  FaUsersGear,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { usersAPI } from '@/lib/api';

type UserRecord = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status?: 'active' | 'inactive' | 'banned' | string;
  created_at?: string;
  last_login_at?: string | null;
};

type UserStats = {
  total?: number;
  active?: number;
  inactive?: number;
  banned?: number;
  verified?: number;
  unverified?: number;
};

type UserStatCard = {
  label: string;
  value: number;
  icon: IconType;
  className: string;
};

type UsersApiResponse = {
  data?: UserRecord[];
};

const statusClasses: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  banned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

function extractUsers(payload: UsersApiResponse | UserRecord[]) {
  return Array.isArray(payload) ? payload : payload.data || [];
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('ar-SA');
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const [usersPayload, statsPayload] = await Promise.all([
          usersAPI.getAll() as Promise<UsersApiResponse | UserRecord[]>,
          usersAPI.stats() as Promise<UserStats>,
        ]);

        if (!active) return;
        setUsers(extractUsers(usersPayload));
        setStats(statsPayload);
      } catch {
        toast.error('تعذر تحميل المستخدمين');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadUsers();

    return () => {
      active = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesTerm = !term || [user.name, user.email, user.phone]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(term));
      const matchesStatus = status === 'all' || user.status === status;
      return matchesTerm && matchesStatus;
    });
  }, [search, status, users]);

  const statCards: UserStatCard[] = [
    { label: 'الإجمالي', value: stats?.total ?? users.length, icon: FaUsersGear, className: 'bg-primary-50 text-primary-600' },
    { label: 'نشط', value: stats?.active ?? 0, icon: FaCircleCheck, className: 'bg-green-50 text-green-600' },
    { label: 'غير نشط', value: stats?.inactive ?? 0, icon: FaBan, className: 'bg-gray-100 text-gray-600' },
    { label: 'محظور', value: stats?.banned ?? 0, icon: FaBan, className: 'bg-red-50 text-red-600' },
  ];

  async function handleDelete(id: number) {
    if (!confirm('هل تريد حذف هذا المستخدم؟')) return;

    try {
      await usersAPI.delete(id);
      setUsers((items) => items.filter((item) => item.id !== id));
      toast.success('تم حذف المستخدم بنجاح', { icon: '✓', style: { background: '#DC2626', color: '#fff' } });
    } catch {
      toast.error('فشل حذف المستخدم');
    }
  }

  async function handleStatusChange(id: number, nextStatus: string) {
    try {
      await usersAPI.updateStatus(id, nextStatus);
      setUsers((items) => items.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
      toast.success('تم تحديث حالة المستخدم', { icon: '✓', style: { background: '#159C4B', color: '#fff' } });
    } catch {
      toast.error('فشل تحديث الحالة');
    }
  }

  if (loading) {
    return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">المستخدمين</h1>
          <p className="text-sm text-gray-500">إدارة حسابات لوحة التحكم وحالات الوصول</p>
        </div>
        <Link href="/users/create" className="btn btn-primary">
          <FaUserPlus /> إضافة مستخدم
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="card !p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.className}`}>
              <card.icon />
            </div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="card !p-4">
        <div className="grid md:grid-cols-[1fr_220px] gap-3">
          <div className="relative">
            <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد أو الهاتف..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pr-10 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
            <option value="banned">محظور</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/60">
              <tr>
                <th className="p-4 text-right">المستخدم</th>
                <th className="p-4 text-right">الهاتف</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">آخر دخول</th>
                <th className="p-4 text-right">تاريخ الإنشاء</th>
                <th className="p-4 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-primary-50 flex items-center justify-center text-primary-600">
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.name || 'User'} fill sizes="44px" className="object-cover" unoptimized />
                        ) : (
                          <FaUsersGear />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name || '-'}</p>
                        <p className="text-xs text-gray-500">{user.email || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{user.phone || '-'}</td>
                  <td className="p-4">
                    <select
                      value={user.status || 'active'}
                      onChange={(event) => void handleStatusChange(user.id, event.target.value)}
                      className={`px-3 py-2 rounded-full text-xs border-0 ${statusClasses[user.status || 'active'] || statusClasses.inactive}`}
                    >
                      <option value="active">نشط</option>
                      <option value="inactive">غير نشط</option>
                      <option value="banned">محظور</option>
                    </select>
                  </td>
                  <td className="p-4">{formatDate(user.last_login_at)}</td>
                  <td className="p-4">{formatDate(user.created_at)}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/users/${user.id}/edit`} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                        <FaUserPen />
                      </Link>
                      <button type="button" onClick={() => void handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <FaTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">لا توجد نتائج مطابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
