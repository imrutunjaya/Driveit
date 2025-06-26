import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, DriveFile } from '../types';

interface DriveContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  uploadFile: (file: File) => Promise<string>;
  downloadFile: (fileId: string) => Promise<string>;
  listFiles: () => Promise<DriveFile[]>;
  deleteFile: (fileId: string) => Promise<void>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export const useDrive = () => {
  const context = useContext(DriveContext);
  if (!context) {
    throw new Error('useDrive must be used within a DriveProvider');
  }
  return context;
};

export const DriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize Google API
    const initializeGapi = async () => {
      if (typeof window !== 'undefined' && window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual client ID
          callback: handleCredentialResponse,
        });
      }
    };

    initializeGapi();
  }, []);

  const handleCredentialResponse = (response: any) => {
    // Decode JWT token to get user info
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    setUser({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
    setIsAuthenticated(true);
  };

  const signIn = async () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  const signOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Mock implementation - replace with actual Google Drive API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`mock-file-id-${Date.now()}`);
      }, 2000);
    });
  };

  const downloadFile = async (fileId: string): Promise<string> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('Mock file content');
      }, 1000);
    });
  };

  const listFiles = async (): Promise<DriveFile[]> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'My First Note.txt',
            mimeType: 'text/plain',
            modifiedTime: new Date().toISOString(),
            size: '1024',
            webViewLink: '#',
          },
          {
            id: '2',
            name: 'Project Ideas.md',
            mimeType: 'text/markdown',
            modifiedTime: new Date().toISOString(),
            size: '2048',
            webViewLink: '#',
          },
        ]);
      }, 1000);
    });
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  return (
    <DriveContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signOut,
        uploadFile,
        downloadFile,
        listFiles,
        deleteFile,
      }}
    >
      {children}
    </DriveContext.Provider>
  );
};