import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Download, 
  FileText, 
  Calendar, 
  Tag, 
  Folder,
  Heart,
  Share2,
  Search,
  Filter
} from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import type { Note } from '../types';

interface DownloadModalProps {
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ onClose }) => {
  const { notes } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [filterBy, setFilterBy] = useState<'all' | 'bookmarked' | 'shared'>('all');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'bookmarked' && note.isBookmarked) ||
                         (filterBy === 'shared' && note.isShared);
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectNote = (noteId: string) => {
    setSelectedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotes.length === filteredNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(filteredNotes.map(note => note.id));
    }
  };

  const handleDownload = async () => {
    if (selectedNotes.length === 0) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate download progress
    const progressInterval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsDownloading(false);
          
          // Create and download files
          downloadSelectedNotes();
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const downloadSelectedNotes = () => {
    const selectedNotesData = notes.filter(note => selectedNotes.includes(note.id));
    
    selectedNotesData.forEach(note => {
      const content = `# ${note.title}\n\n${note.content.replace(/<[^>]*>/g, '')}\n\n---\nTags: ${note.tags.join(', ')}\nFolder: ${note.folder}\nCreated: ${note.createdAt.toLocaleDateString()}\nUpdated: ${note.updatedAt.toLocaleDateString()}`;
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="floating-panel"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macos-border">
          <div>
            <h2 className="text-xl font-semibold text-macos-text">Download Notes</h2>
            <p className="text-sm text-macos-secondary mt-1">
              Select notes to download as markdown files
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-macos-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-macos-secondary" size={16} />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-macos-border rounded-lg focus:outline-none focus:ring-2 focus:ring-macos-blue/50"
              />
            </div>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-4 py-2 bg-gray-50 border border-macos-border rounded-lg focus:outline-none focus:ring-2 focus:ring-macos-blue/50"
            >
              <option value="all">All Notes</option>
              <option value="bookmarked">Bookmarked</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSelectAll}
              className="text-sm text-macos-blue hover:underline"
            >
              {selectedNotes.length === filteredNotes.length ? 'Deselect All' : 'Select All'}
            </button>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-macos-secondary">
                {selectedNotes.length} of {filteredNotes.length} selected
              </span>
              
              <button
                onClick={handleDownload}
                disabled={selectedNotes.length === 0 || isDownloading}
                className="macos-button macos-button-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Download size={16} />
                {isDownloading ? 'Downloading...' : 'Download Selected'}
              </button>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-macos-secondary mb-4" />
              <p className="text-macos-secondary">No notes found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedNotes.includes(note.id)
                      ? 'border-macos-blue bg-blue-50'
                      : 'border-macos-border hover:border-macos-blue/50'
                  }`}
                  onClick={() => handleSelectNote(note.id)}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedNotes.includes(note.id)}
                      onChange={() => handleSelectNote(note.id)}
                      className="mt-1 w-4 h-4 text-macos-blue border-macos-border rounded focus:ring-macos-blue/50"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-macos-text truncate">
                          {note.title}
                        </h3>
                        <div className="flex items-center gap-1 ml-2">
                          {note.isBookmarked && (
                            <Heart size={14} className="text-macos-red fill-current" />
                          )}
                          {note.isShared && (
                            <Share2 size={14} className="text-macos-blue" />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-macos-secondary line-clamp-2 mb-3">
                        {note.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-macos-secondary">
                        <div className="flex items-center gap-1">
                          <Folder size={12} />
                          <span>{note.folder}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>{note.updatedAt.toLocaleDateString()}</span>
                        </div>
                        
                        {note.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag size={12} />
                            <span>{note.tags.slice(0, 2).join(', ')}</span>
                            {note.tags.length > 2 && <span>+{note.tags.length - 2}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Download Progress */}
        {isDownloading && (
          <div className="p-6 border-t border-macos-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-macos-text">
                Preparing download...
              </span>
              <span className="text-sm text-macos-secondary">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${downloadProgress}%` }}
                className="h-2 bg-macos-blue rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DownloadModal;