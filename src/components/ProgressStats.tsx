
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download } from 'lucide-react';

interface ProgressStatsProps {
  currentIndex: number;
  totalUrls: number;
  assessedCount: number;
  onDownload: () => void;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({
  currentIndex,
  totalUrls,
  assessedCount,
  onDownload
}) => {
  const progress = totalUrls > 0 ? ((currentIndex + 1) / totalUrls) * 100 : 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          URL {currentIndex + 1} of {totalUrls} • {assessedCount} assessed
        </div>
        <Button onClick={onDownload} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download Results
        </Button>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default ProgressStats;
