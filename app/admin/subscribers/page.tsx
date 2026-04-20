'use client';
import { useState, useEffect } from 'react';
import { FaMagnifyingGlass, FaTrashCan } from 'react-icons/fa6';
import { adminSubscribersAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchSubscribers(); }, []);
  async function fetchSubscribers() { try { setLoading(true); const data = await adminSubscribersAPI.getAll(); setSubscribers(Array.isArray(data) ? data : data?.data || []); } catch { toast.error('خطأ'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { if (!confirm('حذف؟')) return; try { await adminSubscribersAPI.delete(id); setSubscribers(subscribers.filter(s => s.id !== id)); toast.success('تم الحذف'); } catch { toast.error('فشل'); } }

  const filtered = subscribers.filter(s => s.email?.includes(search) || s.name?.includes(search));
  if (loading) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-navbar container-page min-h-screen">
      <h1 className="text-3xl font-bold mb-8">إدارة المشتركين</h1>
      <div className="mb-8"><div className="relative max-w-md"><FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-12 pl-4 py-3 border rounded-xl" /></div></div>
      <div className="card overflow-hidden !p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-4">البريد الإلكتروني</th><th className="px-6 py-4">الاسم</th><th className="px-6 py-4">تاريخ الاشتراك</th><th className="px-6 py-4">إجراءات</th></tr></thead><tbody>{filtered.length === 0 ? <tr><td colSpan={4} className="px-6 py-12 text-center">لا يوجد مشتركين</td></tr> : filtered.map(s => (<tr key={s.id} className="border-t"><td className="px-6 py-4">{s.email}</td><td className="px-6 py-4">{s.name}</td><td className="px-6 py-4">{new Date(s.created_at).toLocaleDateString('ar-SA')}</td><td className="px-6 py-4"><button onClick={() => handleDelete(s.id)} className="p-2 text-red-600"><FaTrashCan /></button></td></tr>))}</tbody></table></div></div>
    </div>
  );
}
