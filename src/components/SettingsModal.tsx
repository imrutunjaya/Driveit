import React from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Type, 
  Palette, 
  Eye, 
  Save, 
  RotateCcw,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();

  const fontFamilies = [
    'SF Pro Display',
    'Helvetica Neue',
    'Arial',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Monaco',
  ];

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor },
  ];

  const backgroundColors = [
    '#ffffff',
    '#f8f9fa',
    '#f5f5f7',
    '#fef7ed',
    '#f0f9ff',
    '#f0fdf4',
    '#fdf4ff',
  ];

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
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macos-border">
          <h2 className="text-xl font-semibold text-macos-text">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-8">
            {/* Typography */}
            <div>
              <h3 className="text-lg font-semibold text-macos-text mb-4 flex items-center gap-2">
                <Type size={20} />
                Typography
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-macos-text mb-2">
                    Font Size
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm text-macos-secondary w-8">
                      {settings.fontSize}px
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-macos-text mb-2">
                    Font Family
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-macos-border rounded-lg focus:outline-none focus:ring-2 focus:ring-macos-blue/50"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div>
              <h3 className="text-lg font-semibold text-macos-text mb-4 flex items-center gap-2">
                <Palette size={20} />
                Appearance
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-macos-text mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {themes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => updateSettings({ theme: value as any })}
                        className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                          settings.theme === value
                            ? 'border-macos-blue bg-blue-50 text-macos-blue'
                            : 'border-macos-border hover:border-macos-blue/50'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-sm">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-macos-text mb-2">
                    Background Color
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {backgroundColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => updateSettings({ backgroundColor: color })}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          settings.backgroundColor === color
                            ? 'border-macos-blue scale-110'
                            : 'border-macos-border hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reading Experience */}
            <div>
              <h3 className="text-lg font-semibold text-macos-text mb-4 flex items-center gap-2">
                <Eye size={20} />
                Reading Experience
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.distractionFree}
                    onChange={(e) => updateSettings({ distractionFree: e.target.checked })}
                    className="w-4 h-4 text-macos-blue border-macos-border rounded focus:ring-macos-blue/50"
                  />
                  <div>
                    <span className="text-sm font-medium text-macos-text">
                      Distraction-free mode
                    </span>
                    <p className="text-xs text-macos-secondary">
                      Hide toolbars and UI elements while writing
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.showWordCount}
                    onChange={(e) => updateSettings({ showWordCount: e.target.checked })}
                    className="w-4 h-4 text-macos-blue border-macos-border rounded focus:ring-macos-blue/50"
                  />
                  <div>
                    <span className="text-sm font-medium text-macos-text">
                      Show word count
                    </span>
                    <p className="text-xs text-macos-secondary">
                      Display word count in the status bar
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Auto-save */}
            <div>
              <h3 className="text-lg font-semibold text-macos-text mb-4 flex items-center gap-2">
                <Save size={20} />
                Auto-save
              </h3>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => updateSettings({ autoSave: e.target.checked })}
                  className="w-4 h-4 text-macos-blue border-macos-border rounded focus:ring-macos-blue/50"
                />
                <div>
                  <span className="text-sm font-medium text-macos-text">
                    Enable auto-save
                  </span>
                  <p className="text-xs text-macos-secondary">
                    Automatically save changes as you type
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-macos-border">
          <button
            onClick={resetSettings}
            className="macos-button macos-button-secondary flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset to Defaults
          </button>
          
          <button
            onClick={onClose}
            className="macos-button macos-button-primary"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;