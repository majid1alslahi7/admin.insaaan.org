'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaFloppyDisk } from 'react-icons/fa6';
import { adminGalleryAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function CreateGalleryPage() {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', title_ar: '', image_url: '', category: 'general', featured: false });
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { await adminGalleryAPI.create(form); toast.success('تم إضافة الصورة'); router.push('/admin/gallery'); } catch { toast.error('فشل الإضافة'); } finally { setLoading(false); } };
  return (<div className="pt-navbar container-page max-w-4xl mx-auto min-h-screen"><div className="flex items-center gap-4 mb-8"><Link href="/admin/gallery" className="p-2 hover:bg-gray-100 rounded-lg"><FaArrowLeft /></Link><h1 className="text-3xl font-bold">إضافة صورة جديدة</h1></div><form onSubmit={handleSubmit} className="card space-y-6"><div><label>العنوان (عربي) *</label><input type="text" value={form.title_ar} onChange={e => setForm({...form, title_ar: e.target.value})} className="w-full p-3 border rounded-xl" required /></div><div><label>العنوان (إنجليزي)</label><input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div><label>رابط الصورة *</label><input type="text" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="/images/example.jpg" className="w-full p-3 border rounded-xl" required /></div><div><label>التصنيف</label><input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full p-3 border rounded-xl" /></div><div className="flex gap-4 pt-4"><button type="submit" disabled={loading} className="btn btn-primary"><FaFloppyDisk /> {loading ? 'جاري الحفظ...' : 'حفظ'}</button><Link href="/admin/gallery" className="btn bg-gray-200 text-gray-700">إلغاء</Link></div></form></div>);
}
