import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';

export interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = '*/*',
  maxSizeMB = 50,
  multiple = false,
  className,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const validateFiles = (files: FileList | null): File[] => {
    if (!files) return [];
    setError(null);
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} exceeds the maximum size limit of ${maxSizeMB}MB.`);
        continue;
      }
      validFiles.push(file);
    }
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = validateFiles(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(multiple ? files : [files[0]]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const files = validateFiles(e.target.files);
    if (files.length > 0) {
      onFileSelect(multiple ? files : [files[0]]);
    }
  };

  return (
    <div className={clsx('w-full flex flex-col gap-2.5', className)}>
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={clsx(
          'relative w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-150',
          isDragActive
            ? 'border-primary-500 bg-primary-500/5 shadow-glow'
            : 'border-border hover:border-border-hover bg-bg-secondary/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-bg-tertiary rounded-full text-primary-400">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Drag & Drop file to upload
            </p>
            <p className="text-xs text-text-muted mt-1">
              or click to browse files
            </p>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <span className="text-[10px] text-text-muted px-2 py-0.5 bg-bg-tertiary border border-border rounded font-mono">
              Accepted: {accept === '*/*' ? 'Any file type' : accept}
            </span>
            <span className="text-[10px] text-text-muted">
              Max size: {maxSizeMB}MB
            </span>
          </div>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger font-medium animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
