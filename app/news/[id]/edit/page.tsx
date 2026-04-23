'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { MultiImageUploader } from '@/components/ui/MultiImageUploader';
import { newsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type NewsForm = {
  title?: string;
  title_ar?: string;
  content?: string;
  excerpt?: string;
  image?: string;
  gallery?: string[];
  category?: string;
  featured?: boolean;
  published?: boolean;
};

export default function EditNewsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<NewsForm | null>(null);

  useEffect(() => {
    if (id) newsAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/news'));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try { await newsAPI.update(Number(id), form); toast.success('تم تحديث الخبر بنجاح', { icon: '✓', style: { background: '#159C4B', color: '#fff' } }); router.push('/news'); }
    catch { toast.error('فشل تحديث الخبر'); } finally { setLoading(false); }
  };

  if (!form) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/news" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link>
        <h1 className="text-2xl font-bold">تعديل خبر</h1>
      </div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <div><label>العنوان (عربي) *</label><input type="text" value={form.title_ar || ''} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
            <div><label>العنوان (إنجليزي)</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label>المحتوى *</label><textarea value={form.content || ''} onChange={e => setForm({...form, content: e.target.value})} rows={6} className="w-full p-3 border rounded-xl" required /></div>
            <div><label>مقتطف</label><input type="text" value={form.excerpt || ''} onChange={e => setForm({...form, excerpt: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label>التصنيف</label><select value={form.category || 'news'} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl"><option value="news">أخبار عامة</option><option value="food-security">الأمن الغذائي</option><option value="health">الصحة</option><option value="education">التعليم</option></select></div>
            <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured || false} onChange={e => setForm({...form, featured: e.target.checked})} /> مميز</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.published || false} onChange={e => setForm({...form, published: e.target.checked})} /> منشور</label></div>
          </div>
          <div className="card space-y-4">
            <ImageUploader label="الصورة الرئيسية" value={form.image || ''} onChange={(url) => setForm({...form, image: url})} folder="news" />
            <MultiImageUploader label="معرض الصور" value={form.gallery || []} onChange={(urls) => setForm({...form, gallery: urls})} folder="news/gallery" maxImages={10} />
          </div>
        </div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث الخبر'}</button><Link href="/news" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
