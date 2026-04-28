'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { MultiImageUploader } from '@/components/ui/MultiImageUploader';
import { newsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_ar: '', title: '', content: '', excerpt: '',
    image: '', gallery: [] as string[],
    category: 'news', featured: false, published: true,
    created_at: new Date().toISOString().split('T')[0], // التاريخ الحالي
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // تحويل created_at إلى صيغة ISO إذا احتجنا
      const dataToSend = {
        ...form,
        created_at: form.created_at
          ? new Date(form.created_at + 'T12:00:00').toISOString()
          : undefined,
      };
      await newsAPI.create(dataToSend);
      toast.success('تم إضافة الخبر بنجاح', { icon: '✓', style: { background: '#159C4B', color: '#fff' } });
      router.push('/news');
    } catch {
      toast.error('فشل إضافة الخبر');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/news" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
          <FaArrowLeft />
        </Link>
        <h1 className="text-2xl font-bold">إضافة خبر جديد</h1>
      </div>

      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h2 className="text-lg font-bold">معلومات الخبر</h2>
            <div>
              <label className="block text-sm font-medium mb-2">العنوان (عربي) *</label>
              <input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">العنوان (إنجليزي)</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">المحتوى *</label>
              <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={6} className="w-full p-3 border rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">مقتطف</label>
              <input type="text" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">التصنيف</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="news">أخبار عامة</option>
                <option value="food-security">الأمن الغذائي</option>
                <option value="health">الصحة</option>
                <option value="education">التعليم</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تاريخ الانشاء</label>
              <input
                type="date"
                value={form.created_at}
                onChange={e => setForm({...form, created_at: e.target.value})}
                className="w-full p-3 border rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-1">إذا لم تختر تاريخاً فسيتم استخدام التاريخ الحالي</p>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> مميز
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> منشور
              </label>
            </div>
          </div>

          <div className="card space-y-4">
            <h2 className="text-lg font-bold">الصور</h2>
            <ImageUploader label="الصورة الرئيسية" value={form.image} onChange={(url) => setForm({...form, image: url})} folder="news" />
            <MultiImageUploader label="معرض الصور" value={form.gallery} onChange={(urls) => setForm({...form, gallery: urls})} folder="news/gallery" maxImages={10} />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="submit" disabled={loading} className="btn btn-primary">
            <FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ الخبر'}
          </button>
          <Link href="/news" className="btn bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">إلغاء</Link>
        </div>
      </motion.form>
    </div>
  );
}
