export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  createdAt: Date;
  updatedAt: Date;
  isBookmarked: boolean;
  isShared: boolean;
  driveFileId?: string;
  description?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size: string;
  webViewLink: string;
}

export interface Settings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'auto';
  backgroundColor: string;
  distractionFree: boolean;
  autoSave: boolean;
  showWordCount: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}