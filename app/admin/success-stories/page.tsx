'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaUser, FaMapPin } from 'react-icons/fa6';
import { adminSuccessStoriesAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminSuccessStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchStories(); }, []);

  async function fetchStories() {
    try { setLoading(true); const data = await adminSuccessStoriesAPI.getAll(); setStories(Array.isArray(data) ? data : data?.data || []); }
    catch { toast.error('خطأ في تحميل قصص النجاح'); } finally { setLoading(false); }
  }

  async function handleDelete(id: number) {
    try { await adminSuccessStoriesAPI.delete(id); setStories(stories.filter(s => s.id !== id)); toast.success('تم حذف القصة'); setDeleteId(null); }
    catch { toast.error('فشل الحذف'); }
  }

  const filteredStories = stories.filter(s => s.title_ar?.toLowerCase().includes(search.toLowerCase()) || s.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-navbar container-page min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">إدارة قصص النجاح</h1>
        <Link href="/admin/success-stories/create" className="btn btn-primary shadow-lg"><FaPlus /> إضافة قصة نجاح</Link>
      </div>
      <div className="mb-8"><div className="relative max-w-md"><FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-12 pl-4 py-3 border rounded-xl" /></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredStories.length === 0 ? <div className="col-span-full text-center py-12 text-gray-500">لا توجد قصص نجاح</div> : filteredStories.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-lg">{item.title_ar}</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{item.published ? 'منشور' : 'مخفي'}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{item.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><FaUser /> {item.person_name}</span>
                <span className="flex items-center gap-1"><FaMapPin /> {item.location}</span>
              </div>
              <div className="flex gap-2"><Link href={`/admin/success-stories/${item.id}/edit`} className="flex-1 btn bg-blue-50 text-blue-600 !py-2"><FaPencil /></Link><button onClick={() => setDeleteId(item.id)} className="flex-1 btn bg-red-50 text-red-600 !py-2"><FaTrashCan /></button></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>{deleteId && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteId(null)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذه القصة؟</p><div className="flex gap-3 justify-end"><button onClick={() => setDeleteId(null)} className="px-5 py-2.5 bg-gray-100 rounded-xl">إلغاء</button><button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl">حذف</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}
