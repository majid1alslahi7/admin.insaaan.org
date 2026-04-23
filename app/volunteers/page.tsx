'use client';
import { useState, useEffect } from 'react';
import { FaMagnifyingGlass, FaTrashCan, FaCheck, FaXmark } from 'react-icons/fa6';
import { volunteersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState('');
  useEffect(() => { fetchVolunteers(); }, []);
  async function fetchVolunteers() { try { const data = await volunteersAPI.getAll(); setVolunteers(data.data || data); } catch { toast.error('خطأ في التحميل'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { if(!confirm('حذف؟')) return; try { await volunteersAPI.delete(id); setVolunteers(volunteers.filter(v=>v.id!==id)); toast.success('تم الحذف'); } catch { toast.error('فشل الحذف'); } }
  async function updateStatus(id: number, status: string) { try { await volunteersAPI.updateStatus(id, status); fetchVolunteers(); toast.success('تم تحديث الحالة'); } catch { toast.error('فشل التحديث'); } }
  const filtered = volunteers.filter(v => v.full_name?.includes(search) || v.email?.includes(search) || v.phone?.includes(search));
  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  return (
    <div className="p-6"><h1 className="text-2xl font-bold mb-6">المتطوعين</h1><div className="mb-4 relative max-w-md"><FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" /></div>
      <div className="card overflow-hidden !p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="p-4">الاسم</th><th className="p-4">البريد</th><th className="p-4">الهاتف</th><th className="p-4">المدينة</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead><tbody>
        {filtered.map(v=>(<tr key={v.id} className="border-t"><td className="p-4">{v.full_name}</td><td className="p-4">{v.email}</td><td className="p-4">{v.phone}</td><td className="p-4">{v.city}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${v.status==='approved'?'bg-green-100 text-green-800':v.status==='pending'?'bg-yellow-100 text-yellow-800':'bg-red-100 text-red-800'}`}>{v.status}</span></td>
          <td className="p-4"><div className="flex gap-2">{v.status==='pending'&&<><button onClick={()=>updateStatus(v.id,'approved')} className="p-2 text-green-500"><FaCheck /></button><button onClick={()=>updateStatus(v.id,'rejected')} className="p-2 text-red-500"><FaXmark /></button></>}<button onClick={()=>handleDelete(v.id)} className="p-2 text-red-500"><FaTrashCan /></button></div></td></tr>))}
      </tbody></table></div></div></div>
  );
}
