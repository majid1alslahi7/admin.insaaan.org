'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminReportsAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function CreateReportPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', description: '', category: 'annual', year: new Date().getFullYear(), published: true });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await adminReportsAPI.create(form); toast.success('تم إضافة التقرير'); router.push('/admin/reports'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };
  return (<div className="pt-navbar container-page max-w-4xl mx-auto min-h-screen"><div className="flex items-center gap-4 mb-8"><Link href="/admin/reports" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-3xl font-bold">إضافة تقرير جديد</h1></div><form onSubmit={handleSubmit} className="card space-y-6"><div><label>العنوان (عربي) *</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div><div><label>العنوان (إنجليزي)</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div><div className="grid grid-cols-2 gap-4"><div><label>التصنيف</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl"><option value="annual">سنوي</option><option value="policy">سياسة</option><option value="activity">نشاط</option></select></div><div><label>السنة</label><input type="number" value={form.year} onChange={e => setForm({...form, year: +e.target.value})} className="w-full p-3 border rounded-xl" /></div></div><div className="flex gap-4 pt-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ'}</button><Link href="/admin/reports" className="btn bg-gray-200 text-gray-700">إلغاء</Link></div></form></div>);
}
