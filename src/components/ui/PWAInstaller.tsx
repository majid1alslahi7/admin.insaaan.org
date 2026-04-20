'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FaDownload, FaXmark, FaMobileScreen, FaShare } from 'react-icons/fa6';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isInStandaloneMode = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone ||
             document.referrer.includes('android-app://');
    };
    
    setIsStandalone(isInStandaloneMode());
    
    // Check for iOS
    const userAgent = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      const hasShownPrompt = localStorage.getItem('pwa-prompt-shown');
      if (!hasShownPrompt && !isInStandaloneMode()) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    // For iOS devices
    if (!isInStandaloneMode() && /iphone|ipad|ipod/.test(userAgent)) {
      const hasShownIOSPrompt = localStorage.getItem('pwa-ios-prompt-shown');
      if (!hasShownIOSPrompt) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert('لتثبيت التطبيق:\n1. اضغط على زر المشاركة 📤\n2. اختر "إضافة إلى الشاشة الرئيسية"\n3. اضغط "إضافة"');
    } else {
      alert('يمكنك تثبيت التطبيق من قائمة المتصفح (⋮) → "تثبيت التطبيق"');
    }
    
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-shown', 'true');
    localStorage.setItem('pwa-ios-prompt-shown', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-shown', 'true');
    localStorage.setItem('pwa-ios-prompt-shown', 'true');
  };

  if (isStandalone) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shrink-0">
                {isIOS ? <FaShare className="text-white text-2xl" /> : <FaMobileScreen className="text-white text-2xl" />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">تثبيت التطبيق</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {isIOS 
                    ? 'أضف لوحة التحكم إلى شاشتك الرئيسية للوصول السريع' 
                    : 'ثبت لوحة التحكم على جهازك للوصول السريع وتجربة أفضل'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex-1 py-2 px-3 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaDownload className="text-xs" />
                    {isIOS ? 'كيفية التثبيت' : 'تثبيت'}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    لاحقاً
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaXmark className="text-sm" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
