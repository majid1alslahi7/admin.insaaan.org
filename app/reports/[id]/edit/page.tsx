
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { FileUploader } from '@/components/ui/FileUploader';
import { formatFileSize } from '@/lib/upload';
import { reportsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type ReportForm = {
  title?: string;
  title_ar?: string;
  description?: string;
  file_url?: string;
  file_size?: string;
  category?: string;
  year?: number | string;
  published?: boolean;
};

export default function EditReportPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ReportForm | null>(null);

  useEffect(() => {
    if (id) reportsAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/reports'));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      await reportsAPI.update(Number(id), form);
      toast.success('تم تحديث التقرير بنجاح', { icon: '📊', style: { background: '#EF4444', color: '#fff' } });
      router.push('/reports');
    } catch {
      toast.error('فشل تحديث التقرير');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/reports" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">تعديل تقرير</h1></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card space-y-4">
        <div><label>العنوان *</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>العنوان (عربي)</label><input type="text" value={form.title_ar || ''} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <FileUploader label="ملف التقرير" value={form.file_url || ''} onChange={(url, meta) => setForm({...form, file_url: url, file_size: formatFileSize(meta?.size)})} folder="reports" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" helperText="اختر ملف التقرير من جهازك" />
        <div><label>حجم الملف</label><input type="text" value={form.file_size || ''} onChange={e => setForm({...form, file_size: e.target.value})} className="w-full p-3 border rounded-xl" readOnly /></div>
        <div className="grid grid-cols-2 gap-4"><div><label>التصنيف</label><select value={form.category || 'annual'} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl"><option value="annual">سنوي</option><option value="activity">نشاط</option><option value="policy">سياسة</option><option value="financial">مالي</option><option value="other">أخرى</option></select></div><div><label>السنة</label><input type="number" value={form.year || ''} onChange={e => setForm({...form, year: +e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.published || false} onChange={e => setForm({...form, published: e.target.checked})} /> منشور</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث التقرير'}</button><Link href="/reports" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
