'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FaNewspaper, FaFolderOpen, FaDiagramProject, FaBriefcase, 
  FaFileContract, FaImages, FaVideo, FaUsers, FaArrowRightFromBracket,
  FaChartPie, FaStar, FaEnvelope, FaGear, FaHouse
} from 'react-icons/fa6';
import { adminStatsAPI } from '@/lib/admin/api';
import { authAPI } from '@/lib/admin/api';

const menuItems = [
  { name: 'الأخبار', href: '/admin/news', icon: FaNewspaper, color: '#1A5F7A' },
  { name: 'البرامج', href: '/admin/programs', icon: FaFolderOpen, color: '#159C4B' },
  { name: 'المشاريع', href: '/admin/projects', icon: FaDiagramProject, color: '#D4621A' },
  { name: 'قصص النجاح', href: '/admin/success-stories', icon: FaStar, color: '#F59E0B' },
  { name: 'الوظائف', href: '/admin/careers', icon: FaBriefcase, color: '#3B82F6' },
  { name: 'المناقصات', href: '/admin/tenders', icon: FaFileContract, color: '#8B5CF6' },
  { name: 'التقارير', href: '/admin/reports', icon: FaChartPie, color: '#EF4444' },
  { name: 'معرض الصور', href: '/admin/gallery', icon: FaImages, color: '#EC4899' },
  { name: 'الفيديوهات', href: '/admin/videos', icon: FaVideo, color: '#06B6D4' },
  { name: 'المتطوعين', href: '/admin/volunteers', icon: FaUsers, color: '#10B981' },
  { name: 'المشتركين', href: '/admin/subscribers', icon: FaEnvelope, color: '#F97316' },
  { name: 'الإعدادات', href: '/admin/settings', icon: FaGear, color: '#6B7280' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const data = await adminStatsAPI.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    try { await authAPI.logout(); } catch (error) {}
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container-page py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary-600">لوحة التحكم</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
            <FaArrowRightFromBracket /> خروج
          </button>
        </div>
      </header>

      <main className="container-page py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: item.color + '20' }}>
                  <item.icon className="text-2xl" style={{ color: item.color }} />
                </div>
                <h3 className="font-bold">{item.name}</h3>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
