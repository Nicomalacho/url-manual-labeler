
import React, { useState } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface URLPreviewProps {
  url: string;
}

const URLPreview: React.FC<URLPreviewProps> = ({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">No URL selected</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-white rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading preview...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview not available</h3>
            <p className="text-gray-600 mb-4">Unable to load preview for this URL</p>
            <button
              onClick={openInNewTab}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </button>
          </div>
        </div>
      )}

      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={openInNewTab}
          className="p-2 bg-white/90 hover:bg-white rounded-md shadow-sm transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <iframe
        src={url}
        className="w-full h-full border-0 scale-75 origin-top-left"
        style={{ 
          width: '133.33%', 
          height: '133.33%',
          transform: 'scale(0.75)',
          transformOrigin: '0 0'
        }}
        onLoad={handleLoad}
        onError={handleError}
        title={`Preview of ${url}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default URLPreview;
