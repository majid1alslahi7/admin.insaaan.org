'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminNewsAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', content: '', excerpt: '', category: 'news', featured: false, published: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminNewsAPI.create(form);
      toast.success('تم إضافة الخبر');
      router.push('/admin/news');
    } catch { toast.error('فشل الإضافة'); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/news" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link>
        <h1 className="text-2xl font-bold">إضافة خبر جديد</h1>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <div><label className="block mb-2">العنوان (عربي) *</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label className="block mb-2">العنوان (إنجليزي)</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label className="block mb-2">المحتوى *</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={8} className="w-full p-3 border rounded-xl" required /></div>
        <div><label className="block mb-2">مقتطف</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={3} className="w-full p-3 border rounded-xl" /></div>
        <div><label className="block mb-2">التصنيف</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl"><option value="news">أخبار</option><option value="food-security">الأمن الغذائي</option><option value="health">الصحة</option></select></div>
        <div className="flex gap-6"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> مميز</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> منشور</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ'}</button><Link href="/admin/news" className="px-6 py-3 bg-gray-200 rounded-xl">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
