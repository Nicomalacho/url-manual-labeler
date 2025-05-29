
import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface URLProxyProps {
  url: string;
}

const URLProxy: React.FC<URLProxyProps> = ({ url }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchURL = async () => {
      setLoading(true);
      setError(false);
      
      // List of proxy services to try
      const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
        `https://proxy.cors.sh/${url}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
      ];

      for (const proxyUrl of proxies) {
        try {
          console.log(`Trying proxy: ${proxyUrl}`);
          
          const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Accept-Encoding': 'gzip, deflate, br',
              'DNT': '1',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'cross-site'
            }
          });

          if (!response.ok) {
            console.log(`Proxy failed with status: ${response.status}`);
            continue;
          }

          let data;
          try {
            // Try to parse as JSON first (for allorigins.win)
            data = await response.json();
            if (data.contents) {
              setContent(data.contents);
              setLoading(false);
              return;
            }
          } catch {
            // If JSON parsing fails, treat as HTML
            const htmlContent = await response.text();
            setContent(htmlContent);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error(`Proxy ${proxyUrl} failed:`, err);
          continue;
        }
      }

      // If all proxies fail, try direct fetch as last resort
      try {
        console.log('Trying direct fetch as last resort');
        const response = await fetch(url, {
          mode: 'no-cors',
          method: 'GET'
        });
        
        // no-cors mode doesn't give us the content, but we can try to load it in iframe
        setContent(`<html><body><p>Loading ${url}...</p><script>window.location.href = '${url}';</script></body></html>`);
        setLoading(false);
      } catch (err) {
        console.error('All fetch attempts failed:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchURL();
  }, [url]);

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
            <p className="text-xs text-gray-500 mt-1">Trying multiple proxy services...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Preview not available</h3>
            <p className="text-gray-600 mb-2">Unable to load preview for this URL</p>
            <p className="text-xs text-gray-500 mb-4">This may be due to CORS restrictions or site security policies</p>
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

      {!loading && !error && (
        <iframe
          srcDoc={content}
          className="w-full h-full border-0"
          title={`Preview of ${url}`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};

export default URLProxy;
