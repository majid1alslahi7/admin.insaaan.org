'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  FaBriefcase,
  FaChartLine,
  FaDiagramProject,
  FaEnvelope,
  FaFileContract,
  FaFolderOpen,
  FaHandHoldingHeart,
  FaImages,
  FaNewspaper,
  FaStar,
  FaUsersGear,
  FaVideo,
} from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import toast from 'react-hot-toast';
import { statsAPI } from '@/lib/api';

type MetricValue = string | number | boolean | null | undefined;

type MonthlyActivity = {
  month?: string;
  month_name?: string;
  news?: number;
  projects?: number;
  volunteers?: number;
  subscribers?: number;
  donations?: number;
};

type FullStatsData = {
  summary?: Record<string, MetricValue>;
  monthly_activity?: MonthlyActivity[];
  top_locations?: Record<string, number>;
  top_categories?: Record<string, unknown>;
  [key: string]: unknown;
};

type FullStatsResponse = {
  success?: boolean;
  data?: FullStatsData;
  generated_at?: string;
};

type SectionConfig = {
  key: string;
  title: string;
  icon: IconType;
  color: string;
  metrics: Array<[string, string]>;
};

const summaryLabels: Record<string, string> = {
  total_news: 'الأخبار',
  total_programs: 'البرامج',
  total_projects: 'المشاريع',
  total_success_stories: 'قصص النجاح',
  total_reports: 'التقارير',
  total_careers: 'الوظائف',
  total_tenders: 'المناقصات',
  total_volunteers: 'المتطوعين',
  total_subscribers: 'المشتركين',
  total_donations: 'التبرعات',
  total_complaints: 'الشكاوى',
  total_gallery: 'صور المعرض',
  total_videos: 'الفيديوهات',
  total_users: 'المستخدمين',
  total_beneficiaries: 'المستفيدين',
  total_families: 'الأسر',
};

const sections: SectionConfig[] = [
  { key: 'news', title: 'الأخبار', icon: FaNewspaper, color: '#1A5F7A', metrics: [['total', 'الإجمالي'], ['published', 'منشور'], ['featured', 'مميز'], ['total_views', 'المشاهدات']] },
  { key: 'programs', title: 'البرامج', icon: FaFolderOpen, color: '#159C4B', metrics: [['total', 'الإجمالي'], ['active', 'نشط'], ['total_projects', 'المشاريع'], ['total_individuals', 'الأفراد']] },
  { key: 'projects', title: 'المشاريع', icon: FaDiagramProject, color: '#D4621A', metrics: [['total', 'الإجمالي'], ['active', 'نشط'], ['completed', 'مكتمل'], ['total_beneficiaries', 'المستفيدين']] },
  { key: 'success_stories', title: 'قصص النجاح', icon: FaStar, color: '#F59E0B', metrics: [['total', 'الإجمالي'], ['published', 'منشور'], ['featured', 'مميز'], ['unpublished', 'غير منشور']] },
  { key: 'reports', title: 'التقارير', icon: FaChartLine, color: '#EF4444', metrics: [['total', 'الإجمالي'], ['published', 'منشور'], ['total_downloads', 'التحميلات'], ['avg_downloads', 'متوسط التحميل']] },
  { key: 'careers', title: 'الوظائف', icon: FaBriefcase, color: '#3B82F6', metrics: [['total', 'الإجمالي'], ['published', 'منشور'], ['open', 'مفتوح'], ['expired', 'منتهي']] },
  { key: 'tenders', title: 'المناقصات', icon: FaFileContract, color: '#8B5CF6', metrics: [['total', 'الإجمالي'], ['published', 'منشور'], ['open', 'مفتوح'], ['awarded', 'تم الترسية']] },
  { key: 'volunteers', title: 'المتطوعين', icon: FaHandHoldingHeart, color: '#10B981', metrics: [['total', 'الإجمالي'], ['pending', 'قيد المراجعة'], ['approved', 'مقبول'], ['rejected', 'مرفوض']] },
  { key: 'subscribers', title: 'المشتركين', icon: FaEnvelope, color: '#F97316', metrics: [['total', 'الإجمالي'], ['active', 'نشط'], ['subscribed_this_month', 'هذا الشهر'], ['subscribed_this_year', 'هذا العام']] },
  { key: 'gallery', title: 'المعرض', icon: FaImages, color: '#EC4899', metrics: [['total', 'الإجمالي'], ['featured', 'مميز']] },
  { key: 'videos', title: 'الفيديوهات', icon: FaVideo, color: '#06B6D4', metrics: [['total', 'الإجمالي'], ['published', 'منشور'], ['total_views', 'المشاهدات'], ['avg_views', 'متوسط المشاهدة']] },
  { key: 'users', title: 'المستخدمين', icon: FaUsersGear, color: '#0EA5E9', metrics: [['total', 'الإجمالي'], ['active', 'نشط'], ['verified', 'موثق'], ['banned', 'محظور']] },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatValue(value: MetricValue) {
  if (typeof value === 'boolean') return value ? 'نعم' : 'لا';
  if (typeof value === 'number') return value.toLocaleString('ar-SA');
  if (typeof value === 'string' && value.trim()) return value;
  return '0';
}

function getRecord(data: FullStatsData | null, key: string) {
  const value = data?.[key];
  return isRecord(value) ? value : {};
}

function listFromRecord(record?: Record<string, number>) {
  if (!record) return [];
  return Object.entries(record).map(([label, count]) => ({ label, count }));
}

export default function StatisticsPage() {
  const [data, setData] = useState<FullStatsData | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStats() {
      try {
        const response = (await statsAPI.getFullStats()) as FullStatsResponse;
        if (!active) return;
        setData(response.data || null);
        setGeneratedAt(response.generated_at || null);
      } catch {
        toast.error('تعذر تحميل شاشة الإحصائيات');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadStats();

    return () => {
      active = false;
    };
  }, []);

  const summaryItems = useMemo(() => {
    const summary = data?.summary || {};
    return Object.entries(summary).map(([key, value]) => ({
      key,
      label: summaryLabels[key] || key.replace(/_/g, ' '),
      value,
    }));
  }, [data]);

  const monthlyMax = useMemo(() => {
    const totals = (data?.monthly_activity || []).map((item) => (item.news || 0) + (item.projects || 0) + (item.volunteers || 0) + (item.subscribers || 0));
    return Math.max(...totals, 1);
  }, [data]);

  if (loading) {
    return <div className="p-6 text-center"><div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإحصائيات</h1>
          <p className="text-sm text-gray-500">ملخص شامل من `StatisticsController::fullStats`</p>
        </div>
        {generatedAt && <span className="text-sm text-gray-500">آخر تحديث: {new Date(generatedAt).toLocaleString('ar-SA')}</span>}
      </div>

      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {summaryItems.map((item) => (
          <motion.div key={item.key} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card !p-4">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold mt-2">{formatValue(item.value)}</p>
          </motion.div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">تفصيل الأقسام</h2>
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {sections.map((section) => {
            const sectionData = getRecord(data, section.key);
            return (
              <div key={section.key} className="card">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${section.color}20`, color: section.color }}>
                    <section.icon />
                  </div>
                  <h3 className="font-bold">{section.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {section.metrics.map(([key, label]) => (
                    <div key={key} className="rounded-xl bg-gray-50 dark:bg-gray-900 p-3">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-bold text-lg">{formatValue(sectionData[key] as MetricValue)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid xl:grid-cols-[1.4fr_1fr] gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">النشاط الشهري</h2>
          <div className="space-y-4">
            {(data?.monthly_activity || []).map((item) => {
              const total = (item.news || 0) + (item.projects || 0) + (item.volunteers || 0) + (item.subscribers || 0);
              const width = Math.max(4, Math.round((total / monthlyMax) * 100));
              return (
                <div key={item.month || item.month_name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.month_name || item.month}</span>
                    <span className="text-sm text-gray-500">{total.toLocaleString('ar-SA')}</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">أكثر المواقع</h2>
          <div className="space-y-3">
            {listFromRecord(data?.top_locations).map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                <span>{item.label}</span>
                <span className="font-bold">{item.count.toLocaleString('ar-SA')}</span>
              </div>
            ))}
            {listFromRecord(data?.top_locations).length === 0 && <p className="text-center text-gray-500 py-6">لا توجد بيانات مواقع</p>}
          </div>
        </div>
      </section>

      {isRecord(data?.top_categories) && (
        <section className="card">
          <h2 className="text-xl font-bold mb-4">أكثر التصنيفات</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(data.top_categories).map(([group, values]) => (
              <div key={group} className="rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                <h3 className="font-bold mb-3">{summaryLabels[`total_${group}`] || group}</h3>
                <div className="space-y-2">
                  {Array.isArray(values) && values.slice(0, 5).map((item, index) => {
                    const record = isRecord(item) ? item : {};
                    const label = String(record.category || record.status || record.type || `#${index + 1}`);
                    const count = typeof record.count === 'number' ? record.count : 0;
                    return (
                      <div key={`${group}-${label}`} className="flex justify-between text-sm">
                        <span>{label}</span>
                        <span className="font-semibold">{count.toLocaleString('ar-SA')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
