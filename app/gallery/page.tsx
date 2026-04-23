'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaImages } from 'react-icons/fa6';
import { galleryAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function GalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [search, setSearch] = useState(''); const [deleteId, setDeleteId] = useState<number | null>(null);
  useEffect(() => { fetchGallery(); }, []);
  async function fetchGallery() { try { const data = await galleryAPI.getAll(); setGallery(data.data || data); } catch { toast.error('خطأ في تحميل الصور'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { try { await galleryAPI.delete(id); setGallery(gallery.filter(g => g.id !== id)); toast.success('تم حذف الصورة'); setDeleteId(null); } catch { toast.error('فشل الحذف'); } }
  const filtered = gallery.filter(g => g.title_ar?.includes(search) || g.title?.includes(search));
  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  return (
    <div className="p-6"><div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">معرض الصور</h1><Link href="/gallery/create" className="btn btn-primary"><FaPlus /> صورة جديدة</Link></div>
      <div className="mb-4 relative max-w-md"><FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" /></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="card p-2 group relative">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
              {item.image_url ? <Image src={item.image_url} alt={item.title_ar} fill className="object-cover" /> : <FaImages className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-gray-400" />}
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Link href={`/gallery/${item.id}/edit`} className="p-2 bg-white rounded-lg text-blue-500 shadow"><FaPencil /></Link>
              <button onClick={()=>setDeleteId(item.id)} className="p-2 bg-white rounded-lg text-red-500 shadow"><FaTrashCan /></button>
            </div>
            <p className="text-sm font-medium mt-2 truncate">{item.title_ar || 'بدون عنوان'}</p>
            <p className="text-xs text-gray-500">{item.category}</p>
          </div>
        ))}
      </div>
      <AnimatePresence>{deleteId && (<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setDeleteId(null)}><div className="bg-white p-6 rounded-2xl max-w-md" onClick={e=>e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذه الصورة؟</p><div className="flex gap-3 justify-end"><button onClick={()=>setDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded-xl">إلغاء</button><button onClick={()=>handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-xl">حذف</button></div></div></motion.div>)}</AnimatePresence>
    </div>
  );
}
