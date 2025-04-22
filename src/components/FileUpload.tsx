
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onChange: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onChange(acceptedFiles);
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10485760, // 10MB
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors hover:border-primary"
    >
      <input {...getInputProps()} />
      <Upload className="w-10 h-10 mx-auto mb-4 text-primary" />
      {isDragActive ? (
        <p className="text-primary">Drop the files here...</p>
      ) : (
        <div>
          <p className="text-lg font-medium mb-1">Click to upload or drag & drop</p>
          <p className="text-sm text-gray-500">SVG, PNG, JPG or DICOM. Max 10 MB</p>
        </div>
      )}
    </div>
  );
};
