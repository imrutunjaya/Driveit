import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Edit3,
  Trash2,
  Download,
  Calendar
} from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import type { Note } from '../types';

interface NotesGridProps {
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
}

const NotesGrid: React.FC<NotesGridProps> = ({ onSelectNote, onCreateNote }) => {
  const { notes, deleteNote } = useNotes();
  const navigate = useNavigate();
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const handleNoteClick = (note: Note) => {
    onSelectNote(note);
    navigate('/editor');
  };

  const handleDeleteNote = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(noteId);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-macos-text">Your Notes</h1>
            <p className="text-macos-secondary mt-1">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>
          
          <motion.button
            onClick={onCreateNote}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="macos-button macos-button-primary flex items-center gap-2"
          >
            <Edit3 size={16} />
            New Note
          </motion.button>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FileText size={64} className="mx-auto text-macos-secondary mb-4" />
            <h3 className="text-xl font-semibold text-macos-text mb-2">No notes yet</h3>
            <p className="text-macos-secondary mb-6">Create your first note to get started</p>
            <button
              onClick={onCreateNote}
              className="macos-button macos-button-primary"
            >
              Create Note
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {notes.map((note) => (
              <motion.div
                key={note.id}
                variants={item}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNoteClick(note)}
                className="macos-card p-6 cursor-pointer group relative overflow-hidden"
              >
                {/* Note Content */}
                <div className="mb-4">
                  <h3 className="font-semibold text-macos-text mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-macos-secondary line-clamp-3">
                    {note.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                  </p>
                </div>

                {/* Tags */}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-macos-blue/10 text-macos-blue text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-macos-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{note.updatedAt.toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {note.isBookmarked && (
                      <Heart size={12} className="text-macos-red fill-current" />
                    )}
                    {note.isShared && (
                      <Share2 size={12} className="text-macos-blue" />
                    )}
                  </div>
                </div>

                {/* Actions (visible on hover) */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-red-50 hover:text-macos-red transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 bg-white/80 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                    >
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>

                {/* Folder indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-macos-blue to-macos-purple opacity-20"></div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotesGrid;