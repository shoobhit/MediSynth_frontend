
"use client";
import React, { useState } from "react";
import { FileUpload } from "./FileUpload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Microscope } from "lucide-react";

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    if (files.length > 0) {
      toast({
        title: "Files uploaded",
        description: `${files.length} file${files.length > 1 ? 's' : ''} ready for analysis`,
      });
    }
    console.log(files);
  };

  const handleProcessImage = () => {
    if (files.length > 0) {
      toast({
        title: "Processing images",
        description: "Your medical images are being analyzed...",
      });
    } else {
      toast({
        title: "No files to process",
        description: "Please upload at least one image file first",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="min-h-64 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
        <FileUpload onChange={handleFileUpload} />
      </div>
      
      {files.length > 0 && (
        <Button 
          onClick={handleProcessImage}
          className="w-full form-button"
        >
          <Microscope className="mr-2 h-4 w-4" />
          Analyze {files.length} Image{files.length > 1 ? 's' : ''}
        </Button>
      )}
    </div>
  );
}
