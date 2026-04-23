
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { careersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

type CareerForm = {
  title?: string;
  title_ar?: string;
  description?: string;
  requirements?: string;
  location?: string;
  type?: string;
  department?: string;
  deadline?: string;
  published?: boolean;
};

export default function EditCareerPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CareerForm | null>(null);

  useEffect(() => {
    if (id) careersAPI.getOne(Number(id)).then(setForm).catch(() => router.push('/careers'));
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    try {
      await careersAPI.update(Number(id), form);
      toast.success('تم تحديث الوظيفة بنجاح', { icon: '💼', style: { background: '#3B82F6', color: '#fff' } });
      router.push('/careers');
    } catch {
      toast.error('فشل تحديث الوظيفة');
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6"><Link href="/careers" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><FaArrowLeft /></Link><h1 className="text-2xl font-bold">تعديل وظيفة</h1></div>
      <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card space-y-4">
        <div><label>المسمى *</label><input type="text" value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" required /></div>
        <div><label>المسمى (عربي)</label><input type="text" value={form.title_ar || ''} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" /></div>
        <div><label>الوصف</label><textarea value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} rows={4} className="w-full p-3 border rounded-xl" /></div>
        <div><label>المتطلبات</label><textarea value={form.requirements || ''} onChange={e => setForm({...form, requirements: e.target.value})} rows={3} className="w-full p-3 border rounded-xl" /></div>
        <div className="grid grid-cols-2 gap-4"><div><label>الموقع</label><input type="text" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>القسم</label><input type="text" value={form.department || ''} onChange={e => setForm({...form, department: e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div className="grid grid-cols-2 gap-4"><div><label>نوع الدوام</label><select value={form.type || 'full_time'} onChange={e => setForm({...form, type: e.target.value})} className="w-full p-3 border rounded-xl"><option value="full_time">دوام كامل</option><option value="part_time">دوام جزئي</option><option value="contract">عقد</option><option value="daily">يومي</option><option value="volunteer">تطوع</option></select></div><div><label>آخر موعد</label><input type="date" value={form.deadline || ''} onChange={e => setForm({...form, deadline: e.target.value})} className="w-full p-3 border rounded-xl" /></div></div>
        <div className="flex gap-4"><label className="flex items-center gap-2"><input type="checkbox" checked={form.published || false} onChange={e => setForm({...form, published: e.target.checked})} /> منشورة</label></div>
        <div className="flex gap-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'تحديث الوظيفة'}</button><Link href="/careers" className="btn bg-gray-200 dark:bg-gray-700">إلغاء</Link></div>
      </motion.form>
    </div>
  );
}
