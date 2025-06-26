import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import NotesGrid from './components/NotesGrid';
import UploadModal from './components/UploadModal';
import DownloadModal from './components/DownloadModal';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import { DriveProvider } from './contexts/DriveContext';
import { NotesProvider } from './contexts/NotesContext';
import { SettingsProvider } from './contexts/SettingsContext';
import type { Note } from './types';

function App() {
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <SettingsProvider>
        <DriveProvider>
          <NotesProvider>
            <div className="h-screen flex bg-macos-bg font-sf">
              {/* Sidebar */}
              <Sidebar 
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                currentNote={currentNote}
                onSelectNote={setCurrentNote}
                onShowUpload={() => setShowUploadModal(true)}
                onShowDownload={() => setShowDownloadModal(true)}
                onShowSettings={() => setShowSettingsModal(true)}
                onShowAuth={() => setShowAuthModal(true)}
              />

              {/* Main Content */}
              <div className="flex-1 flex flex-col">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <NotesGrid 
                        onSelectNote={setCurrentNote}
                        onCreateNote={() => setCurrentNote(null)}
                      />
                    } 
                  />
                  <Route 
                    path="/editor" 
                    element={
                      <Editor 
                        note={currentNote}
                        onNoteChange={setCurrentNote}
                      />
                    } 
                  />
                </Routes>
              </div>

              {/* Modals */}
              <AnimatePresence>
                {showUploadModal && (
                  <UploadModal onClose={() => setShowUploadModal(false)} />
                )}
                {showDownloadModal && (
                  <DownloadModal onClose={() => setShowDownloadModal(false)} />
                )}
                {showSettingsModal && (
                  <SettingsModal onClose={() => setShowSettingsModal(false)} />
                )}
                {showAuthModal && (
                  <AuthModal onClose={() => setShowAuthModal(false)} />
                )}
              </AnimatePresence>
            </div>
          </NotesProvider>
        </DriveProvider>
      </SettingsProvider>
    </Router>
  );
}

export default App;