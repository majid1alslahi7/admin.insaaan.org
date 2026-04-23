'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { FileUploader } from '@/components/ui/FileUploader';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { videosAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateVideoPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', description: '', video_url: '', thumbnail: '', duration: '', category: 'general', published: true });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!form.video_url) { toast.error('ملف الفيديو مطلوب'); return; } setLoading(true); try { await videosAPI.create(form); toast.success('تم إضافة الفيديو بنجاح', { icon: '✓', style: { background: '#06B6D4', color: '#fff' } }); router.push('/videos'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/videos" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة فيديو جديد</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label>العنوان *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full p-3 border rounded-xl" /></div>
        <FileUploader label="ملف الفيديو" value={form.video_url} onChange={(url) => setForm({...form, video_url: url})} folder="videos" accept="video/*" helperText="اختر فيديو من جهازك" preview="video" maxSizeMB={500} required />
        <div className="grid grid-cols-2 gap-4"><ImageUploader label="صورة مصغرة" value={form.thumbnail} onChange={(url) => setForm({...form, thumbnail: url})} folder="videos/thumbnails" /><div><label>المدة</label><input type="text" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="5:30" className="w-full p-3 border rounded-xl" /></div></div>
        <div><label>التصنيف</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> منشور</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading?'جاري الحفظ...':'حفظ'}</button><Link href="/videos" className="btn bg-gray-200">إلغاء</Link></div>
      </form>
    </div>
  );
}
