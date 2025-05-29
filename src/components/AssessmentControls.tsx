
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssessmentControlsProps {
  currentAssessment?: 'Product' | 'Other';
  onAssessment: (assessment: 'Product' | 'Other') => void;
}

const AssessmentControls: React.FC<AssessmentControlsProps> = ({
  currentAssessment,
  onAssessment
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className={`w-full h-12 text-lg ${
            currentAssessment === 'Product'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={() => onAssessment('Product')}
        >
          Product (P)
        </Button>
        <Button
          className={`w-full h-12 text-lg ${
            currentAssessment === 'Other'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
          onClick={() => onAssessment('Other')}
        >
          Other (W)
        </Button>
        
        {currentAssessment && (
          <div className="text-center p-2 bg-green-50 rounded-md">
            <span className="text-green-700 font-medium">
              Assessed as: {currentAssessment}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentControls;
