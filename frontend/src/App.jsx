import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, MessageSquare, Send, Bot, User, Activity, FileType, CheckCircle2 } from 'lucide-react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [docInfo, setDocInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      const res = await fetch('http://localhost:8000/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setDocInfo(data);
    } catch (err) {
      console.error(err);
      alert('Failed to upload and process document.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !docInfo?.doc_id) return;

    const userMessage = { role: 'user', content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      const res = await fetch(`http://localhost:8000/chat/${docInfo.doc_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { role: 'bot', content: data.answer }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { role: 'bot', content: 'Sorry, an error occurred.' }]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100 tracking-wide">DocFlow<span className="text-indigo-400 ml-1">AI</span></h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Enterprise Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">System Online</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex gap-6 p-6 h-[calc(100vh-65px)] overflow-hidden">
        
        {/* Left Sidebar */}
        <section className="w-[380px] flex flex-col gap-6 shrink-0">
          
          {/* Upload Zone */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <FileText size={14} className="text-indigo-400" />
              Data Source
            </h2>
            
            <div 
              className="relative border border-dashed border-slate-700/60 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-800/40 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer group/dropzone" 
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
              <div className="w-12 h-12 mb-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center group-hover/dropzone:scale-110 group-hover/dropzone:text-indigo-400 group-hover/dropzone:border-indigo-500/30 transition-all duration-300 shadow-lg">
                <Upload size={18} className="text-slate-400 transition-colors" />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-1">
                {loading ? 'Processing Document...' : 'Upload Document'}
              </p>
              <p className="text-xs text-slate-500 mb-2">Drag & drop or click to browse</p>
              
              {file && !loading && (
                <div className="mt-4 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md flex items-center gap-2 text-indigo-300 text-xs w-full max-w-xs truncate animate-fade-in-up">
                  <FileText size={14} className="shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Classification Results */}
          {docInfo && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 flex flex-col animate-fade-in-up">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <FileType size={14} className="text-emerald-400" />
                Intelligence Results
              </h2>
              
              <div className="space-y-3">
                <div className="bg-[#020617] rounded-xl p-4 border border-slate-800/80">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Classification</span>
                    <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      Verified
                    </span>
                  </div>
                  <p className="text-base font-medium text-slate-200 capitalize tracking-wide">{docInfo.document_type || 'Unknown'}</p>
                </div>

                <div className="bg-[#020617] rounded-xl p-4 border border-slate-800/80">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Confidence Score</span>
                    <span className="text-xs font-semibold text-slate-300">{((docInfo.confidence || 0) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full relative" 
                      style={{ width: `${(docInfo.confidence || 0) * 100}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Pane (Chat) */}
        <section className="flex-1 flex flex-col min-w-0 bg-slate-900/30 rounded-2xl border border-slate-800/80 overflow-hidden relative shadow-2xl">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-800/80 bg-[#020617]/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare size={16} className="text-indigo-400" />
              <h2 className="text-sm font-medium text-slate-200 tracking-wide">Interactive Assistant</h2>
            </div>
            {docInfo && (
              <span className="text-xs text-slate-500 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                Context: {file?.name || 'Uploaded Document'}
              </span>
            )}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {!docInfo ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-5 rotate-3 hover:rotate-0 transition-transform">
                  <Bot size={32} className="text-slate-400" />
                </div>
                <p className="text-base font-medium text-slate-300 mb-1">Awaiting Document</p>
                <p className="text-xs text-slate-500 max-w-[240px]">Upload a file on the left to extract intelligence and begin analysis.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {chatHistory.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-10 opacity-70">
                    <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                      <Bot size={20} className="text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300 mb-1">Document context loaded.</p>
                    <p className="text-xs text-slate-500">Ask me any questions about the content.</p>
                  </div>
                )}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 animate-fade-in-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`} style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300'}`}>
                      {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-900/20' : 'bg-[#020617] text-slate-300 rounded-tl-sm border border-slate-800 shadow-md shadow-black/20'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-[#020617]/80 border-t border-slate-800/80 backdrop-blur-md">
            <div className={`relative flex items-center ${!docInfo ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about the document..."
                disabled={!docInfo}
                className="w-full bg-[#020617] border border-slate-700/60 rounded-xl py-3.5 pl-4 pr-12 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!docInfo || !message.trim()}
                className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 border border-indigo-500 text-white rounded-lg transition-all duration-200 flex items-center justify-center group"
              >
                <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-3 px-1">
              <p className="text-[10px] text-slate-500">Press <kbd className="font-mono bg-slate-800 px-1 py-0.5 rounded border border-slate-700">Enter</kbd> to send</p>
              <p className="text-[10px] text-slate-500">AI can make mistakes. Verify important information.</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
