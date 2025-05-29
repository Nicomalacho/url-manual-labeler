
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface URLDetailsProps {
  urlData: Record<string, string>;
}

const URLDetails: React.FC<URLDetailsProps> = ({ urlData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>URL Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {Object.entries(urlData || {}).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="font-medium text-gray-600 w-20 flex-shrink-0 capitalize">
                {key}:
              </span>
              <span className="text-gray-900 break-all">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default URLDetails;
