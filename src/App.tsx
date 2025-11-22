import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { ChatPanel } from './components/ChatPanel';
import { DraftsList } from './components/DraftsList';
import { LoginPage } from './components/LoginPage';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const { isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Layout
        leftPanel={<EditorPanel />}
        rightPanel={<PreviewPanel />}
        chatPanel={<ChatPanel />}
        onOpenDrafts={() => setIsDraftsOpen(true)}
      />
      <DraftsList isOpen={isDraftsOpen} onClose={() => setIsDraftsOpen(false)} />
    </>
  );
}

export default App;
