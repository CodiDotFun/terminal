
import React, { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from './ui/button';
import { Copy, Download, Check, Play, Save, Settings } from 'lucide-react';

interface EnhancedCodeEditorProps {
  initialCode: string;
  language?: string;
  title?: string;
  onCodeChange?: (code: string) => void;
  onSave?: (code: string) => void;
  onRun?: (code: string) => void;
  readOnly?: boolean;
}

const EnhancedCodeEditor: React.FC<EnhancedCodeEditorProps> = ({
  initialCode,
  language = 'rust',
  title = 'Code Editor',
  onCodeChange,
  onSave,
  onRun,
  readOnly = false
}) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);

  const handleEditorChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange?.(newCode);
  }, [onCodeChange]);

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

  const handleSave = () => {
    onSave?.(code);
  };

  const handleRun = () => {
    onRun?.(code);
  };

  const editorOptions = {
    fontSize,
    fontFamily: 'JetBrains Mono, Fira Code, monospace',
    lineNumbers: 'on' as const,
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
    folding: true,
    foldingStrategy: 'indentation' as const,
    renderLineHighlight: 'all' as const,
    selectOnLineNumbers: true,
    matchBrackets: 'always' as const,
    theme: theme,
    readOnly,
    cursorBlinking: 'blink' as const,
    cursorStyle: 'line' as const,
    smoothScrolling: true,
    mouseWheelZoom: true,
  };

  return (
    <div className="terminal-glow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900/80 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-codi">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!readOnly && onRun && (
            <Button
              onClick={handleRun}
              variant="outline"
              size="sm"
              className="border-codi text-codi hover:bg-codi/10"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          )}
          
          {!readOnly && onSave && (
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="border-gray-600 hover:bg-gray-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
          
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
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="sm"
            className="border-gray-600 hover:bg-gray-700"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-800/90 border-b border-gray-700 p-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Theme:</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'vs-light')}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
              >
                <option value="vs-dark">Dark</option>
                <option value="vs-light">Light</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-300">Font Size:</label>
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-300 w-8">{fontSize}px</span>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="bg-gray-950/50">
        <Editor
          height="500px"
          language={language}
          value={code}
          onChange={handleEditorChange}
          options={editorOptions}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default EnhancedCodeEditor;
