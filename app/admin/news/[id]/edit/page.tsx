'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminNewsAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function EditNewsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => { if (id) adminNewsAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/admin/news')); }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminNewsAPI.update(Number(id), form);
      toast.success('تم تحديث الخبر');
      router.push('/admin/news');
    } catch { toast.error('فشل التحديث'); }
    finally { setLoading(false); }
  };

  if (!form) return <div className="flex items-center justify-center h-64"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/admin/news" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">تعديل خبر</h1></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <div><label className="block mb-2">العنوان (عربي) *</label><input type="text" value={form.title_ar || ''} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label className="block mb-2">العنوان (إنجليزي)</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label className="block mb-2">المحتوى *</label><textarea value={form.content || ''} onChange={e => setForm({...form, content: e.target.value})} rows={8} className="w-full p-3 border rounded-xl" required /></div>
        <div><label className="block mb-2">مقتطف</label><textarea value={form.excerpt || ''} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} className="w-full p-3 border rounded-xl" /></div>
        <div><label className="block mb-2">التصنيف</label><select value={form.category || 'news'} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl"><option value="news">أخبار</option><option value="food-security">الأمن الغذائي</option><option value="health">الصحة</option></select></div>
        <div className="flex gap-6"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured || false} onChange={e => setForm({...form, featured: e.target.checked})} /> مميز</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.published || false} onChange={e => setForm({...form, published: e.target.checked})} /> منشور</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث'}</button><Link href="/admin/news" className="px-6 py-3 bg-gray-200 rounded-xl">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
