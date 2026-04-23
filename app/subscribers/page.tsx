'use client';
import { useState, useEffect } from 'react';
import { FaMagnifyingGlass, FaTrashCan } from 'react-icons/fa6';
import { subscribersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState('');
  useEffect(() => { fetchSubscribers(); }, []);
  async function fetchSubscribers() { try { const data = await subscribersAPI.getAll(); setSubscribers(data.data || data); } catch { toast.error('خطأ في التحميل'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { if(!confirm('حذف؟')) return; try { await subscribersAPI.delete(id); setSubscribers(subscribers.filter(s=>s.id!==id)); toast.success('تم الحذف'); } catch { toast.error('فشل الحذف'); } }
  const filtered = subscribers.filter(s => s.email?.includes(search) || s.name?.includes(search));
  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  return (
    <div className="p-6"><h1 className="text-2xl font-bold mb-6">المشتركين</h1><div className="mb-4 relative max-w-md"><FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" /></div>
      <div className="card overflow-hidden !p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="p-4">البريد</th><th className="p-4">الاسم</th><th className="p-4">تاريخ الاشتراك</th><th className="p-4">إجراءات</th></tr></thead><tbody>
        {filtered.map(s=>(<tr key={s.id} className="border-t"><td className="p-4">{s.email}</td><td className="p-4">{s.name||'-'}</td><td className="p-4">{new Date(s.created_at).toLocaleDateString('ar-SA')}</td><td className="p-4"><button onClick={()=>handleDelete(s.id)} className="p-2 text-red-500"><FaTrashCan /></button></td></tr>))}
      </tbody></table></div></div></div>
  );
}
