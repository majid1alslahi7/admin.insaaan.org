'use client';
import { useState, useEffect } from 'react';
import { FaFloppyDisk } from 'react-icons/fa6';
import { settingsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  useEffect(() => { fetchSettings(); }, []);
  async function fetchSettings() { try { const data = await settingsAPI.getAll(); setSettings(data.data || data); } catch { toast.error('خطأ في التحميل'); } finally { setLoading(false); } }
  async function handleSave() { setSaving(true); try { for(const s of settings) { await settingsAPI.update(s.key, s.value); } toast.success('تم الحفظ'); } catch { toast.error('فشل الحفظ'); } finally { setSaving(false); } }
  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  return (
    <div className="p-6 max-w-4xl mx-auto"><div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">الإعدادات</h1><button onClick={handleSave} disabled={saving} className="btn btn-primary"><FaFloppyDisk /> {saving?'جاري الحفظ...':'حفظ'}</button></div>
      <div className="card space-y-4">{settings.map(s=>(<div key={s.key}><label className="block mb-2 capitalize">{s.key.replace(/_/g,' ')}</label><input type="text" value={s.value||''} onChange={e=>{const newVal=e.target.value; setSettings(prev=>prev.map(item=>item.key===s.key?{...item,value:newVal}:item));}} className="w-full p-3 border rounded-xl" /></div>))}</div>
    </div>
  );
}
