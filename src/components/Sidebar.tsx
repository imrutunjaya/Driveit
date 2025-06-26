import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Download, 
  Settings, 
  Search, 
  Folder, 
  Heart, 
  Plus,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import { useDrive } from '../contexts/DriveContext';
import type { Note } from '../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentNote: Note | null;
  onSelectNote: (note: Note) => void;
  onShowUpload: () => void;
  onShowDownload: () => void;
  onShowSettings: () => void;
  onShowAuth: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  currentNote,
  onSelectNote,
  onShowUpload,
  onShowDownload,
  onShowSettings,
  onShowAuth,
}) => {
  const { notes, addNote } = useNotes();
  const { user, isAuthenticated } = useDrive();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All Notes');

  const folders = ['All Notes', 'Personal', 'Work', 'Ideas', 'Archive'];
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'All Notes' || note.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleCreateNote = () => {
    const newNote = addNote({
      title: 'Untitled Note',
      content: '',
      tags: [],
      folder: selectedFolder === 'All Notes' ? 'Personal' : selectedFolder,
      isBookmarked: false,
      isShared: false,
    });
    onSelectNote(newNote);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 60 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="macos-sidebar flex flex-col h-full relative"
    >
      {/* Header */}
      <div className="p-4 border-b border-macos-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold text-macos-text"
            >
              Notes
            </motion.h1>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* Action Buttons */}
          <div className="p-4 space-y-2">
            <button
              onClick={onShowUpload}
              className="w-full macos-button macos-button-primary flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Upload
            </button>
            <button
              onClick={onShowDownload}
              className="w-full macos-button macos-button-secondary flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Download
            </button>
          </div>

          {/* Search */}
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-macos-secondary" size={16} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/50 border border-macos-border rounded-lg focus:outline-none focus:ring-2 focus:ring-macos-blue/50"
              />
            </div>
          </div>

          {/* Folders */}
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-macos-secondary mb-2">Folders</h3>
            <div className="space-y-1">
              {folders.map((folder) => (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                    selectedFolder === folder
                      ? 'bg-macos-blue text-white'
                      : 'hover:bg-white/50 text-macos-text'
                  }`}
                >
                  <Folder size={16} />
                  <span className="text-sm">{folder}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-macos-secondary">Notes</h3>
              <button
                onClick={handleCreateNote}
                className="p-1 rounded hover:bg-white/50 transition-colors"
              >
                <Plus size={16} className="text-macos-secondary" />
              </button>
            </div>
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <motion.button
                  key={note.id}
                  onClick={() => onSelectNote(note)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    currentNote?.id === note.id
                      ? 'bg-macos-blue text-white shadow-md'
                      : 'bg-white/50 hover:bg-white/70 text-macos-text'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{note.title}</h4>
                      <p className="text-xs opacity-70 mt-1 line-clamp-2">
                        {note.content.replace(/<[^>]*>/g, '').substring(0, 60)}...
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        {note.isBookmarked && <Heart size={12} className="fill-current" />}
                        {note.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-black/10 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-macos-border space-y-2">
            <button
              onClick={onShowAuth}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors text-macos-text"
            >
              <User size={16} />
              <span className="text-sm">
                {isAuthenticated ? user?.name : 'Sign In'}
              </span>
            </button>
            <button
              onClick={onShowSettings}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/50 transition-colors text-macos-text"
            >
              <Settings size={16} />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </>
      )}

      {collapsed && (
        <div className="flex flex-col items-center py-4 space-y-4">
          <button
            onClick={onShowUpload}
            className="p-3 rounded-lg bg-macos-blue text-white hover:bg-blue-600 transition-colors"
          >
            <Upload size={20} />
          </button>
          <button
            onClick={onShowDownload}
            className="p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
          >
            <Download size={20} />
          </button>
          <button
            onClick={handleCreateNote}
            className="p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;