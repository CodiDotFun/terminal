
import React, { useState, useEffect, useRef } from 'react';
import { useSounds } from './SoundManager';

interface TerminalMessage {
  id: string;
  type: 'command' | 'output' | 'error' | 'success';
  content: string;
  timestamp: Date;
}

interface TerminalDisplayProps {
  messages: TerminalMessage[];
  isActive: boolean;
  onCommand?: (command: string) => void;
}

const TerminalDisplay: React.FC<TerminalDisplayProps> = ({ messages, isActive, onCommand }) => {
  const [displayedMessages, setDisplayedMessages] = useState<TerminalMessage[]>([]);
  const [currentTyping, setCurrentTyping] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSounds();

  useEffect(() => {
    if (messages.length > displayedMessages.length) {
      const newMessage = messages[displayedMessages.length];
      typeMessage(newMessage);
    }
  }, [messages, displayedMessages.length]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayedMessages, currentTyping]);

  const typeMessage = async (message: TerminalMessage) => {
    setIsTyping(true);
    setCurrentTyping('');
    
    const content = message.content;
    for (let i = 0; i <= content.length; i++) {
      setCurrentTyping(content.substring(0, i));
      if (i < content.length) {
        playSound('typing');
        await new Promise(resolve => setTimeout(resolve, Math.random() * 20 + 10));
      }
    }
    
    setDisplayedMessages(prev => [...prev, message]);
    setCurrentTyping('');
    setIsTyping(false);
    
    if (message.type === 'success') {
      playSound('success');
    } else if (message.type === 'error') {
      playSound('error');
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim() && onCommand) {
      onCommand(inputValue.trim());
      setInputValue('');
    }
  };

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'command': return 'text-codi';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-300';
    }
  };

  const getPromptSymbol = (type: string) => {
    switch (type) {
      case 'command': return '$ ';
      case 'error': return '✗ ';
      case 'success': return '✓ ';
      default: return '  ';
    }
  };

  return (
    <div className="terminal-glow bg-black/95 backdrop-blur-sm border border-codi/30 rounded-lg overflow-hidden">
      <div className="bg-gray-900/80 px-4 py-2 border-b border-codi/20 flex items-center space-x-2">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-sm text-gray-300 font-mono">CODI Terminal</span>
        <div className="flex-1"></div>
        <div className={`text-xs px-2 py-1 rounded ${isActive ? 'bg-codi/20 text-codi' : 'bg-gray-700 text-gray-400'}`}>
          {isActive ? 'ACTIVE' : 'IDLE'}
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="p-4 h-96 overflow-y-auto font-mono text-sm leading-relaxed"
      >
        {displayedMessages.map((message) => (
          <div key={message.id} className="mb-1">
            <span className="text-gray-500 text-xs mr-2">
              {message.timestamp.toLocaleTimeString()}
            </span>
            <span className={getMessageColor(message.type)}>
              {getPromptSymbol(message.type)}{message.content}
            </span>
          </div>
        ))}
        
        {isTyping && (
          <div className="mb-1">
            <span className="text-gray-500 text-xs mr-2">
              {new Date().toLocaleTimeString()}
            </span>
            <span className="text-gray-300">
              {currentTyping}
              <span className="animate-pulse">|</span>
            </span>
          </div>
        )}
        
        {!isTyping && (
          <div className="flex items-center">
            <span className="text-gray-500 text-xs mr-2">
              {new Date().toLocaleTimeString()}
            </span>
            <span className="text-codi mr-2">$</span>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleInputKeyPress}
              className="bg-transparent outline-none flex-1 text-white"
              placeholder="Type a command..."
              disabled={isTyping}
            />
            <span className="text-codi animate-pulse">|</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalDisplay;
