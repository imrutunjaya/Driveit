import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useDrive } from '../contexts/DriveContext';
import { useNotes } from '../contexts/NotesContext';

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadStatus, setUploadStatus] = useState<{ [key: string]: 'uploading' | 'success' | 'error' }>({});
  const { uploadFile, isAuthenticated } = useDrive();
  const { addNote } = useNotes();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const fileId = `${file.name}-${Date.now()}`;
      setUploadStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileId] || 0;
            if (currentProgress >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return { ...prev, [fileId]: currentProgress + 10 };
          });
        }, 200);

        // Read file content
        const content = await readFileContent(file);
        
        // Upload to Drive (if authenticated)
        let driveFileId;
        if (isAuthenticated) {
          driveFileId = await uploadFile(file);
        }

        // Add to notes
        addNote({
          title: file.name.replace(/\.[^/.]+$/, ''),
          content,
          tags: [file.type.includes('text') ? 'text' : 'document'],
          folder: 'Uploads',
          isBookmarked: false,
          isShared: false,
          driveFileId,
        });

        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
        setUploadStatus(prev => ({ ...prev, [fileId]: 'success' }));
      } catch (error) {
        setUploadStatus(prev => ({ ...prev, [fileId]: 'error' }));
      }
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macos-border">
          <h2 className="text-xl font-semibold text-macos-text">Upload Files</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging
                ? 'border-macos-blue bg-blue-50'
                : 'border-macos-border hover:border-macos-blue/50'
            }`}
          >
            <Upload size={48} className="mx-auto text-macos-secondary mb-4" />
            <h3 className="text-lg font-medium text-macos-text mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-sm text-macos-secondary mb-4">
              Supports .txt, .md, .doc, .docx files
            </p>
            
            <input
              type="file"
              multiple
              accept=".txt,.md,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="macos-button macos-button-primary cursor-pointer inline-block"
            >
              Choose Files
            </label>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-macos-text">Upload Progress</h4>
              {Object.entries(uploadProgress).map(([fileId, progress]) => {
                const fileName = fileId.split('-')[0];
                const status = uploadStatus[fileId];
                
                return (
                  <div key={fileId} className="flex items-center gap-3">
                    <File size={16} className="text-macos-secondary" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-macos-text">
                          {fileName}
                        </span>
                        <div className="flex items-center gap-1">
                          {status === 'success' && (
                            <CheckCircle size={16} className="text-macos-green" />
                          )}
                          {status === 'error' && (
                            <AlertCircle size={16} className="text-macos-red" />
                          )}
                          <span className="text-xs text-macos-secondary">
                            {progress}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-2 rounded-full ${
                            status === 'success'
                              ? 'bg-macos-green'
                              : status === 'error'
                              ? 'bg-macos-red'
                              : 'bg-macos-blue'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Sign in to Google Drive to sync your files across devices.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadModal;