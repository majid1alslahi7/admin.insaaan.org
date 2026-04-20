'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { FaPlus, FaPencil, FaTrashCan, FaMagnifyingGlass, FaImages } from 'react-icons/fa6';
import { adminGalleryAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchGallery(); }, []);
  async function fetchGallery() { try { setLoading(true); const data = await adminGalleryAPI.getAll(); setGallery(Array.isArray(data) ? data : data?.data || []); } catch { toast.error('خطأ في تحميل الصور'); } finally { setLoading(false); } }
  async function handleDelete(id: number) { try { await adminGalleryAPI.delete(id); setGallery(gallery.filter(g => g.id !== id)); toast.success('تم حذف الصورة'); setDeleteId(null); } catch { toast.error('فشل الحذف'); } }

  const filteredGallery = gallery.filter(g => g.title_ar?.toLowerCase().includes(search.toLowerCase()) || g.title?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-navbar container-page min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"><h1 className="text-3xl font-bold">معرض الصور</h1><Link href="/admin/gallery/create" className="btn btn-primary shadow-lg"><FaPlus /> إضافة صورة</Link></div>
      <div className="mb-8"><div className="relative max-w-md"><FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-12 pl-4 py-3 border rounded-xl" /></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredGallery.length === 0 ? <div className="col-span-full text-center py-12"><FaImages className="text-6xl text-gray-300 mx-auto mb-4" /><p>لا توجد صور</p></div> : filteredGallery.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-square relative"><Image src={item.image_url} alt={item.title_ar} fill className="object-cover" /></div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Link href={`/admin/gallery/${item.id}/edit`} className="p-3 bg-white rounded-full text-blue-600"><FaPencil /></Link>
                <button onClick={() => setDeleteId(item.id)} className="p-3 bg-white rounded-full text-red-600"><FaTrashCan /></button>
              </div>
              <div className="p-3"><p className="font-medium truncate">{item.title_ar}</p><p className="text-xs text-gray-500">{item.category}</p></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>{deleteId && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setDeleteId(null)}><motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md" onClick={e => e.stopPropagation()}><h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3><p className="mb-6">هل أنت متأكد من حذف هذه الصورة؟</p><div className="flex gap-3 justify-end"><button onClick={() => setDeleteId(null)} className="px-5 py-2.5 bg-gray-100 rounded-xl">إلغاء</button><button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 bg-red-600 text-white rounded-xl">حذف</button></div></motion.div></motion.div>)}</AnimatePresence>
    </div>
  );
}
