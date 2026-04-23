'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { programsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    name_ar: '',
    description: '',
    full_description: '',
    icon: 'FaHeart',
    color: '#1A5F7A',
    image: '',
    projects_count: 0,
    families_count: 0,
    individuals_count: 0,
    locations: '',
    is_active: true,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await programsAPI.create({
        ...form,
        locations: form.locations.split('\n').map(item => item.trim()).filter(Boolean),
      });
      toast.success('تم إضافة البرنامج بنجاح', { icon: '✓', style: { background: '#159C4B', color: '#fff' } });
      router.push('/programs');
    } catch {
      toast.error('فشل الإضافة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/programs" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة برنامج جديد</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label className="block mb-2">الاسم *</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>الاسم (عربي)</label><input type="text" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف التفصيلي</label><textarea value={form.full_description} onChange={e => setForm({...form, full_description: e.target.value})} rows={5} className="w-full p-3 border rounded-xl" /></div>
        <ImageUploader label="صورة البرنامج" value={form.image} onChange={(url) => setForm({...form, image: url})} folder="programs" />
        <div className="grid grid-cols-2 gap-4"><div><label>الأيقونة</label><input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>اللون</label><input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} className="w-full h-12 p-1 border rounded-xl" /></div></div>
        <div className="grid grid-cols-3 gap-4"><div><label>المشاريع</label><input type="number" value={form.projects_count} onChange={e => setForm({...form, projects_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الأسر</label><input type="number" value={form.families_count} onChange={e => setForm({...form, families_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الأفراد</label><input type="number" value={form.individuals_count} onChange={e => setForm({...form, individuals_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div><label>المواقع</label><textarea value={form.locations} onChange={e => setForm({...form, locations: e.target.value})} rows={3} placeholder="كل موقع في سطر" className="w-full p-3 border rounded-xl" /></div>
        <div className="grid grid-cols-2 gap-4"><div><label>الترتيب</label><input type="number" value={form.order} onChange={e => setForm({...form, order: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><label className="flex items-center gap-2 mt-8"><input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} /> نشط</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ'}</button><Link href="/programs" className="btn bg-gray-200">إلغاء</Link></div>
      </form>
    </div>
  );
}
