'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaVideo, FaEye } from 'react-icons/fa6';
import { videosAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function VideosPage() {
  const [videos, setVideos] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<number | null>(null);
  useEffect(() => { fetchVideos(); }, []);
  async function fetchVideos() { try { const data = await videosAPI.getAll(); setVideos(data.data || data); } catch { toast.error('خطأ في تحميل الفيديوهات'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { try { await videosAPI.delete(id); setVideos(videos.filter(v => v.id !== id)); toast.success('تم حذف الفيديو'); setDeleteId(null); } catch { toast.error('فشل الحذف'); } }
  const filtered = videos.filter(v => v.title_ar?.includes(search) || v.title?.includes(search));
  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  return (
    <div className="p-6"><div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">الفيديوهات</h1><Link href="/videos/create" className="btn btn-primary"><FaPlus /> فيديو جديد</Link></div>
      <div className="mb-4 relative max-w-md"><FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" /></div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="card p-4">
            <div className="relative h-40 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 rounded-lg flex items-center justify-center mb-3">
              <FaVideo className="text-4xl text-primary-500/50" />
              <a href={item.video_url} target="_blank" className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"><div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center"><FaVideo className="text-white" /></div></a>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">{item.duration || '--:--'}</span>
            </div>
            <h3 className="font-bold mb-1">{item.title_ar}</h3>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3"><span><FaEye className="inline ml-1" /> {item.views || 0}</span><span>{item.category}</span></div>
            <div className="flex gap-2"><Link href={`/videos/${item.id}/edit`} className="flex-1 btn bg-blue-50 text-blue-600 !py-2"><FaPencil /></Link><button onClick={()=>setDeleteId(item.id)} className="flex-1 btn bg-red-50 text-red-600 !py-2"><FaTrashCan /></button></div>
          </div>
        ))}
      </div>
      <AnimatePresence>{deleteId && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setDeleteId(null)}><div className="bg-white p-6 rounded-2xl max-w-md" onClick={e=>e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذا الفيديو؟</p><div className="flex gap-3 justify-end"><button onClick={()=>setDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded-xl">إلغاء</button><button onClick={()=>handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-xl">حذف</button></div></div></motion.div>)}</AnimatePresence>
    </div>
  );
}
