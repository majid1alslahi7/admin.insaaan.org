'use client';
import { useState, useEffect } from 'react';
import { FaMagnifyingGlass, FaEye } from 'react-icons/fa6';
import { adminVolunteersAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchVolunteers(); }, []);

  async function fetchVolunteers() {
    try { setLoading(true); const data = await adminVolunteersAPI.getAll(); setVolunteers(Array.isArray(data) ? data : data?.data || []); }
    catch { toast.error('خطأ في التحميل'); } finally { setLoading(false); }
  }

  const filtered = volunteers.filter(v => v.full_name?.includes(search) || v.email?.includes(search));

  if (loading) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-navbar container-page min-h-screen">
      <h1 className="text-3xl font-bold mb-8">إدارة المتطوعين</h1>
      <div className="mb-8"><div className="relative max-w-md"><FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-12 pl-4 py-3 border rounded-xl" /></div></div>
      <div className="card overflow-hidden !p-0"><div className="overflow-x-auto"><table className="w-full min-w-[800px]"><thead className="bg-gray-50"><tr><th className="px-6 py-4">الاسم</th><th className="px-6 py-4">البريد</th><th className="px-6 py-4">الهاتف</th><th className="px-6 py-4">المدينة</th><th className="px-6 py-4">الحالة</th></tr></thead><tbody>{filtered.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center">لا يوجد متطوعين</td></tr> : filtered.map(v => (<tr key={v.id} className="border-t"><td className="px-6 py-4">{v.full_name}</td><td className="px-6 py-4">{v.email}</td><td className="px-6 py-4">{v.phone}</td><td className="px-6 py-4">{v.city}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs ${v.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{v.status}</span></td></tr>))}</tbody></table></div></div>
    </div>
  );
}
