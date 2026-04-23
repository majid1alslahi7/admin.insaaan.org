'use client';
import { FileUploader } from './FileUploader';

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  required?: boolean;
}

export function ImageUploader({ label, value, onChange, folder = 'images', required }: ImageUploaderProps) {
  return (
    <FileUploader
      label={label}
      value={value}
      onChange={(url) => onChange(url)}
      folder={folder}
      accept="image/*"
      helperText="اضغط لاختيار صورة من جهازك"
      preview="image"
      maxSizeMB={10}
      required={required}
    />
  );
}
