'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminProgramsAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function CreateProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', name_ar: '', description: '', icon: 'FaHeart', color: '#1A5F7A', projects_count: 0, families_count: 0, individuals_count: 0 });

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await adminProgramsAPI.create(form); toast.success('تم إضافة البرنامج'); router.push('/admin/programs'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };

  return (
    <div className="pt-navbar container-page max-w-4xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8"><Link href="/admin/programs" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-3xl font-bold">إضافة برنامج جديد</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-6">
        <div><label className="block mb-2 font-medium">الاسم (عربي) *</label><input type="text" value={form.name_ar} onChange={e => setForm({...form, name_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label className="block mb-2">الاسم (إنجليزي)</label><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label className="block mb-2">الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <div className="grid grid-cols-3 gap-4"><div><label>المشاريع</label><input type="number" value={form.projects_count} onChange={e => setForm({...form, projects_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الأسر</label><input type="number" value={form.families_count} onChange={e => setForm({...form, families_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الأفراد</label><input type="number" value={form.individuals_count} onChange={e => setForm({...form, individuals_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div className="flex gap-4 pt-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ'}</button><Link href="/admin/programs" className="btn bg-gray-200 text-gray-700">إلغاء</Link></div>
      </form>
    </div>
  );
}
