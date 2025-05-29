
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const KeyboardShortcuts: React.FC = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-sm text-gray-600 space-y-1">
          <p>💡 <strong>Keyboard Shortcuts:</strong></p>
          <p><strong>P</strong> - Mark as Product (closes window)</p>
          <p><strong>W</strong> - Mark as Other (closes window)</p>
          <p><strong>Space</strong> - Open/focus URL window</p>
          <p><strong>←/→</strong> - Navigate URLs (closes current window)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyboardShortcuts;
