
import React, { useState, useEffect, useRef } from 'react';
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
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const currentWindowRef = useRef<Window | null>(null);

  // Handle CSV file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvText = e.target?.result as string;
      const parsedData = parseCSV(csvText);
      const assessmentData: AssessmentData[] = parsedData.map(row => ({
        url: row.url || '',
        ...row
      }));
      setUrls(assessmentData);
      setCurrentIndex(0);
      setAssessments({});
      closeCurrentWindow();
    };
    reader.readAsText(file);
  };

  // Window management functions
  const closeCurrentWindow = () => {
    if (currentWindowRef.current && !currentWindowRef.current.closed) {
      currentWindowRef.current.close();
    }
    currentWindowRef.current = null;
    setIsWindowOpen(false);
  };

  const openWindow = () => {
    if (!urls[currentIndex]?.url) return;

    closeCurrentWindow(); // Close any existing window first

    try {
      const newWindow = window.open(
        urls[currentIndex].url,
        '_blank',
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes,location=yes'
      );

      if (newWindow) {
        currentWindowRef.current = newWindow;
        setIsWindowOpen(true);
        
        // Check if window is closed manually
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            setIsWindowOpen(false);
            currentWindowRef.current = null;
            clearInterval(checkClosed);
          }
        }, 1000);
      } else {
        console.log('Popup blocked or failed to open');
      }
    } catch (error) {
      console.error('Failed to open window:', error);
    }
  };

  const focusWindow = () => {
    if (currentWindowRef.current && !currentWindowRef.current.closed) {
      currentWindowRef.current.focus();
    } else {
      openWindow();
    }
  };

  // Handle assessment selection
  const handleAssessment = (assessment: 'Product' | 'Other') => {
    setAssessments(prev => ({
      ...prev,
      [currentIndex]: assessment
    }));
    
    closeCurrentWindow(); // Close window when assessment is made
    
    // Auto-navigate to next URL after assessment
    setTimeout(() => {
      if (currentIndex < urls.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 300);
  };

  // Navigate between URLs
  const navigateToURL = (index: number) => {
    if (index >= 0 && index < urls.length) {
      closeCurrentWindow(); // Close current window before navigating
      setCurrentIndex(index);
    }
  };

  // Auto-open window when URL changes (optional)
  useEffect(() => {
    if (urls.length > 0 && urls[currentIndex]?.url) {
      // Automatically open window for new URL after a short delay
      const timer = setTimeout(() => {
        if (!isWindowOpen) {
          openWindow();
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, urls]);

  // Handle keyboard navigation and shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
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
          if (isWindowOpen) {
            focusWindow();
          } else {
            openWindow();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, urls.length, isWindowOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeCurrentWindow();
    };
  }, []);

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
          <ProgressStats
            currentIndex={currentIndex}
            totalUrls={urls.length}
            assessedCount={assessedCount}
            onDownload={handleDownload}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[700px]">
            <div className="lg:col-span-2">
              <URLPreviewSection
                url={currentURL?.url}
                currentIndex={currentIndex}
                totalUrls={urls.length}
                isWindowOpen={isWindowOpen}
                onNavigate={navigateToURL}
                onOpenWindow={openWindow}
                onCloseWindow={closeCurrentWindow}
              />
            </div>

            <div className="space-y-4">
              <AssessmentControls
                currentAssessment={assessments[currentIndex]}
                onAssessment={handleAssessment}
              />

              <URLDetails urlData={currentURL || {}} />

              <KeyboardShortcuts />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default URLAssessment;
