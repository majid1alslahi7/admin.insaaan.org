'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaVideo, FaPlay } from 'react-icons/fa6';
import { adminVideosAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchVideos(); }, []);
  async function fetchVideos() { try { setLoading(true); const data = await adminVideosAPI.getAll(); setVideos(Array.isArray(data) ? data : data?.data || []); } catch { toast.error('خطأ في تحميل الفيديوهات'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { try { await adminVideosAPI.delete(id); setVideos(videos.filter(v => v.id !== id)); toast.success('تم حذف الفيديو'); setDeleteId(null); } catch { toast.error('فشل الحذف'); } }

  const filteredVideos = videos.filter(v => v.title_ar?.toLowerCase().includes(search.toLowerCase()) || v.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-navbar container-page min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"><h1 className="text-3xl font-bold">مكتبة الفيديو</h1><Link href="/admin/videos/create" className="btn btn-primary shadow-lg"><FaPlus /> إضافة فيديو</Link></div>
      <div className="mb-8"><div className="relative max-w-md"><FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-12 pl-4 py-3 border rounded-xl" /></div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredVideos.length === 0 ? <div className="col-span-full text-center py-12"><FaVideo className="text-6xl text-gray-300 mx-auto mb-4" /><p>لا توجد فيديوهات</p></div> : filteredVideos.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card p-0 overflow-hidden">
              <div className="relative h-40 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                <FaVideo className="text-4xl text-primary-500/50" />
                <a href={item.video_url} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"><div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center"><FaPlay className="text-white" /></div></a>
              </div>
              <div className="p-4"><h3 className="font-bold mb-1 line-clamp-1">{item.title_ar}</h3><p className="text-sm text-gray-500 mb-2">{item.duration} | {item.views} مشاهدة</p><div className="flex gap-2"><Link href={`/admin/videos/${item.id}/edit`} className="flex-1 btn bg-blue-50 text-blue-600 !py-2"><FaPencil /></Link><button onClick={() => setDeleteId(item.id)} className="flex-1 btn bg-red-50 text-red-600 !py-2"><FaTrashCan /></button></div></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>{deleteId && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteId(null)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذا الفيديو؟</p><div className="flex gap-3 justify-end"><button onClick={() => setDeleteId(null)} className="px-5 py-2.5 bg-gray-100 rounded-xl">إلغاء</button><button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl">حذف</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}
