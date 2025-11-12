import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ImagePreview } from './components/ImagePreview';
import { ChainEditor } from './components/ChainEditor';
import { StatusBar } from './components/StatusBar';
import { WelcomeDialog } from './components/WelcomeDialog';
import { SettingsPanel } from './components/SettingsPanel';
import { useAppStore } from './lib/store';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { currentProject } = useAppStore();

  useEffect(() => {
    if (currentProject) {
      setShowWelcome(false);
    }
  }, [currentProject]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header onOpenSettings={() => setShowSettings(true)} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex flex-1 overflow-hidden">
          {/* Left Panel - Image Preview */}
          <div className="flex w-1/2 flex-col border-r">
            <ImagePreview />
          </div>

          {/* Right Panel - Chain Editor */}
          <div className="flex w-1/2 flex-col">
            <ChainEditor />
          </div>
        </main>
      </div>

      <StatusBar />

      <WelcomeDialog open={showWelcome} onOpenChange={setShowWelcome} />
      <SettingsPanel open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
}