import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, Download, ArrowLeft, ArrowRight } from 'lucide-react';
import URLProxy from './URLProxy';
import { parseCSV, generateCSV, downloadCSV } from '../utils/csvUtils';

interface URLData {
  url: string;
  [key: string]: string;
}

interface AssessmentData extends URLData {
  assessment?: 'Product' | 'Other';
}

const URLAssessment = () => {
  const [urls, setUrls] = useState<AssessmentData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [assessments, setAssessments] = useState<Record<number, 'Product' | 'Other'>>({});

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsedData = parseCSV(csvText);
      // Ensure each row has a url property and convert to AssessmentData
      const assessmentData: AssessmentData[] = parsedData.map(row => ({
        url: row.url || '',
        ...row
      }));
      setUrls(assessmentData);
      setCurrentIndex(0);
      setAssessments({});
    };
    reader.readAsText(file);
  };

  // Handle assessment selection
  const handleAssessment = (assessment: 'Product' | 'Other') => {
    setAssessments(prev => ({
      ...prev,
      [currentIndex]: assessment
    }));
    
    // Auto-navigate to next URL after assessment
    setTimeout(() => {
      if (currentIndex < urls.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 300); // Small delay for visual feedback
  };

  // Navigate between URLs
  const navigateToURL = (index: number) => {
    if (index >= 0 && index < urls.length) {
      setCurrentIndex(index);
    }
  };

  // Handle scrolling in the preview
  const scrollPreview = () => {
    // This will be handled by the iframe, so we'll pass this event down
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.scrollBy(0, 300);
      } catch (e) {
        // Cross-origin restrictions might prevent this, but we'll try
        console.log('Cannot scroll iframe due to cross-origin restrictions');
      }
    }
  };

  // Handle keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent default behavior for our custom shortcuts
      if (['p', 'w', ' ', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
      }

      switch (event.key) {
        case 'ArrowLeft':
          navigateToURL(currentIndex - 1);
          break;
        case 'ArrowRight':
          navigateToURL(currentIndex + 1);
          break;
        case 'p':
        case 'P':
          handleAssessment('Product');
          break;
        case 'w':
        case 'W':
          handleAssessment('Other');
          break;
        case ' ':
          scrollPreview();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, urls.length]);

  // Download results
  const handleDownload = () => {
    const resultsData = urls.map((url, index) => ({
      ...url,
      assessment: assessments[index] || ''
    }));
    
    const csvContent = generateCSV(resultsData);
    downloadCSV(csvContent, 'url-assessment-results.csv');
  };

  const currentURL = urls[currentIndex];
  const progress = urls.length > 0 ? ((currentIndex + 1) / urls.length) * 100 : 0;
  const assessedCount = Object.keys(assessments).length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Assessment Tool</h1>
        <p className="text-gray-600">Upload a CSV with URLs and assess each one as Product or Other</p>
      </div>

      {urls.length === 0 ? (
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
              onChange={handleFileUpload}
              className="w-full p-2 border border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload a CSV file containing URLs to begin assessment
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Progress and Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                URL {currentIndex + 1} of {urls.length} • {assessedCount} assessed
              </div>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Results
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Assessment Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[700px]">
            {/* URL Preview */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg truncate" title={currentURL?.url}>
                      {currentURL?.url}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToURL(currentIndex - 1)}
                        disabled={currentIndex === 0}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateToURL(currentIndex + 1)}
                        disabled={currentIndex === urls.length - 1}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[600px]">
                  <URLProxy url={currentURL?.url} />
                </CardContent>
              </Card>
            </div>

            {/* Assessment Controls */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className={`w-full h-12 text-lg ${
                      assessments[currentIndex] === 'Product'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={() => handleAssessment('Product')}
                  >
                    Product (P)
                  </Button>
                  <Button
                    className={`w-full h-12 text-lg ${
                      assessments[currentIndex] === 'Other'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                    onClick={() => handleAssessment('Other')}
                  >
                    Other (W)
                  </Button>
                  
                  {assessments[currentIndex] && (
                    <div className="text-center p-2 bg-green-50 rounded-md">
                      <span className="text-green-700 font-medium">
                        Assessed as: {assessments[currentIndex]}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* URL Details */}
              <Card>
                <CardHeader>
                  <CardTitle>URL Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(currentURL || {}).map(([key, value]) => (
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

              {/* Navigation Help */}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLAssessment;
