
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import URLProxy from './URLProxy';

interface URLPreviewSectionProps {
  url: string;
  currentIndex: number;
  totalUrls: number;
  onNavigate: (index: number) => void;
}

const URLPreviewSection: React.FC<URLPreviewSectionProps> = ({
  url,
  currentIndex,
  totalUrls,
  onNavigate
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate" title={url}>
            {url}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex === totalUrls - 1}
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[600px]">
        <URLProxy url={url} />
      </CardContent>
    </Card>
  );
};

export default URLPreviewSection;
