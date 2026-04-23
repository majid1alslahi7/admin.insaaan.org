'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { FileUploader } from '@/components/ui/FileUploader';
import { formatFileSize } from '@/lib/upload';
import { reportsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CreateReportPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', description: '', file_url: '', file_size: '', category: 'annual', year: new Date().getFullYear(), published: true });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await reportsAPI.create(form); toast.success('تم إضافة التقرير بنجاح', { icon: '✓', style: { background: '#EF4444', color: '#fff' } }); router.push('/reports'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/reports" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">إضافة تقرير جديد</h1></div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div><label>العنوان *</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <FileUploader label="ملف التقرير" value={form.file_url} onChange={(url, meta) => setForm({...form, file_url: url, file_size: formatFileSize(meta?.size)})} folder="reports" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" helperText="اختر ملف التقرير من جهازك" />
        <div><label>حجم الملف</label><input type="text" value={form.file_size} onChange={e => setForm({...form, file_size: e.target.value})} className="w-full p-3 border rounded-xl" readOnly /></div>
        <div className="grid grid-cols-2 gap-4"><div><label>التصنيف</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl"><option value="annual">سنوي</option><option value="activity">نشاط</option><option value="policy">سياسة</option><option value="financial">مالي</option><option value="other">أخرى</option></select></div><div><label>السنة</label><input type="number" value={form.year} onChange={e => setForm({...form, year: +e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} /> منشور</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading?'جاري الحفظ...':'حفظ'}</button><Link href="/reports" className="btn bg-gray-200">إلغاء</Link></div>
      </form>
    </div>
  );
}
