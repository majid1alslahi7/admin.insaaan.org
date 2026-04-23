'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  FaHouse, FaNewspaper, FaFolderOpen, FaDiagramProject, FaBriefcase,
  FaFileContract, FaChartPie, FaImages, FaVideo, FaUsers, FaEnvelope,
  FaGear, FaBars, FaXmark, FaArrowRightFromBracket,
  FaCircleUser, FaChevronLeft, FaStar, FaUsersGear, FaChartLine
} from 'react-icons/fa6';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import '@/styles/globals.css';

type AdminUser = {
  name?: string;
  email?: string;
};

const menuItems = [
  { name: 'الرئيسية', href: '/dashboard', icon: FaHouse },
  { name: 'الأخبار', href: '/news', icon: FaNewspaper },
  { name: 'البرامج', href: '/programs', icon: FaFolderOpen },
  { name: 'المشاريع', href: '/projects', icon: FaDiagramProject },
  { name: 'قصص النجاح', href: '/success-stories', icon: FaStar },
  { name: 'الوظائف', href: '/careers', icon: FaBriefcase },
  { name: 'المناقصات', href: '/tenders', icon: FaFileContract },
  { name: 'التقارير', href: '/reports', icon: FaChartPie },
  { name: 'معرض الصور', href: '/gallery', icon: FaImages },
  { name: 'الفيديوهات', href: '/videos', icon: FaVideo },
  { name: 'المتطوعين', href: '/volunteers', icon: FaUsers },
  { name: 'المشتركين', href: '/subscribers', icon: FaEnvelope },
  { name: 'المستخدمين', href: '/users', icon: FaUsersGear },
  { name: 'الإحصائيات', href: '/statistics', icon: FaChartLine },
  { name: 'الإعدادات', href: '/settings', icon: FaGear },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('admin-token');
    const userData = localStorage.getItem('admin-user');

    if (!token) {
      router.push('/login');
    } else if (userData) {
      Promise.resolve().then(() => {
        if (cancelled) return;
        try {
          setUser(JSON.parse(userData) as AdminUser);
        } catch {
          setUser({ name: 'مدير النظام', email: 'admin@eusran.org' });
        }
      });
    }

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    localStorage.removeItem('admin-email');
    router.push('/login');
  };

  if (pathname === '/login') {
    return (
      <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
        <body>
          <ThemeProvider>
            <Toaster position="top-center" />
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body>
        <ThemeProvider>
          <Toaster position="top-center" />
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar - Desktop */}
            <motion.aside
              initial={false}
              animate={{ width: sidebarOpen ? 280 : 80 }}
              className="hidden lg:block fixed top-0 right-0 bottom-0 bg-white dark:bg-gray-800 shadow-xl z-40 overflow-hidden transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5">
                      <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        <Image src="/icon1.png" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    {sidebarOpen && (
                      <motion.span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        لوحة التحكم
                      </motion.span>
                    )}
                  </Link>
                  <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    {sidebarOpen ? <FaChevronLeft /> : <FaBars />}
                  </button>
                </div>

                <div className="flex-1 py-4 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {menuItems.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      return (
                        <Link key={item.href} href={item.href}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                              isActive
                                ? 'bg-primary-500 text-white shadow-lg'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            <item.icon className={`text-xl shrink-0 ${isActive ? 'text-white' : ''}`} />
                            {sidebarOpen && <span className="font-medium">{item.name}</span>}
                          </motion.div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Link href="/profile" className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                      <FaCircleUser className="text-2xl" />
                    </div>
                    {sidebarOpen && (
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium truncate">{user?.name || 'مدير النظام'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@eusran.org'}</p>
                      </div>
                    )}
                  </Link>
                  {sidebarOpen && (
                    <button onClick={handleLogout} className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <FaArrowRightFromBracket className="text-sm" />
                      <span>تسجيل الخروج</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-30">
              <div className="flex items-center justify-between p-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Image src="/icon1.png" alt="Logo" width={32} height={32} className="rounded-lg" />
                  <span className="font-bold text-primary-600">لوحة التحكم</span>
                </Link>
                <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <FaBars className="text-xl" />
                </button>
              </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
              {mobileOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                  />
                  <motion.div
                    initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden overflow-hidden"
                  >
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <Link href="/profile" className="flex items-center gap-3">
                          <FaCircleUser className="text-3xl text-primary-500" />
                          <div>
                            <p className="font-bold">{user?.name || 'مدير النظام'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'admin@eusran.org'}</p>
                          </div>
                        </Link>
                        <button onClick={() => setMobileOpen(false)} className="p-2">
                          <FaXmark className="text-xl" />
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4">
                        {menuItems.map((item) => {
                          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                          return (
                            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 ${
                                isActive ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                <item.icon className="text-xl" />
                                <span>{item.name}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={handleLogout} className="w-full py-3 bg-red-500 text-white rounded-xl">
                          تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main Content */}
            <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:mr-72' : 'lg:mr-20'}`}>
              <div className="pt-16 lg:pt-0">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
