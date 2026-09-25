import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, BookOpen, ChevronDown, MessageSquare, Sparkles } from 'lucide-react';
import { MOCK_CHAT_HISTORY, MOCK_BOT_RESPONSES } from '@/lib/mockData';
import type { ChatMessage } from '@/lib/mockData';

interface RAGChatProps {
  visible: boolean;
}

let responseIndex = 0;

export default function RAGChat({ visible }: RAGChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));

    const mockResponse = MOCK_BOT_RESPONSES[responseIndex % MOCK_BOT_RESPONSES.length];
    responseIndex++;

    const botMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: mockResponse.content,
      sources: mockResponse.sources,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);
  }, [input, isTyping]);

  const toggleChunk = (id: string) => {
    setExpandedChunks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!visible) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-600">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
          <MessageSquare className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">Upload a document to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 animate-fade-in-up">
      {/* Messages list */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-1 py-2 scrollbar-thin">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 ${
              msg.role === 'user'
                ? 'bg-blue-500/20 border border-blue-500/30'
                : 'bg-violet-500/20 border border-violet-500/30'
            }`}>
              {msg.role === 'user'
                ? <User className="w-3.5 h-3.5 text-blue-400" />
                : <Bot className="w-3.5 h-3.5 text-violet-400" />
              }
            </div>

            <div className={`flex flex-col gap-2 max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {/* Bubble */}
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-500/20 border border-blue-500/25 text-blue-50 rounded-tr-sm'
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-sm'
              }`}>
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
                  part.startsWith('**') && part.endsWith('**')
                    ? <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>
                    : <span key={i}>{part}</span>
                )}
              </div>

              {/* Source chunks */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                      {msg.sources.length} source{msg.sources.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  {msg.sources.map((chunk) => (
                    <button
                      key={chunk.id}
                      onClick={() => toggleChunk(chunk.id)}
                      className="text-left w-full rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-slate-600/60 transition-colors overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3 py-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="flex-shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/15 border border-violet-500/25 text-violet-400">
                            p.{chunk.page}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            ↑{(chunk.score * 100).toFixed(0)}%
                          </span>
                          <span className="text-[10px] text-slate-500 truncate">
                            {chunk.text.slice(0, 55)}…
                          </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 text-slate-500 flex-shrink-0 transition-transform duration-200 ${expandedChunks.has(chunk.id) ? 'rotate-180' : ''}`} />
                      </div>
                      {expandedChunks.has(chunk.id) && (
                        <div className="px-3 pb-3 border-t border-slate-700/50">
                          <p className="text-[11px] text-slate-400 leading-relaxed pt-2">{chunk.text}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-600">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center bg-violet-500/20 border border-violet-500/30 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800/80 border border-slate-700/60">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="pt-3 mt-auto">
        <div className="flex items-end gap-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-2 focus-within:border-blue-500/50 focus-within:bg-slate-800/80 transition-all duration-200">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question about the document…"
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 resize-none outline-none leading-relaxed py-1 px-2 max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-150 active:scale-95 shadow-md shadow-blue-500/20"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-600 mt-1.5">
          Enter to send · Shift+Enter for new line · Sources cited automatically
        </p>
      </div>
    </div>
  );
}
