
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatMode: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'CODI_CHAT_MODE initialized. Planning session active. Describe your Solana DApp requirements for analysis.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsProcessing(true);

    try {
      console.log('Sending chat message:', currentInput.substring(0, 100) + '...');

      // Prepare chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput,
          chatHistory,
        },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiResponse]);
      console.log('Chat response received successfully');

    } catch (error: any) {
      console.error('Chat error:', error);
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `ERROR: ${error.message || 'Failed to process message. Please try again.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col glass-panel rounded-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="font-cyber text-codi prompt">CHAT_MODE</h3>
          <div className="text-xs text-white/60">
            STATUS: PLANNING | VERSION: 2.1.3
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'glass-strong border border-white/20 text-white'
                  : 'glass-panel border border-codi/20 text-white'
              }`}
            >
              <div className="text-xs text-white/40 mb-1">
                {message.role === 'user' ? 'USER' : 'CODI_AI'} | {message.timestamp.toLocaleTimeString()}
              </div>
              <div className="font-mono text-sm whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="glass-panel border border-codi/20 p-3 rounded-lg">
              <div className="text-xs text-white/40 mb-1">CODI_AI | PROCESSING...</div>
              <div className="font-mono text-sm text-codi cursor">
                Analyzing request
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder=">_ Describe your DApp requirements..."
            className="flex-1 bg-black/50 border-white/20 text-white placeholder:text-white/40 font-mono resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isProcessing}
          />
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className="terminal-border bg-transparent text-codi hover:bg-codi/10 px-6"
          >
            {isProcessing ? 'PROCESSING...' : 'SEND'}
          </Button>
        </div>
        <div className="text-xs text-white/40 mt-2">
          ENTER to send | SHIFT+ENTER for new line
        </div>
      </div>
    </div>
  );
};

export default ChatMode;
