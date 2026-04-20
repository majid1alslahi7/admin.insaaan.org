'use client';
import { useState, useEffect } from 'react';
import { FaFloppyDisk } from 'react-icons/fa6';
import { adminSettingsAPI } from '@/lib/admin/api';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const data = await adminSettingsAPI.getAll();
      setSettings(Array.isArray(data) ? data : data?.data || []);
    } catch {
      toast.error('خطأ في تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      for (const s of settings) {
        await adminSettingsAPI.update(s.key, s.value);
      }
      toast.success('تم حفظ الإعدادات');
    } catch {
      toast.error('فشل حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-navbar min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-navbar container-page min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">الإعدادات</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          <FaFloppyDisk />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="card space-y-6">
        {settings.length === 0 ? (
          <p className="text-center text-gray-500 py-8">لا توجد إعدادات</p>
        ) : (
          settings.map((s) => (
            <div key={s.key}>
              <label className="block mb-2 font-medium capitalize">
                {s.key.replace(/_/g, ' ')}
              </label>
              <input
                type="text"
                value={s.value || ''}
                onChange={(e) => {
                  const newVal = e.target.value;
                  setSettings((prev) =>
                    prev.map((item) =>
                      item.key === s.key ? { ...item, value: newVal } : item
                    )
                  );
                }}
                className="w-full p-3 border rounded-xl"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
