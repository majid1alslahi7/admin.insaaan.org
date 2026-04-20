'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { 
  FaHouse, FaNewspaper, FaFolderOpen, FaDiagramProject, FaBriefcase,
  FaFileContract, FaChartPie, FaImages, FaVideo, FaUsers, FaEnvelope,
  FaGear, FaBars, FaXmark, FaArrowRightFromBracket, FaChevronDown,
  FaCircleUser, FaChevronLeft, FaUser
} from 'react-icons/fa6';
import toast from 'react-hot-toast';

const menuItems = [
  { name: 'الرئيسية', href: '/admin/dashboard', icon: FaHouse },
  { name: 'الأخبار', href: '/admin/news', icon: FaNewspaper },
  { name: 'البرامج', href: '/admin/programs', icon: FaFolderOpen },
  { name: 'المشاريع', href: '/admin/projects', icon: FaDiagramProject },
  { name: 'الوظائف', href: '/admin/careers', icon: FaBriefcase },
  { name: 'المناقصات', href: '/admin/tenders', icon: FaFileContract },
  { name: 'التقارير', href: '/admin/reports', icon: FaChartPie },
  { name: 'معرض الصور', href: '/admin/gallery', icon: FaImages },
  { name: 'الفيديوهات', href: '/admin/videos', icon: FaVideo },
  { name: 'المتطوعين', href: '/admin/volunteers', icon: FaUsers },
  { name: 'المشتركين', href: '/admin/subscribers', icon: FaEnvelope },
  { name: 'الإعدادات', href: '/admin/settings', icon: FaGear },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    const userData = localStorage.getItem('admin-user');
    
    if (!token) {
      router.push('/admin/login');
    } else if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ name: 'مدير النظام', email: 'admin@eusran.org' });
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-user');
    localStorage.removeItem('admin-email');
    toast.success('تم تسجيل الخروج بنجاح');
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:block fixed top-0 right-0 bottom-0 bg-white dark:bg-gray-800 shadow-xl z-40 overflow-hidden transition-all duration-300"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5">
                <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                  <Image loading="eager" src="/icon1.png" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
                </div>
              </div>
              {sidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="text-lg font-bold text-primary-600 dark:text-primary-400"
                >
                  لوحة التحكم
                </motion.span>
              )}
            </Link>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {sidebarOpen ? <FaChevronLeft /> : <FaBars />}
            </button>
          </div>

          {/* Menu Items */}
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
                      {sidebarOpen && (
                        <motion.span 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                          className="font-medium"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Link 
                href="/admin/profile"
                className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              >
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
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <FaChevronDown className={`text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              )}

              <AnimatePresence>
                {userMenuOpen && sidebarOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-full right-0 mb-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <Link 
                      href="/admin/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaUser className="text-sm" />
                      <span>الملف الشخصي</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <FaArrowRightFromBracket className="text-sm" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5">
              <div className="w-full h-full rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                <Image loading="eager" src="/icon1.png" alt="Logo" width={24} height={24} className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="font-bold text-primary-600">لوحة التحكم</span>
          </Link>
          <button 
            onClick={() => setMobileOpen(true)} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <Link href="/admin/profile" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 p-0.5">
                      <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                        <Image loading="eager" src="/icon1.png" alt="Logo" width={32} height={32} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-primary-600">{user?.name || 'مدير النظام'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'admin@eusran.org'}</p>
                    </div>
                  </Link>
                  <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <FaXmark className="text-xl" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <nav className="space-y-1">
                    {menuItems.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive 
                              ? 'bg-primary-500 text-white' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}>
                            <item.icon className="text-xl" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Link 
                    href="/admin/profile"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl mb-2 transition-colors"
                  >
                    <FaUser />
                    <span>الملف الشخصي</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                  >
                    <FaArrowRightFromBracket />
                    <span>تسجيل الخروج</span>
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
  );
}
