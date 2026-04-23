
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { FileUploader } from '@/components/ui/FileUploader';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { videosAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type VideoForm = {
  title?: string;
  title_ar?: string;
  description?: string;
  video_url?: string;
  thumbnail?: string;
  duration?: string;
  category?: string;
  published?: boolean;
};

export default function EditVideoPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<VideoForm | null>(null);

  useEffect(() => {
    if (id) videosAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/videos'));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      await videosAPI.update(Number(id), form);
      toast.success('تم تحديث الفيديو بنجاح', { icon: '🎬', style: { background: '#06B6D4', color: '#fff' } });
      router.push('/videos');
    } catch {
      toast.error('فشل تحديث الفيديو');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/videos" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">تعديل فيديو</h1></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card space-y-4">
        <div><label>العنوان *</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar || ''} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full p-3 border rounded-xl" /></div>
        <FileUploader label="ملف الفيديو" value={form.video_url || ''} onChange={(url) => setForm({...form, video_url: url})} folder="videos" accept="video/*" helperText="اختر فيديو من جهازك" preview="video" maxSizeMB={500} required />
        <div className="grid grid-cols-2 gap-4"><ImageUploader label="صورة مصغرة" value={form.thumbnail || ''} onChange={(url) => setForm({...form, thumbnail: url})} folder="videos/thumbnails" /><div><label>المدة</label><input type="text" value={form.duration || ''} onChange={e => setForm({...form, duration: e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div><label>التصنيف</label><input type="text" value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.published || false} onChange={e => setForm({...form, published: e.target.checked})} /> منشور</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث الفيديو'}</button><Link href="/videos" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
