'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminTendersAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function CreateTenderPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', reference: '', description: '', deadline: '', status: 'open', published: true });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await adminTendersAPI.create(form); toast.success('تم إضافة المناقصة'); router.push('/admin/tenders'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };
  return (<div className="pt-navbar container-page max-w-4xl mx-auto min-h-screen"><div className="flex items-center gap-4 mb-8"><Link href="/admin/tenders" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-3xl font-bold">إضافة مناقصة جديدة</h1></div><form onSubmit={handleSubmit} className="card space-y-6"><div><label>العنوان (عربي) *</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div><div><label>العنوان (إنجليزي)</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>رقم المرجع</label><input type="text" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div><div className="grid grid-cols-2 gap-4"><div><label>تاريخ الإغلاق</label><input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الحالة</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-3 border rounded-xl"><option value="open">مفتوح</option><option value="closed">مغلق</option></select></div></div><div className="flex gap-4 pt-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ'}</button><Link href="/admin/tenders" className="btn bg-gray-200 text-gray-700">إلغاء</Link></div></form></div>);
}
