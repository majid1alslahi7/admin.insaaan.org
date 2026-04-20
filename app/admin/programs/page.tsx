'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaUsers, FaDiagramProject } from 'react-icons/fa6';
import { adminProgramsAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchPrograms(); }, []);

  async function fetchPrograms() {
    try { setLoading(true); const data = await adminProgramsAPI.getAll(); setPrograms(Array.isArray(data) ? data : data?.data || []); }
    catch { toast.error('خطأ في تحميل البرامج'); } finally { setLoading(false); }
  }

  async function handleDelete(id: number) {
    try { await adminProgramsAPI.delete(id); setPrograms(programs.filter(p => p.id !== id)); toast.success('تم حذف البرنامج'); setDeleteId(null); }
    catch { toast.error('فشل الحذف'); }
  }

  const filteredPrograms = programs.filter(p => p.name_ar?.toLowerCase().includes(search.toLowerCase()) || p.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-navbar container-page min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">إدارة البرامج</h1>
        <Link href="/admin/programs/create" className="btn btn-primary shadow-lg"><FaPlus /> إضافة برنامج</Link>
      </div>
      <div className="mb-8"><div className="relative max-w-md"><FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-12 pl-4 py-3 border rounded-xl" /></div></div>
      <div className="card overflow-hidden !p-0"><div className="overflow-x-auto"><table className="w-full min-w-[800px]"><thead className="bg-gray-50 dark:bg-gray-700/50"><tr><th className="px-6 py-4">الاسم</th><th className="px-6 py-4">الأيقونة</th><th className="px-6 py-4">المشاريع</th><th className="px-6 py-4">المستفيدين</th><th className="px-6 py-4">الإجراءات</th></tr></thead><tbody><AnimatePresence>{filteredPrograms.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">لا توجد برامج</td></tr> : filteredPrograms.map((item) => (<motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-gray-50"><td className="px-6 py-4 font-medium">{item.name_ar}</td><td className="px-6 py-4">{item.icon}</td><td className="px-6 py-4"><FaDiagramProject className="inline ml-1" /> {item.projects_count}</td><td className="px-6 py-4"><FaUsers className="inline ml-1" /> {item.individuals_count?.toLocaleString()}</td><td className="px-6 py-4"><div className="flex gap-1"><Link href={`/admin/programs/${item.id}/edit`} className="p-2 text-blue-600"><FaPencil /></Link><button onClick={() => setDeleteId(item.id)} className="p-2 text-red-600"><FaTrashCan /></button></div></td></motion.tr>))}</AnimatePresence></tbody></table></div></div>
      <AnimatePresence>{deleteId && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteId(null)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذا البرنامج؟</p><div className="flex gap-3 justify-end"><button onClick={() => setDeleteId(null)} className="px-5 py-2.5 bg-gray-100 rounded-xl">إلغاء</button><button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl">حذف</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}
