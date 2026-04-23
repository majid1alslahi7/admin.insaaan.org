export type UploadResult = {
  url: string;
  path?: string;
  name?: string;
  size?: number;
  mime_type?: string;
};

type UploadOptions = {
  file: File;
  folder: string;
  onProgress?: (progress: number) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export function formatFileSize(bytes?: number) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function uploadFile({ file, folder, onProgress }: UploadOptions) {
  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    xhr.open('POST', `${API_URL}/upload`);

    const token = localStorage.getItem('admin-token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      let payload: { url?: string; data?: UploadResult; message?: string } = {};

      try {
        payload = JSON.parse(xhr.responseText || '{}');
      } catch {
        reject(new Error('تعذر قراءة استجابة الرفع'));
        return;
      }

      const result = payload.data || payload;

      if (xhr.status >= 200 && xhr.status < 300 && result.url) {
        onProgress?.(100);
        resolve(result as UploadResult);
        return;
      }

      reject(new Error(payload.message || `فشل رفع الملف (${xhr.status})`));
    };

    xhr.onerror = () => reject(new Error('تعذر الاتصال بخدمة رفع الملفات'));
    xhr.onabort = () => reject(new Error('تم إلغاء رفع الملف'));
    xhr.send(formData);
  });
}
