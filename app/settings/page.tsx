'use client';
import { useState, useEffect } from 'react';
import { FaFloppyDisk, FaEraser } from 'react-icons/fa6';
import { settingsAPI, cacheAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showCacheLog, setShowCacheLog] = useState(false);
  const [cacheResult, setCacheResult] = useState<any>(null);

  useEffect(() => { fetchSettings(); }, []);

  async function fetchSettings() {
    try { const data = await settingsAPI.getAll(); setSettings(data.data || data); }
    catch { toast.error('خطأ في التحميل'); } finally { setLoading(false); }
  }

  async function handleSave() {
    setSaving(true);
    try { for(const s of settings) { await settingsAPI.update(s.key, s.value); } toast.success('تم الحفظ'); }
    catch { toast.error('فشل الحفظ'); } finally { setSaving(false); }
  }

  async function handleClearCache() {
    setClearing(true);
    setShowCacheLog(false);
    setCacheResult(null);
    try {
      const result = await cacheAPI.clearAll();
      setCacheResult(result);
      setShowCacheLog(true);
      if (result.success) {
        toast.success(result.message || 'تم مسح الكاش بنجاح');
      } else {
        toast.error(result.message || 'فشل مسح الكاش');
      }
    } catch (err: any) {
      toast.error('فشل الاتصال بالخادم: ' + err.message);
      setShowCacheLog(true);
      setCacheResult({ success: false, message: err.message });
    } finally {
      setClearing(false);
    }
  }

  if (loading) return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <button onClick={handleSave} disabled={saving} className="btn btn-primary">
          <FaFloppyDisk /> {saving ? 'جاري الحفظ...' : 'حفظ'}
        </button>
      </div>

      <div className="card space-y-4 mb-6">
        {settings.map(s => (
          <div key={s.key}>
            <label className="block mb-2 capitalize">{s.key.replace(/_/g, ' ')}</label>
            <input type="text" value={s.value || ''} onChange={e => { const newVal = e.target.value; setSettings(prev => prev.map(item => item.key === s.key ? { ...item, value: newVal } : item)); }} className="w-full p-3 border rounded-xl" />
          </div>
        ))}
      </div>

      {/* قسم مسح الكاش */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">صيانة النظام</h2>
        <p className="text-gray-500 text-sm mb-4">مسح جميع أنواع الكاش في النظام بما في ذلك: cache, view, config, route, event, compiled, optimize, bootstrap cache, queue</p>
        <button
          onClick={handleClearCache}
          disabled={clearing}
          className="btn bg-red-500 hover:bg-red-600 text-white"
        >
          <FaEraser /> {clearing ? 'جاري المسح...' : 'مسح جميع أنواع الكاش'}
        </button>

        {showCacheLog && cacheResult && (
          <div className={`mt-4 p-4 rounded-xl text-sm font-mono overflow-auto max-h-96 ${
            cacheResult.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <p className="font-bold mb-2">{cacheResult.success ? '✓' : '✗'} {cacheResult.message}</p>
            {cacheResult.details && Object.entries(cacheResult.details).map(([key, value]) => (
              <div key={key} className="mb-1">
                <span className="font-semibold">{key}: </span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
