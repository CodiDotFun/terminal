
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Copy, Download, Check } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language = 'rust',
  title = 'Generated Code'
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.${language === 'rust' ? 'rs' : 'ts'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="chrome-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900/80 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-codi">{title}</h3>
        <div className="flex items-center space-x-2">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
          <Button
            onClick={downloadCode}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <div className="bg-gray-950/50 p-6 overflow-x-auto">
        <pre className="text-sm text-gray-300 font-mono leading-relaxed">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;
