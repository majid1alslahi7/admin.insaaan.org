
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
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

type SuccessStoryForm = {
  title?: string;
  title_ar?: string;
  content?: string;
  person_name?: string;
  location?: string;
  program_id?: number | string | null;
  image?: string;
  gallery?: string[];
  published?: boolean;
  featured?: boolean;
};

export default function EditSuccessStoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [form, setForm] = useState<SuccessStoryForm | null>(null);

  useEffect(() => {
    programsAPI.getAll().then(data => setPrograms(data.data || data)).catch(() => {});
    if (id) successStoriesAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/success-stories'));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    
    try {
      await successStoriesAPI.update(Number(id), { ...form, program_id: Number(form.program_id) || null });
      toast.success('تم تحديث القصة بنجاح', { icon: '⭐', style: { background: '#F59E0B', color: '#fff' } });
      router.push('/success-stories');
    } catch {
      toast.error('فشل تحديث القصة');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/success-stories" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">تعديل قصة نجاح</h1></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <div><label>العنوان *</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
            <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar || ''} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label>المحتوى *</label><textarea value={form.content || ''} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full p-3 border rounded-xl" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label>اسم الشخص</label><input type="text" value={form.person_name || ''} onChange={e => setForm({...form, person_name: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div><label>الموقع</label><input type="text" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            </div>
            <div><label>البرنامج</label><select value={form.program_id || ''} onChange={e => setForm({...form, program_id: e.target.value})} className="w-full p-3 border rounded-xl"><option value="">اختر البرنامج</option>{programs.map(p => <option key={p.id} value={p.id}>{p.name_ar || p.name}</option>)}</select></div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured || false} onChange={e => setForm({...form, featured: e.target.checked})} /> مميزة</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.published || false} onChange={e => setForm({...form, published: e.target.checked})} /> منشورة</label>
            </div>
          </div>
          <div className="card space-y-4">
            <ImageUploader label="الصورة الرئيسية" value={form.image || ''} onChange={(url) => setForm({...form, image: url})} folder="success-stories" />
            <MultiImageUploader label="معرض الصور" value={form.gallery || []} onChange={(urls) => setForm({...form, gallery: urls})} folder="success-stories/gallery" maxImages={10} />
          </div>
        </div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث القصة'}</button><Link href="/success-stories" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
