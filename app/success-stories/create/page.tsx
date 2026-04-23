'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { MultiImageUploader } from '@/components/ui/MultiImageUploader';
import { successStoriesAPI, programsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type ProgramOption = {
  id: number | string;
  name?: string;
  name_ar?: string;
};

export default function CreateSuccessStoryPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [form, setForm] = useState({ title: '', title_ar: '', content: '', person_name: '', location: '', program_id: '', image: '', gallery: [] as string[], published: true, featured: false });

  useEffect(() => { programsAPI.getAll().then(data => setPrograms(data.data || data)).catch(()=>{}); }, []);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await successStoriesAPI.create({...form, program_id: Number(form.program_id)||null}); toast.success('تم إضافة القصة بنجاح', { icon: '✓', style: { background: '#F59E0B', color: '#fff' } }); router.push('/success-stories'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/success-stories" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة قصة نجاح</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label>العنوان *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>المحتوى *</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full p-3 border rounded-xl" required /></div>
        <div className="grid grid-cols-2 gap-4"><div><label>اسم الشخص</label><input type="text" value={form.person_name} onChange={e => setForm({...form, person_name: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الموقع</label><input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div><label>البرنامج</label><select value={form.program_id} onChange={e => setForm({...form, program_id: e.target.value})} className="w-full p-3 border rounded-xl"><option value="">اختر البرنامج</option>{programs.map(p => <option key={p.id} value={p.id}>{p.name_ar || p.name}</option>)}</select></div>
        <ImageUploader label="الصورة الرئيسية" value={form.image} onChange={(url) => setForm({...form, image: url})} folder="success-stories" />
        <MultiImageUploader label="معرض الصور" value={form.gallery} onChange={(urls) => setForm({...form, gallery: urls})} folder="success-stories/gallery" maxImages={10} />
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> مميزة</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> منشورة</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading?'جاري الحفظ...':'حفظ'}</button><Link href="/success-stories" className="btn bg-gray-200">إلغاء</Link></div>
      </form>
    </div>
  );
}
