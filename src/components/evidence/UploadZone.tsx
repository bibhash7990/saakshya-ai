import React from 'react';
import { FileUploader } from '../ui/FileUploader';

interface UploadZoneProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload, accept = '*/*', multiple = false }) => {
  return (
    <div className="w-full">
      <FileUploader
        onFileSelect={onUpload}
        accept={accept}
        multiple={multiple}
        maxSizeMB={50}
      />
    </div>
  );
};
export default UploadZone;
