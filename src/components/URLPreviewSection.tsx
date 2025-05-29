
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import WindowManager from './WindowManager';

interface URLPreviewSectionProps {
  url: string;
  currentIndex: number;
  totalUrls: number;
  isWindowOpen: boolean;
  onNavigate: (index: number) => void;
  onOpenWindow: () => void;
  onCloseWindow: () => void;
}

const URLPreviewSection: React.FC<URLPreviewSectionProps> = ({
  url,
  currentIndex,
  totalUrls,
  isWindowOpen,
  onNavigate,
  onOpenWindow,
  onCloseWindow
}) => {
  return (
    <div className="space-y-4">
      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          URL {currentIndex + 1} of {totalUrls}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={currentIndex === totalUrls - 1}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Window Manager */}
      <WindowManager
        url={url}
        isWindowOpen={isWindowOpen}
        onOpenWindow={onOpenWindow}
        onCloseWindow={onCloseWindow}
      />
    </div>
  );
};

export default URLPreviewSection;
