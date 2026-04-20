'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminTendersAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function EditTenderPage() {
  const router = useRouter(); const { id } = useParams(); const [loading, setLoading] = useState(false); const [form, setForm] = useState<any>(null);
  useEffect(() => { if (id) adminTendersAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/admin/tenders')); }, [id]);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await adminTendersAPI.update(Number(id), form); toast.success('تم التحديث'); router.push('/admin/tenders'); } catch { toast.error('فشل التحديث'); } finally { setLoading(false); } };
  if (!form) return <div className="pt-navbar min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  return (<div className="pt-navbar container-page max-w-4xl mx-auto min-h-screen"><div className="flex items-center gap-4 mb-8"><Link href="/admin/tenders" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-3xl font-bold">تعديل مناقصة</h1></div><form onSubmit={handleSubmit} className="card space-y-6"><div><label>العنوان (عربي) *</label><input type="text" value={form.title_ar || ''} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div><div><label>العنوان (إنجليزي)</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>رقم المرجع</label><input type="text" value={form.reference || ''} onChange={e => setForm({...form, reference: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الوصف</label><textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div><div className="grid grid-cols-2 gap-4"><div><label>تاريخ الإغلاق</label><input type="date" value={form.deadline || ''} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الحالة</label><select value={form.status || 'open'} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-3 border rounded-xl"><option value="open">مفتوح</option><option value="closed">مغلق</option></select></div></div><div className="flex gap-4 pt-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث'}</button><Link href="/admin/tenders" className="btn bg-gray-200 text-gray-700">إلغاء</Link></div></form></div>);
}
 