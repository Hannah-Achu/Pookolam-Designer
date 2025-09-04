/*import React from 'react';
import { Flower, Eraser, Move, RotateCcw, RotateCw, Shuffle, Download, Share, Sparkles } from 'lucide-react';

interface ToolBarProps {
  selectedTool: 'flower' | 'eraser' | 'move';
  onToolSelect: (tool: 'flower' | 'eraser' | 'move') => void;
  symmetryMode: 'none' | '2-fold' | '4-fold' | '8-fold' | 'radial';
  onSymmetryChange: (mode: 'none' | '2-fold' | '4-fold' | '8-fold' | 'radial') => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onGeneratePattern: () => void;
  onSave: () => void;
  onShare: () => void;
  onClear: () => void;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  selectedTool,
  onToolSelect,
  symmetryMode,
  onSymmetryChange,
  brushSize,
  onBrushSizeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onGeneratePattern,
  onSave,
  onShare,
  onClear,
}) => {
  const tools = [
    { id: 'flower' as const, icon: Flower, label: 'Place Flowers' },
    { id: 'eraser' as const, icon: Eraser, label: 'Remove Flowers' },
    { id: 'move' as const, icon: Move, label: 'Move Flowers' },
  ];

  const symmetryModes = [
    { id: 'none' as const, label: 'Free' },
    { id: '2-fold' as const, label: '2-Fold' },
    { id: '4-fold' as const, label: '4-Fold' },
    { id: '8-fold' as const, label: '8-Fold' },
    { id: 'radial' as const, label: 'Radial' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-6">
      
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tools</h3>
        <div className="flex space-x-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolSelect(tool.id)}
              className={`
                p-2 rounded-lg transition-all duration-200 hover:scale-105 group
                ${
                  selectedTool === tool.id
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-orange-100 text-gray-600'
                }
              `}
              title={tool.label}
            >
              <tool.icon size={20} />
            </button>
          ))}
        </div>
      </div>

    
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Symmetry</h3>
        <div className="grid grid-cols-3 gap-1 text-xs">
          {symmetryModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSymmetryChange(mode.id)}
              className={`
                py-1 px-2 rounded transition-all duration-200 hover:scale-105
                ${
                  symmetryMode === mode.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 hover:bg-green-100 text-gray-600'
                }
              `}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

    
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Size</h3>
        <input
          type="range"
          min="10"
          max="50"
          value={brushSize}
          onChange={(e) => onBrushSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-xs text-gray-500 text-center mt-1">{brushSize}px</div>
      </div>

     
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Actions</h3>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              title="Undo"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="flex-1 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              title="Redo"
            >
              <RotateCw size={16} />
            </button>
          </div>
          
          <button
            onClick={onGeneratePattern}
            className="w-full p-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Sparkles size={16} />
            <span className="text-sm">Generate</span>
          </button>
          
          <button
            onClick={onSave}
            className="w-full p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Download size={16} />
            <span className="text-sm">Save</span>
          </button>
          
          <button
            onClick={onShare}
            className="w-full p-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Share size={16} />
            <span className="text-sm">Share</span>
          </button>
          
          <button
            onClick={onClear}
            className="w-full p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-105 text-sm"
          >
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
};*/

import React from 'react';
import { SymmetryMode } from '../types';

interface ToolBarProps {
  selectedTool: 'flower' | 'eraser' | 'move';
  onToolSelect: (tool: 'flower' | 'eraser' | 'move') => void;
  symmetryMode: SymmetryMode;
  onSymmetryChange: (mode: SymmetryMode) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onGeneratePattern: () => void;
  onClear: () => void;
  onSave: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  selectedTool,
  onToolSelect,
  symmetryMode,
  onSymmetryChange,
  brushSize,
  onBrushSizeChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onGeneratePattern,
  onClear,
  onSave,
  onDownload,
  onShare,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Tools</h3>

      {/* Tool Buttons */}
      <div className="flex space-x-2">
        {['flower', 'eraser', 'move'].map(tool => (
          <button
            key={tool}
            onClick={() => onToolSelect(tool as 'flower' | 'eraser' | 'move')}
            className={`px-3 py-2 rounded-lg ${
              selectedTool === tool ? 'bg-orange-500 text-white' : 'bg-gray-200'
            }`}
          >
            {tool.charAt(0).toUpperCase() + tool.slice(1)}
          </button>
        ))}
      </div>

      {/* Symmetry */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Symmetry</label>
        <select
          value={symmetryMode}
          onChange={e => onSymmetryChange(e.target.value as SymmetryMode)}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-2 py-1"
        >
          <option value="none">None</option>
          <option value="2-fold">2-fold</option>
          <option value="4-fold">4-fold</option>
          <option value="8-fold">8-fold</option>
        </select>
      </div>

      {/* Brush Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Brush Size</label>
        <input
          type="range"
          min={5}
          max={50}
          value={brushSize}
          onChange={e => onBrushSizeChange(Number(e.target.value))}
          className="mt-1 w-full"
        />
      </div>

      {/* Undo / Redo */}
      <div className="flex space-x-2">
        <button onClick={onUndo} disabled={!canUndo} className="px-3 py-2 bg-gray-300 rounded-lg">
          Undo
        </button>
        <button onClick={onRedo} disabled={!canRedo} className="px-3 py-2 bg-gray-300 rounded-lg">
          Redo
        </button>
      </div>

      {/* Pattern / Clear */}
      <div className="flex space-x-2">
        <button onClick={onGeneratePattern} className="px-3 py-2 bg-yellow-400 text-white rounded-lg">
          Generate Pattern
        </button>
        <button onClick={onClear} className="px-3 py-2 bg-red-400 text-white rounded-lg">
          Clear
        </button>
      </div>

      {/* Save / Download / Share */}
      <div className="flex space-x-2 mt-2">
        <button onClick={onSave} className="px-3 py-2 bg-green-500 text-white rounded-lg">
          Save
        </button>
        <button onClick={onDownload} className="px-3 py-2 bg-blue-500 text-white rounded-lg">
          Download
        </button>
        <button onClick={onShare} className="px-3 py-2 bg-purple-500 text-white rounded-lg">
          Share
        </button>
      </div>
    </div>
  );
};
