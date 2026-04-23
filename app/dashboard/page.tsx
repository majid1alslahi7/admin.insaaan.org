'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { IconType } from 'react-icons';
import {
  FaArrowUpRightFromSquare,
  FaBriefcase,
  FaChartLine,
  FaChartPie,
  FaDiagramProject,
  FaEnvelope,
  FaFileContract,
  FaFolderOpen,
  FaGear,
  FaHandHoldingHeart,
  FaImages,
  FaMagnifyingGlass,
  FaNewspaper,
  FaPlus,
  FaStar,
  FaUsers,
  FaUsersGear,
  FaVideo,
} from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { searchAPI, statsAPI } from '@/lib/api';

type DashboardStats = {
  news_count?: number;
  programs_count?: number;
  projects_count?: number;
  volunteers_count?: number;
  subscribers_count?: number;
  stats?: Array<{ id?: number; key?: string; value?: string | number; label?: string }>;
};

type SearchItem = Record<string, unknown> & {
  id?: string | number;
};

type SearchResponse = {
  success?: boolean;
  term?: string;
  total_results?: number;
  results?: Record<string, SearchItem[]>;
};

type DashboardPayload = DashboardStats | { data?: DashboardStats };

type MenuItem = {
  name: string;
  href: string;
  icon: IconType;
  color: string;
};

type StatCard = {
  label: string;
  value: number | string;
  icon: IconType;
  color: string;
};

const menuItems: MenuItem[] = [
  { name: 'الأخبار', href: '/news', icon: FaNewspaper, color: '#1A5F7A' },
  { name: 'البرامج', href: '/programs', icon: FaFolderOpen, color: '#159C4B' },
  { name: 'المشاريع', href: '/projects', icon: FaDiagramProject, color: '#D4621A' },
  { name: 'قصص النجاح', href: '/success-stories', icon: FaStar, color: '#F59E0B' },
  { name: 'الوظائف', href: '/careers', icon: FaBriefcase, color: '#3B82F6' },
  { name: 'المناقصات', href: '/tenders', icon: FaFileContract, color: '#8B5CF6' },
  { name: 'التقارير', href: '/reports', icon: FaChartPie, color: '#EF4444' },
  { name: 'معرض الصور', href: '/gallery', icon: FaImages, color: '#EC4899' },
  { name: 'الفيديوهات', href: '/videos', icon: FaVideo, color: '#06B6D4' },
  { name: 'المتطوعين', href: '/volunteers', icon: FaUsers, color: '#10B981' },
  { name: 'المشتركين', href: '/subscribers', icon: FaEnvelope, color: '#F97316' },
  { name: 'المستخدمين', href: '/users', icon: FaUsersGear, color: '#0EA5E9' },
  { name: 'الإحصائيات', href: '/statistics', icon: FaChartLine, color: '#14B8A6' },
  { name: 'الإعدادات', href: '/settings', icon: FaGear, color: '#6B7280' },
];

const quickActions: MenuItem[] = [
  { name: 'خبر جديد', href: '/news/create', icon: FaPlus, color: '#1A5F7A' },
  { name: 'مشروع جديد', href: '/projects/create', icon: FaPlus, color: '#D4621A' },
  { name: 'برنامج جديد', href: '/programs/create', icon: FaPlus, color: '#159C4B' },
  { name: 'مستخدم جديد', href: '/users/create', icon: FaPlus, color: '#0EA5E9' },
];

const searchGroups: Record<string, { label: string; color: string; href: (item: SearchItem) => string | null }> = {
  news: { label: 'الأخبار', color: '#1A5F7A', href: (item) => item.id ? `/news/${item.id}/edit` : '/news' },
  programs: { label: 'البرامج', color: '#159C4B', href: (item) => item.id ? `/programs/${item.id}/edit` : '/programs' },
  projects: { label: 'المشاريع', color: '#D4621A', href: (item) => item.id ? `/projects/${item.id}/edit` : '/projects' },
  success_stories: { label: 'قصص النجاح', color: '#F59E0B', href: (item) => item.id ? `/success-stories/${item.id}/edit` : '/success-stories' },
  reports: { label: 'التقارير', color: '#EF4444', href: (item) => item.id ? `/reports/${item.id}/edit` : '/reports' },
  careers: { label: 'الوظائف', color: '#3B82F6', href: (item) => item.id ? `/careers/${item.id}/edit` : '/careers' },
  tenders: { label: 'المناقصات', color: '#8B5CF6', href: (item) => item.id ? `/tenders/${item.id}/edit` : '/tenders' },
  volunteers: { label: 'المتطوعين', color: '#10B981', href: () => '/volunteers' },
  subscribers: { label: 'المشتركين', color: '#F97316', href: () => '/subscribers' },
  gallery: { label: 'المعرض', color: '#EC4899', href: (item) => item.id ? `/gallery/${item.id}/edit` : '/gallery' },
  videos: { label: 'الفيديوهات', color: '#06B6D4', href: (item) => item.id ? `/videos/${item.id}/edit` : '/videos' },
  users: { label: 'المستخدمين', color: '#0EA5E9', href: (item) => item.id ? `/users/${item.id}/edit` : '/users' },
  donations: { label: 'التبرعات', color: '#84CC16', href: () => null },
  complaints: { label: 'الشكاوى', color: '#64748B', href: () => null },
};

function normalizeDashboardStats(payload: DashboardPayload) {
  if ('data' in payload && payload.data) return payload.data;
  return payload as DashboardStats;
}

function textFrom(item: SearchItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'string' && value.trim()) return value;
    if (typeof value === 'number') return String(value);
  }

  return 'نتيجة بدون عنوان';
}

function descriptionFrom(item: SearchItem) {
  return textFrom(item, ['email', 'phone', 'description', 'excerpt', 'reference', 'location', 'status', 'category']);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        const data = (await statsAPI.getDashboard()) as DashboardPayload;
        if (active) setStats(normalizeDashboardStats(data));
      } catch {
        toast.error('تعذر تحميل إحصائيات لوحة التحكم');
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchStats();

    return () => {
      active = false;
    };
  }, []);

  const statCards = useMemo<StatCard[]>(() => [
    { label: 'الأخبار', value: stats?.news_count ?? 0, icon: FaNewspaper, color: '#1A5F7A' },
    { label: 'البرامج', value: stats?.programs_count ?? 0, icon: FaFolderOpen, color: '#159C4B' },
    { label: 'المشاريع', value: stats?.projects_count ?? 0, icon: FaDiagramProject, color: '#D4621A' },
    { label: 'المتطوعين', value: stats?.volunteers_count ?? 0, icon: FaHandHoldingHeart, color: '#10B981' },
    { label: 'المشتركين', value: stats?.subscribers_count ?? 0, icon: FaEnvelope, color: '#F97316' },
  ], [stats]);

  const searchSections = useMemo(() => {
    if (!searchResult?.results) return [];
    return Object.entries(searchResult.results).filter(([, items]) => items.length > 0);
  }, [searchResult]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = searchTerm.trim();

    if (term.length < 2) {
      toast.error('اكتب كلمتين أو حرفين على الأقل للبحث');
      return;
    }

    setSearching(true);
    try {
      const result = (await searchAPI.global(term)) as SearchResponse;
      setSearchResult(result);
    } catch {
      toast.error('تعذر تنفيذ البحث العام');
    } finally {
      setSearching(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
        <p className="text-gray-500">إدارة المحتوى والحسابات والبحث العام من مكان واحد</p>
      </div>

      <section className="card">
        <form onSubmit={handleSearch} className="grid md:grid-cols-[1fr_auto] gap-3">
          <div className="relative">
            <FaMagnifyingGlass className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="بحث عام في الأخبار، المشاريع، المستخدمين، التقارير..."
              className="w-full pr-12 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900"
            />
          </div>
          <button type="submit" disabled={searching} className="btn btn-primary">
            <FaMagnifyingGlass /> {searching ? 'جاري البحث...' : 'بحث'}
          </button>
        </form>

        {searchResult && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold">نتائج البحث عن: {searchResult.term || searchTerm}</p>
              <span className="text-sm text-gray-500">{searchResult.total_results || 0} نتيجة</span>
            </div>

            {searchSections.length > 0 ? (
              <div className="grid lg:grid-cols-2 gap-4">
                {searchSections.map(([groupKey, items]) => {
                  const group = searchGroups[groupKey] || { label: groupKey, color: '#6B7280', href: () => null };

                  return (
                    <div key={groupKey} className="rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between">
                        <span className="font-semibold" style={{ color: group.color }}>{group.label}</span>
                        <span className="text-xs text-gray-500">{items.length}</span>
                      </div>
                      <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {items.slice(0, 4).map((item, index) => {
                          const href = group.href(item);
                          const content = (
                            <div className="p-4 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                              <div className="min-w-0">
                                <p className="font-medium truncate">{textFrom(item, ['title_ar', 'title', 'name_ar', 'name', 'full_name', 'email', 'subject'])}</p>
                                <p className="text-xs text-gray-500 truncate">{descriptionFrom(item)}</p>
                              </div>
                              {href && <FaArrowUpRightFromSquare className="text-gray-400 shrink-0" />}
                            </div>
                          );

                          return href ? (
                            <Link key={`${groupKey}-${item.id || index}`} href={href}>{content}</Link>
                          ) : (
                            <div key={`${groupKey}-${item.id || index}`}>{content}</div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-xl">لا توجد نتائج مطابقة</div>
            )}
          </div>
        )}
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <motion.div whileHover={{ y: -3 }} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center border border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center" style={{ background: `${action.color}20` }}>
                <action.icon style={{ color: action.color }} />
              </div>
              <span className="text-sm font-medium">{action.name}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${card.color}20` }}>
              <card.icon style={{ color: card.color }} />
            </div>
            <p className="text-gray-500 text-sm mb-1">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {stats?.stats && stats.stats.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">إحصائيات الصفحة الرئيسية</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {stats.stats.map((item) => (
              <div key={item.id || item.key} className="card !p-4">
                <p className="text-sm text-gray-500">{item.label || item.key}</p>
                <p className="text-2xl font-bold">{item.value || 0}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4">الإدارة السريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center h-full">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: `${item.color}20` }}>
                  <item.icon className="text-2xl" style={{ color: item.color }} />
                </div>
                <h3 className="font-bold">{item.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
