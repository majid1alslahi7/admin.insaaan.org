'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { FaCloudArrowUp, FaFile, FaImage, FaVideo, FaTrashCan, FaRotateRight } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { formatFileSize, uploadFile } from '@/lib/upload';

type FileUploaderProps = {
  label?: string;
  value?: string;
  onChange: (url: string, meta?: { size?: number; name?: string; mime_type?: string }) => void;
  folder?: string;
  accept?: string;
  helperText?: string;
  required?: boolean;
  preview?: 'image' | 'video' | 'file';
  maxSizeMB?: number;
};

function PreviewIcon({ preview }: { preview: FileUploaderProps['preview'] }) {
  if (preview === 'image') return <FaImage />;
  if (preview === 'video') return <FaVideo />;
  return <FaFile />;
}

export function FileUploader({
  label,
  value,
  onChange,
  folder = 'uploads',
  accept,
  helperText = 'اختر ملفاً من جهازك',
  required,
  preview = 'file',
  maxSizeMB = 200,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`حجم الملف يجب أن لا يتجاوز ${maxSizeMB}MB`);
      return;
    }

    if (preview === 'image' || preview === 'video') {
      setLocalPreview(URL.createObjectURL(file));
    }

    setUploading(true);
    setProgress(0);

    try {
      const result = await uploadFile({ file, folder, onProgress: setProgress });
      onChange(result.url, { size: result.size || file.size, name: result.name || file.name, mime_type: result.mime_type || file.type });
      toast.success('تم رفع الملف بنجاح', { icon: '✓', style: { background: '#159C4B', color: '#fff' } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'فشل رفع الملف');
      setLocalPreview(null);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void handleFile(file);
  };

  const handleRemove = () => {
    setLocalPreview(null);
    setProgress(0);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const currentValue = localPreview || value || '';

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />

      <AnimatePresence mode="wait">
        {currentValue ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
            {preview === 'image' && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image src={currentValue} alt={label || 'Uploaded file'} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" unoptimized />
              </div>
            )}
            {preview === 'video' && (
              <video src={currentValue} className="w-full h-48 object-cover bg-black" controls />
            )}
            {preview === 'file' && (
              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600">
                  <PreviewIcon preview={preview} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{currentValue.split('/').pop() || 'ملف مرفوع'}</p>
                  <p className="text-xs text-gray-500 truncate">{currentValue}</p>
                </div>
              </div>
            )}

            {uploading && (
              <div className="px-4 pb-4">
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className="h-full bg-primary-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-primary-600">جاري الرفع... {progress}%</p>
              </div>
            )}

            <div className="p-3 flex gap-2 bg-gray-50 dark:bg-gray-900/40">
              <button type="button" onClick={() => inputRef.current?.click()} className="btn bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 !py-2 !px-3">
                <FaRotateRight /> تغيير
              </button>
              <button type="button" onClick={handleRemove} className="btn bg-red-50 text-red-600 !py-2 !px-3">
                <FaTrashCan /> إزالة
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => inputRef.current?.click()}
            className="w-full min-h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
          >
            <FaCloudArrowUp className="text-4xl text-gray-400" />
            <span className="font-medium text-gray-600 dark:text-gray-300">{helperText}</span>
            <span className="text-xs text-gray-400">الحد الأقصى {formatFileSize(maxSizeMB * 1024 * 1024)}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
