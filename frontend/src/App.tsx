import { useState, useCallback } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

export default function App() {
  const [docVisible, setDocVisible] = useState(false);

  const handleDocumentReady = useCallback(() => {
    setDocVisible(true);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden">
      <Header />
      <main className="flex-1 flex gap-5 p-5 overflow-hidden min-h-0">
        <LeftPanel onDocumentReady={handleDocumentReady} />
        <RightPanel docVisible={docVisible} />
      </main>
    </div>
  );
}
