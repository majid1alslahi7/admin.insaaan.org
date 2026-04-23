'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, Reorder } from 'motion/react';
import { FaTrashCan, FaPlus, FaGripLines, FaCloudArrowUp } from 'react-icons/fa6';
import toast from 'react-hot-toast';
import { uploadFile } from '@/lib/upload';

interface MultiImageUploaderProps {
  label?: string;
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  maxImages?: number;
}

export function MultiImageUploader({ label, value = [], onChange, folder = 'gallery', maxImages = 10 }: MultiImageUploaderProps) {
  const [images, setImages] = useState<string[]>(value);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > maxImages) { toast.error(`يمكنك رفع ${maxImages} صور كحد أقصى`); return; }
    setUploading(true);
    setProgress(0);
    const newImages: string[] = [];
    for (const [index, file] of files.entries()) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} ليس صورة`);
        continue;
      }
      try {
        const result = await uploadFile({
          file,
          folder,
          onProgress: (fileProgress) => setProgress(Math.round(((index + fileProgress / 100) / files.length) * 100)),
        });
        newImages.push(result.url);
      } catch { toast.error(`فشل رفع ${file.name}`); }
    }
    if (newImages.length > 0) { const updated = [...images, ...newImages]; setImages(updated); onChange(updated); toast.success(`تم رفع ${newImages.length} صور بنجاح`, { icon: '✓', style: { background: '#159C4B', color: '#fff' } }); }
    setUploading(false);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => { const updated = images.filter((_, i) => i !== index); setImages(updated); onChange(updated); };
  const handleReorder = (updated: string[]) => { setImages(updated); onChange(updated); };

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      <input type="file" ref={fileInputRef} accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
      <div className="space-y-3">
        <Reorder.Group axis="y" values={images} onReorder={handleReorder} className="space-y-2">
          {images.map((url, index) => (
            <Reorder.Item key={url} value={url} className="relative group bg-gray-50 dark:bg-gray-700 rounded-xl p-2">
              <div className="flex items-center gap-3">
                <div className="cursor-grab p-2"><FaGripLines className="text-gray-400" /></div>
                <div className="relative w-16 h-16 overflow-hidden rounded-lg">
                  <Image src={url} alt={`Gallery ${index + 1}`} fill sizes="64px" className="object-cover" unoptimized />
                </div>
                <span className="flex-1 text-sm truncate">{url.split('/').pop()}</span>
                <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FaTrashCan /></button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        {images.length < maxImages && (
          <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => fileInputRef.current?.click()} className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
            <FaPlus className="text-2xl text-gray-400" />
            <span className="text-sm text-gray-500">إضافة صور</span>
            <span className="text-xs text-gray-400">{images.length} / {maxImages}</span>
          </motion.button>
        )}
        {uploading && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FaCloudArrowUp className="text-blue-500" />
              <span className="text-sm text-blue-600">جاري رفع الصور... {progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white dark:bg-gray-700 overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
