'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { FaPlus, FaPencil, FaTrashCan, FaEye, FaEyeSlash, FaMagnifyingGlass, FaImages } from 'react-icons/fa6';
import { newsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => { fetchNews(); }, []);

  async function fetchNews() {
    try {
      const data = await newsAPI.getAll();
      setNews(data.data || data);
    } catch { toast.error('خطأ في تحميل الأخبار'); }
    finally { setLoading(false); }
  }

  async function handleDelete(id: number) {
    try {
      await newsAPI.delete(id);
      setNews(news.filter(n => n.id !== id));
      toast.success('تم حذف الخبر');
      setDeleteId(null);
    } catch { toast.error('فشل الحذف'); }
  }

  async function togglePublish(id: number, published: boolean) {
    try {
      await newsAPI.update(id, { published: !published });
      setNews(news.map(n => n.id === id ? {...n, published: !published} : n));
    } catch { toast.error('فشل التحديث'); }
  }

  const filteredNews = news.filter(n => n.title_ar?.includes(search) || n.title?.includes(search));

  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الأخبار</h1>
        <Link href="/news/create" className="btn btn-primary"><FaPlus /> خبر جديد</Link>
      </div>
      <div className="mb-4 relative max-w-md">
        <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pr-10 p-3 border rounded-xl" />
      </div>
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr><th className="p-4">العنوان</th><th className="p-4">الصور</th><th className="p-4">التصنيف</th><th className="p-4">الحالة</th><th className="p-4">المشاهدات</th><th className="p-4">إجراءات</th></tr>
            </thead>
            <tbody>
              {filteredNews.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="p-4">{item.title_ar}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {item.image && <FaImages className="text-green-500" title="صورة رئيسية" />}
                      {item.gallery?.length > 0 && <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{item.gallery.length}</span>}
                    </div>
                  </td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">
                    <button onClick={() => togglePublish(item.id, item.published)} className={`p-2 rounded-lg ${item.published ? 'text-green-500' : 'text-gray-400'}`}>
                      {item.published ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </td>
                  <td className="p-4">{item.views}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link href={`/news/${item.id}/edit`} className="p-2 text-blue-500"><FaPencil /></Link>
                      <button onClick={() => setDeleteId(item.id)} className="p-2 text-red-500"><FaTrashCan /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteId(null)}>
            <div className="bg-white p-6 rounded-2xl max-w-md" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">تأكيد الحذف</h3>
              <p className="mb-6">هل أنت متأكد من حذف هذا الخبر؟</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-200 rounded-xl">إلغاء</button>
                <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 bg-red-500 text-white rounded-xl">حذف</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
