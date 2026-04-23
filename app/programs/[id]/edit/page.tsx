
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { programsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type ProgramForm = {
  name?: string;
  name_ar?: string;
  description?: string;
  full_description?: string;
  icon?: string;
  color?: string;
  image?: string;
  projects_count?: number | string;
  families_count?: number | string;
  individuals_count?: number | string;
  locations?: string[] | string;
  is_active?: boolean;
  order?: number | string;
};

export default function EditProgramPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ProgramForm | null>(null);

  useEffect(() => {
    if (id) programsAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/programs'));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    
    try {
      await programsAPI.update(Number(id), {
        ...form,
        locations: typeof form.locations === 'string' ? form.locations.split('\n').map((item: string) => item.trim()).filter(Boolean) : form.locations,
      });
      toast.success('تم تحديث البرنامج بنجاح', { icon: '📂', style: { background: '#159C4B', color: '#fff' } });
      router.push('/programs');
    } catch {
      toast.error('فشل تحديث البرنامج');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/programs" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">تعديل برنامج</h1></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <div><label>الاسم *</label><input type="text" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
            <div><label>الاسم (عربي)</label><input type="text" value={form.name_ar || ''} onChange={e => setForm({...form, name_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            <div><label>الوصف</label><textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
            <div><label>الوصف التفصيلي</label><textarea value={form.full_description || ''} onChange={e => setForm({...form, full_description: e.target.value})} rows={5} className="w-full p-3 border rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label>الأيقونة</label><input type="text" value={form.icon || ''} onChange={e => setForm({...form, icon: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div><label>اللون</label><input type="color" value={form.color || '#1A5F7A'} onChange={e => setForm({...form, color: e.target.value})} className="w-full h-12 p-1 border rounded-xl" /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label>المشاريع</label><input type="number" value={form.projects_count || 0} onChange={e => setForm({...form, projects_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div><label>الأسر</label><input type="number" value={form.families_count || 0} onChange={e => setForm({...form, families_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div>
              <div><label>الأفراد</label><input type="number" value={form.individuals_count || 0} onChange={e => setForm({...form, individuals_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div>
            </div>
            <div><label>المواقع</label><textarea value={Array.isArray(form.locations) ? form.locations.join('\n') : form.locations || ''} onChange={e => setForm({...form, locations: e.target.value})} rows={3} placeholder="كل موقع في سطر" className="w-full p-3 border rounded-xl" /></div>
            <div className="grid grid-cols-2 gap-4"><div><label>الترتيب</label><input type="number" value={form.order || 0} onChange={e => setForm({...form, order: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><label className="flex items-center gap-2 mt-8"><input type="checkbox" checked={form.is_active ?? true} onChange={e => setForm({...form, is_active: e.target.checked})} /> نشط</label></div>
          </div>
          <div className="card space-y-4">
            <ImageUploader label="صورة البرنامج" value={form.image || ''} onChange={(url) => setForm({...form, image: url})} folder="programs" />
          </div>
        </div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث البرنامج'}</button><Link href="/programs" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
