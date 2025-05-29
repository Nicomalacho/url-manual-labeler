
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const KeyboardShortcuts: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-gray-600 space-y-1">
          <p>💡 <strong>Keyboard Shortcuts:</strong></p>
          <p><strong>P</strong> - Mark as Product</p>
          <p><strong>W</strong> - Mark as Other</p>
          <p><strong>Space</strong> - Scroll down preview</p>
          <p><strong>←/→</strong> - Navigate URLs</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyboardShortcuts;
