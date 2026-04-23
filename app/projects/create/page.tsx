'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { MultiImageUploader } from '@/components/ui/MultiImageUploader';
import { projectsAPI, programsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type ProgramOption = {
  id: number | string;
  name?: string;
  name_ar?: string;
};

export default function CreateProjectPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false); const [programs, setPrograms] = useState<ProgramOption[]>([]);
  const [form, setForm] = useState({ title: '', title_ar: '', description: '', program_id: '', status: 'active', beneficiaries: 0, location: '', start_date: '', end_date: '', image: '', gallery: [] as string[], featured: false });

  useEffect(() => { programsAPI.getAll().then(data => setPrograms(data.data || data)).catch(()=>{}); }, []);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await projectsAPI.create({...form, program_id: Number(form.program_id)||null}); toast.success('تم إضافة المشروع بنجاح', { icon: '✓', style: { background: '#D4621A', color: '#fff' } }); router.push('/projects'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/projects" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة مشروع جديد</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label>العنوان *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <div><label>البرنامج</label><select value={form.program_id} onChange={e => setForm({...form, program_id: e.target.value})} className="w-full p-3 border rounded-xl"><option value="">اختر البرنامج</option>{programs.map(p => <option key={p.id} value={p.id}>{p.name_ar || p.name}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-4"><div><label>الحالة</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-3 border rounded-xl"><option value="active">نشط</option><option value="completed">مكتمل</option><option value="pending">معلق</option><option value="cancelled">ملغي</option></select></div><div><label>المستفيدين</label><input type="number" value={form.beneficiaries} onChange={e => setForm({...form, beneficiaries: +e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div><label>الموقع</label><input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div className="grid grid-cols-2 gap-4"><div><label>تاريخ البداية</label><input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>تاريخ النهاية</label><input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <ImageUploader label="الصورة الرئيسية" value={form.image} onChange={(url) => setForm({...form, image: url})} folder="projects" />
        <MultiImageUploader label="معرض الصور" value={form.gallery} onChange={(urls) => setForm({...form, gallery: urls})} folder="projects/gallery" maxImages={10} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> مشروع مميز</label>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading?'جاري الحفظ...':'حفظ'}</button><Link href="/projects" className="btn bg-gray-200">إلغاء</Link></div>
      </form>
    </div>
  );
}
