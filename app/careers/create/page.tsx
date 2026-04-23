'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { careersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateCareerPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', description: '', requirements: '', location: '', type: 'full_time', department: '', deadline: '', published: true });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await careersAPI.create(form); toast.success('تم إضافة الوظيفة بنجاح', { icon: '✓', style: { background: '#3B82F6', color: '#fff' } }); router.push('/careers'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/careers" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة وظيفة جديدة</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label>المسمى *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>المسمى (عربي)</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <div><label>المتطلبات</label><textarea value={form.requirements} onChange={e => setForm({...form, requirements: e.target.value})} rows={3} className="w-full p-3 border rounded-xl" /></div>
        <div className="grid grid-cols-2 gap-4"><div><label>الموقع</label><input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>القسم</label><input type="text" value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div className="grid grid-cols-2 gap-4"><div><label>نوع الدوام</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 border rounded-xl"><option value="full_time">دوام كامل</option><option value="part_time">دوام جزئي</option><option value="contract">عقد</option><option value="daily">يومي</option><option value="volunteer">تطوع</option></select></div><div><label>آخر موعد</label><input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> منشورة</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading?'جاري الحفظ...':'حفظ'}</button><Link href="/careers" className="btn bg-gray-200">إلغاء</Link></div>
      </form>
    </div>
  );
}
