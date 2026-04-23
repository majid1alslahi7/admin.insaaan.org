'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { FileUploader } from '@/components/ui/FileUploader';
import { tendersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateTenderPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', reference: '', description: '', deadline: '', status: 'open', file_url: '', published: true });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await tendersAPI.create(form); toast.success('تم إضافة المناقصة بنجاح', { icon: '✓', style: { background: '#8B5CF6', color: '#fff' } }); router.push('/tenders'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/tenders" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة مناقصة جديدة</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label>العنوان *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>رقم المرجع</label><input type="text" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <FileUploader label="ملف المناقصة" value={form.file_url} onChange={(url) => setForm({...form, file_url: url})} folder="tenders" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" helperText="اختر مستند المناقصة من جهازك" />
        <div className="grid grid-cols-2 gap-4"><div><label>تاريخ الإغلاق</label><input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>الحالة</label><select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full p-3 border rounded-xl"><option value="open">مفتوح</option><option value="closed">مغلق</option><option value="awarded">تم الترسية</option><option value="cancelled">ملغي</option></select></div></div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> منشورة</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading?'جاري الحفظ...':'حفظ'}</button><Link href="/tenders" className="btn bg-gray-200">إلغاء</Link></div>
      </form>
    </div>
  );
}
