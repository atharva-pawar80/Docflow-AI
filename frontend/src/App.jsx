import { useState } from 'react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [docInfo, setDocInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');

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
    <div className="app-container">
      <header className="header">
        <h1>DocFlow AI</h1>
        <p>Intelligent Classification & Chat</p>
      </header>

      <main className="main-content">
        <section className="pane left-pane">
          <h2>Document Analysis</h2>
          
          <div className="upload-zone">
            <input type="file" id="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
            <label htmlFor="file" className="btn-upload">
              {loading ? 'Processing...' : 'Upload Document'}
            </label>
            {file && <p className="file-name">{file.name}</p>}
          </div>

          {docInfo && (
            <div className="classification-results slide-up">
              <h3>Classification Result</h3>
              <div className="result-card">
                <p><strong>Type:</strong> <span className="highlight">{docInfo.document_type || 'Unknown'}</span></p>
                <div className="confidence-meter">
                  <div className="confidence-fill" style={{ width: `${(docInfo.confidence || 0) * 100}%` }}></div>
                </div>
                <p><strong>Confidence:</strong> {((docInfo.confidence || 0) * 100).toFixed(2)}%</p>
              </div>
            </div>
          )}
        </section>

        <section className="pane right-pane">
          <h2>Chat with Document</h2>
          <div className="chat-window">
            {!docInfo ? (
              <div className="placeholder">Upload a document to start chatting!</div>
            ) : (
              <>
                <div className="chat-messages">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.role}`}>
                      <div className="message-content">{msg.content}</div>
                    </div>
                  ))}
                </div>
                <div className="chat-input">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question about the document..."
                  />
                  <button onClick={handleSendMessage}>Send</button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
