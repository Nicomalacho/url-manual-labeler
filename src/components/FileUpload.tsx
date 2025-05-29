
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload CSV File
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input
          type="file"
          accept=".csv"
          onChange={onFileUpload}
          className="w-full p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
        />
        <p className="text-sm text-gray-500 mt-2">
          Upload a CSV file containing URLs to begin assessment
        </p>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
