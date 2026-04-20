'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminProgramsAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function EditProgramPage() {
  const router = useRouter(); const { id } = useParams(); const [loading, setLoading] = useState(false); const [form, setForm] = useState<any>(null);
  useEffect(() => { if (id) adminProgramsAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/admin/programs')); }, [id]);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await adminProgramsAPI.update(Number(id), form); toast.success('تم التحديث'); router.push('/admin/programs'); } catch { toast.error('فشل التحديث'); } finally { setLoading(false); } };
  if (!form) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  return (<div className="pt-navbar container-page max-w-4xl mx-auto min-h-screen"><div className="flex items-center gap-4 mb-8"><Link href="/admin/programs" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-3xl font-bold">تعديل برنامج</h1></div><form onSubmit={handleSubmit} className="card space-y-6"><div><label className="block mb-2">الاسم (عربي) *</label><input type="text" value={form.name_ar || ''} onChange={e => setForm({...form, name_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div><div><label>الاسم (إنجليزي)</label><input type="text" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الوصف</label><textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div><div className="grid grid-cols-3 gap-4"><div><label>المشاريع</label><input type="number" value={form.projects_count || 0} onChange={e => setForm({...form, projects_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الأسر</label><input type="number" value={form.families_count || 0} onChange={e => setForm({...form, families_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الأفراد</label><input type="number" value={form.individuals_count || 0} onChange={e => setForm({...form, individuals_count: +e.target.value})} className="w-full p-3 border rounded-xl" /></div></div><div className="flex gap-4 pt-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث'}</button><Link href="/admin/programs" className="btn bg-gray-200 text-gray-700">إلغاء</Link></div></form></div>);
}
