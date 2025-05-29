
import React, { useState, useEffect } from 'react';
import { parseCSV, generateCSV, downloadCSV } from '../utils/csvUtils';
import FileUpload from './FileUpload';
import ProgressStats from './ProgressStats';
import URLPreviewSection from './URLPreviewSection';
import AssessmentControls from './AssessmentControls';
import URLDetails from './URLDetails';
import KeyboardShortcuts from './KeyboardShortcuts';

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
  const assessedCount = Object.keys(assessments).length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">URL Assessment Tool</h1>
        <p className="text-gray-600">Upload a CSV with URLs and assess each one as Product or Other</p>
      </div>

      {urls.length === 0 ? (
        <FileUpload onFileUpload={handleFileUpload} />
      ) : (
        <div className="space-y-6">
          {/* Progress and Stats */}
          <ProgressStats
            currentIndex={currentIndex}
            totalUrls={urls.length}
            assessedCount={assessedCount}
            onDownload={handleDownload}
          />

          {/* Main Assessment Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[700px]">
            {/* URL Preview */}
            <div className="lg:col-span-2">
              <URLPreviewSection
                url={currentURL?.url}
                currentIndex={currentIndex}
                totalUrls={urls.length}
                onNavigate={navigateToURL}
              />
            </div>

            {/* Assessment Controls */}
            <div className="space-y-4">
              <AssessmentControls
                currentAssessment={assessments[currentIndex]}
                onAssessment={handleAssessment}
              />

              {/* URL Details */}
              <URLDetails urlData={currentURL || {}} />

              {/* Navigation Help */}
              <KeyboardShortcuts />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLAssessment;
