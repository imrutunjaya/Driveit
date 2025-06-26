import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import ReactQuill from 'react-quill';
import { 
  Save, 
  Share2, 
  Heart, 
  Download, 
  Settings, 
  Eye,
  Type,
  Palette,
  BookOpen
} from 'lucide-react';
import { useNotes } from '../contexts/NotesContext';
import { useSettings } from '../contexts/SettingsContext';
import { useDrive } from '../contexts/DriveContext';
import type { Note } from '../types';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  note: Note | null;
  onNoteChange: (note: Note) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onNoteChange }) => {
  const { updateNote, addNote } = useNotes();
  const { settings } = useSettings();
  const { uploadFile, isAuthenticated } = useDrive();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isDistraction, setIsDistraction] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (note) {
      setContent(note.content);
      setTitle(note.title);
    } else {
      setContent('');
      setTitle('Untitled Note');
    }
  }, [note]);

  useEffect(() => {
    // Calculate word count
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const handleSave = async () => {
    setIsSaving(true);
    
    if (note) {
      updateNote(note.id, { title, content });
      onNoteChange({ ...note, title, content });
    } else {
      const newNote = addNote({
        title,
        content,
        tags: [],
        folder: 'Personal',
        isBookmarked: false,
        isShared: false,
      });
      onNoteChange(newNote);
    }

    // Simulate save delay
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handleBookmark = () => {
    if (note) {
      const updated = { ...note, isBookmarked: !note.isBookmarked };
      updateNote(note.id, { isBookmarked: !note.isBookmarked });
      onNoteChange(updated);
    }
  };

  const handleShare = () => {
    if (note) {
      const updated = { ...note, isShared: !note.isShared };
      updateNote(note.id, { isShared: !note.isShared });
      onNoteChange(updated);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Toolbar */}
      {!isDistraction && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-xl border-b border-macos-border"
        >
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none outline-none text-macos-text"
              placeholder="Untitled Note"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDistraction(!isDistraction)}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              title="Distraction-free mode"
            >
              <Eye size={18} />
            </button>
            
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-lg transition-colors ${
                note?.isBookmarked 
                  ? 'text-macos-red bg-red-50' 
                  : 'hover:bg-white/50'
              }`}
              title="Bookmark"
            >
              <Heart size={18} className={note?.isBookmarked ? 'fill-current' : ''} />
            </button>
            
            <button
              onClick={handleShare}
              className={`p-2 rounded-lg transition-colors ${
                note?.isShared 
                  ? 'text-macos-blue bg-blue-50' 
                  : 'hover:bg-white/50'
              }`}
              title="Share"
            >
              <Share2 size={18} />
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="macos-button macos-button-primary flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Editor */}
      <div 
        className="flex-1 relative"
        style={{
          backgroundColor: settings.backgroundColor,
          fontSize: settings.fontSize,
          fontFamily: settings.fontFamily,
        }}
      >
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          className="h-full"
          style={{
            height: isDistraction ? '100vh' : 'calc(100% - 42px)',
          }}
        />
        
        {/* Distraction-free overlay */}
        {isDistraction && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsDistraction(false)}
            className="fixed top-4 right-4 z-50 p-3 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/30 transition-colors"
          >
            <Eye size={20} />
          </motion.button>
        )}
      </div>

      {/* Status Bar */}
      {!isDistraction && settings.showWordCount && (
        <div className="px-4 py-2 bg-white/50 backdrop-blur-sm border-t border-macos-border text-sm text-macos-secondary">
          <div className="flex items-center justify-between">
            <span>{wordCount} words</span>
            <span>Last saved: {note?.updatedAt.toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;