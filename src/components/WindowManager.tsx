
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Eye, EyeOff } from 'lucide-react';

interface WindowManagerProps {
  url: string;
  isWindowOpen: boolean;
  onOpenWindow: () => void;
  onCloseWindow: () => void;
}

const WindowManager: React.FC<WindowManagerProps> = ({
  url,
  isWindowOpen,
  onOpenWindow,
  onCloseWindow
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg truncate" title={url}>
          {url}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[500px] space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <ExternalLink className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {isWindowOpen ? 'Window is Open' : 'Ready to Open URL'}
          </h3>
          <p className="text-gray-600 mb-4">
            {isWindowOpen 
              ? 'The URL is open in a separate window. Make your assessment to close it.'
              : 'Click to open this URL in a new window for assessment.'
            }
          </p>
        </div>

        <div className="flex gap-3">
          {!isWindowOpen ? (
            <Button onClick={onOpenWindow} size="lg" className="px-8">
              <ExternalLink className="w-5 h-5 mr-2" />
              Open URL (Space)
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button onClick={onOpenWindow} variant="outline" size="lg">
                <Eye className="w-5 h-5 mr-2" />
                Focus Window
              </Button>
              <Button onClick={onCloseWindow} variant="outline" size="lg">
                <EyeOff className="w-5 h-5 mr-2" />
                Close Window
              </Button>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center max-w-md">
          Use keyboard shortcuts: <strong>Space</strong> to open/focus, <strong>P</strong> for Product, <strong>W</strong> for Other, <strong>←/→</strong> to navigate
        </div>
      </CardContent>
    </Card>
  );
};

export default WindowManager;
