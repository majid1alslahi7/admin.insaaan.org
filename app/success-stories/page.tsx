'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaUser, FaMapPin, FaImages } from 'react-icons/fa6';
import { successStoriesAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchStories(); }, []);
  async function fetchStories() { try { const data = await successStoriesAPI.getAll(); setStories(data.data || data); } catch { toast.error('خطأ في تحميل القصص'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { try { await successStoriesAPI.delete(id); setStories(stories.filter(s => s.id !== id)); toast.success('تم حذف القصة'); setDeleteId(null); } catch { toast.error('فشل الحذف'); } }
  const filtered = stories.filter(s => s.title_ar?.includes(search) || s.title?.includes(search));
  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">قصص النجاح</h1><Link href="/success-stories/create" className="btn btn-primary"><FaPlus /> قصة جديدة</Link></div>
      <div className="mb-4 relative max-w-md"><FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" /></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="card p-4">
            <div className="flex justify-between mb-2"><h3 className="font-bold">{item.title_ar}</h3><span className={`px-2 py-0.5 rounded-full text-xs ${item.published?'bg-green-100 text-green-800':'bg-gray-100'}`}>{item.published?'منشور':'مخفي'}</span></div>
            <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.content}</p>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-2"><span><FaUser className="inline ml-1" /> {item.person_name}</span><span><FaMapPin className="inline ml-1" /> {item.location}</span></div>
            <div className="flex items-center gap-1 mb-3">{item.image && <FaImages className="text-green-500" />}{item.gallery?.length > 0 && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{item.gallery.length} صور</span>}</div>
            <div className="flex gap-2"><Link href={`/success-stories/${item.id}/edit`} className="flex-1 btn bg-blue-50 text-blue-600 !py-2"><FaPencil /></Link><button onClick={() => setDeleteId(item.id)} className="flex-1 btn bg-red-50 text-red-600 !py-2"><FaTrashCan /></button></div>
          </div>
        ))}
      </div>
      <AnimatePresence>{deleteId && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setDeleteId(null)}><div className="bg-white p-6 rounded-2xl max-w-md" onClick={e=>e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذه القصة؟</p><div className="flex gap-3 justify-end"><button onClick={()=>setDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded-xl">إلغاء</button><button onClick={()=>handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-xl">حذف</button></div></div></motion.div>)}</AnimatePresence>
    </div>
  );
}
