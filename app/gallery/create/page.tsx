'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { galleryAPI, programsAPI, projectsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type ProgramOption = {
  id: number | string;
  name?: string;
  name_ar?: string;
};

type ProjectOption = {
  id: number | string;
  title?: string;
  title_ar?: string;
};

export default function CreateGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [form, setForm] = useState({ title: '', title_ar: '', image_url: '', thumbnail_url: '', category: 'general', program_id: '', project_id: '', featured: false, order: 0 });

  useEffect(() => {
    programsAPI.getAll().then(data => setPrograms(data.data || data)).catch(() => {});
    projectsAPI.getAll().then(data => setProjects(data.data || data)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) { toast.error('الصورة مطلوبة'); return; }
    setLoading(true);
    try {
      await galleryAPI.create({ ...form, program_id: Number(form.program_id) || null, project_id: Number(form.project_id) || null });
      toast.success('تم إضافة الصورة بنجاح', { icon: '🖼️', style: { background: '#EC4899', color: '#fff' } });
      router.push('/gallery');
    } catch {
      toast.error('فشل إضافة الصورة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/gallery" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة صورة جديدة</h1></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label>العنوان (إنجليزي)</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label>التصنيف</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label>البرنامج</label><select value={form.program_id} onChange={e => setForm({...form, program_id: e.target.value})} className="w-full p-3 border rounded-xl"><option value="">بدون برنامج</option>{programs.map(p => <option key={p.id} value={p.id}>{p.name_ar || p.name}</option>)}</select></div>
            <div><label>المشروع</label><select value={form.project_id} onChange={e => setForm({...form, project_id: e.target.value})} className="w-full p-3 border rounded-xl"><option value="">بدون مشروع</option>{projects.map(p => <option key={p.id} value={p.id}>{p.title_ar || p.title}</option>)}</select></div>
            <div><label>الترتيب</label><input type="number" value={form.order} onChange={e => setForm({...form, order: +e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> مميزة</label>
          </div>
          <div className="card space-y-4">
            <ImageUploader label="الصورة *" value={form.image_url} onChange={(url) => setForm({...form, image_url: url})} folder="gallery" required />
            <ImageUploader label="الصورة المصغرة" value={form.thumbnail_url} onChange={(url) => setForm({...form, thumbnail_url: url})} folder="gallery/thumbnails" />
          </div>
        </div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ الصورة'}</button><Link href="/gallery" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
