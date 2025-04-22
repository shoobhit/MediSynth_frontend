
"use client";
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onChange: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Generate preview URLs for the images
    const newPreviewUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    onChange(acceptedFiles);
  }, [onChange]);

  const removeFile = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    // Filter out the removed file preview
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);
    
    // Recreate the files array from the file input
    const newFiles = Array.from(document.querySelector('input[type=file]')?.files || [])
      .filter((_, i) => i !== index);
    
    // Update parent component
    onChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.dicom', '.dcm']
    },
    maxSize: 10485760, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary"
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto mb-4 text-primary animate-pulse" />
        {isDragActive ? (
          <p className="text-primary">Drop the files here...</p>
        ) : (
          <div className="animate-fade-in">
            <p className="text-lg font-medium mb-1">Click to upload or drag & drop</p>
            <p className="text-sm text-gray-500">SVG, PNG, JPG, DICOM or DCM. Max 10 MB</p>
          </div>
        )}
      </div>

      {/* Preview area for uploaded files */}
      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover rounded-md animate-scale-in"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
