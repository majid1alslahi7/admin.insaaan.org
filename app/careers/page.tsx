'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaMapPin, FaBriefcase, FaCalendar } from 'react-icons/fa6';
import { careersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CareersPage() {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchCareers(); }, []);
  async function fetchCareers() { try { const data = await careersAPI.getAll(); setCareers(data.data || data); } catch { toast.error('خطأ في تحميل الوظائف'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { try { await careersAPI.delete(id); setCareers(careers.filter(c => c.id !== id)); toast.success('تم حذف الوظيفة'); setDeleteId(null); } catch { toast.error('فشل الحذف'); } }
  const filtered = careers.filter(c => c.title_ar?.includes(search) || c.title?.includes(search));
  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">الوظائف</h1><Link href="/careers/create" className="btn btn-primary"><FaPlus /> وظيفة جديدة</Link></div>
      <div className="mb-4 relative max-w-md"><FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" /></div>
      <div className="card overflow-hidden !p-0"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50"><tr><th className="p-4">المسمى</th><th className="p-4">القسم</th><th className="p-4">الموقع</th><th className="p-4">النوع</th><th className="p-4">آخر موعد</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead><tbody>
        {filtered.map(item => (
          <tr key={item.id} className="border-t"><td className="p-4 font-medium">{item.title_ar}</td><td className="p-4">{item.department || '-'}</td><td className="p-4"><FaMapPin className="inline ml-1" /> {item.location}</td><td className="p-4">{item.type === 'full_time' ? 'دوام كامل' : 'دوام جزئي'}</td><td className="p-4"><FaCalendar className="inline ml-1" /> {item.deadline ? new Date(item.deadline).toLocaleDateString('ar-SA') : 'غير محدد'}</td>
            <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>{item.published ? 'منشور' : 'مخفي'}</span></td>
            <td className="p-4"><div className="flex gap-2"><Link href={`/careers/${item.id}/edit`} className="p-2 text-blue-500"><FaPencil /></Link><button onClick={() => setDeleteId(item.id)} className="p-2 text-red-500"><FaTrashCan /></button></div></td>
          </tr>
        ))}
      </tbody></table></div></div>
      <AnimatePresence>{deleteId && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setDeleteId(null)}><div className="bg-white p-6 rounded-2xl max-w-md" onClick={e=>e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذه الوظيفة؟</p><div className="flex gap-3 justify-end"><button onClick={()=>setDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded-xl">إلغاء</button><button onClick={()=>handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-xl">حذف</button></div></div></motion.div>)}</AnimatePresence>
    </div>
  );
}
