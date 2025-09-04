/*import React, { useState, useRef } from 'react';
import { Palette, GalleryVertical as GalleryIcon, Info } from 'lucide-react';
import { FlowerPalette } from './components/FlowerPalette';
import { ToolBar } from './components/ToolBar';
import { PookkalamCanvas } from './components/PookkalamCanvas';
import { Gallery } from './components/Gallery';
import { ShareModal } from './components/ShareModal';
import { useCanvasHistory } from './hooks/useCanvasHistory';
import { TRADITIONAL_FLOWERS } from './data/flowers';
import { SAMPLE_DESIGNS } from './data/sampleDesigns';
import { generateRandomPattern } from './utils/patternGenerator';
import { shareToSocialMedia, downloadCanvasAsImage } from './utils/socialShare';
import { CanvasState, PookkalamDesign,FlowerType } from './types';

const INITIAL_STATE: CanvasState = {
  flowers: [],
  symmetryMode: 'none',
  selectedTool: 'flower',
  selectedFlower: TRADITIONAL_FLOWERS[0],
  brushSize: 20,
};

function App() {
  const [activeTab, setActiveTab] = useState<'design' | 'gallery' | 'about'>('design');
  const [designs, setDesigns] = useState<PookkalamDesign[]>(SAMPLE_DESIGNS);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [designName, setDesignName] = useState('My Beautiful Pookkalam');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    currentState,
    updateState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasHistory(INITIAL_STATE);

  const handleToolSelect = (tool: 'flower' | 'eraser' | 'move') => {
    updateState({ ...currentState, selectedTool: tool });
  };

  const handleFlowerSelect = (flower: FlowerType) => {
    updateState({ 
      ...currentState, 
      selectedFlower: flower,
      selectedTool: 'flower'
    });
  };

  const handleSymmetryChange = (mode: 'none' | '2-fold' | '4-fold' | '8-fold' | 'radial') => {
    updateState({ ...currentState, symmetryMode: mode });
  };

  const handleBrushSizeChange = (size: number) => {
    updateState({ ...currentState, brushSize: size });
  };

  const handleGeneratePattern = () => {
    const newFlowers = generateRandomPattern(600, 600, 40);
    updateState({ ...currentState, flowers: newFlowers });
    saveState();
  };

  const handleClear = () => {
    updateState({ ...currentState, flowers: [] });
    saveState();
  };

  const handleSave = () => {
    setShareModalOpen(true);
  };

  const handleShare = (platform: string) => {
    if (canvasRef.current) {
      const imageData = canvasRef.current.toDataURL('image/png');
      shareToSocialMedia(designName, imageData, platform as any);
    }
    setShareModalOpen(false);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      downloadCanvasAsImage(canvasRef.current, `${designName.toLowerCase().replace(/\s+/g, '-')}.png`);
    }
    setShareModalOpen(false);
  };

  const handleDesignLike = (id: string) => {
    setDesigns(prev => prev.map(design => 
      design.id === id ? { ...design, likes: design.likes + 1 } : design
    ));
  };

  const handleDesignVote = (id: string) => {
    setDesigns(prev => prev.map(design => 
      design.id === id ? { 
        ...design, 
        votes: design.votes + 1,
        rating: Math.min(5, design.rating + 0.1)
      } : design
    ));
  };

  const tabs = [
    { id: 'design' as const, label: 'Designer', icon: Palette },
    { id: 'gallery' as const, label: 'Gallery', icon: GalleryIcon },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pookkalam Designer</h1>
                <p className="text-sm text-orange-600">Traditional Onam Flower Carpets</p>
              </div>
            </div>
            
            <nav className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105
                    ${activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-orange-100'
                    }
                  `}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

     
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <FlowerPalette
                flowers={TRADITIONAL_FLOWERS}
                selectedFlower={currentState.selectedFlower}
                onFlowerSelect={handleFlowerSelect}
              />
              <ToolBar
                selectedTool={currentState.selectedTool}
                onToolSelect={handleToolSelect}
                symmetryMode={currentState.symmetryMode}
                onSymmetryChange={handleSymmetryChange}
                brushSize={currentState.brushSize}
                onBrushSizeChange={handleBrushSizeChange}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onGeneratePattern={handleGeneratePattern}
                onSave={handleSave}
                onShare={handleSave}
                onClear={handleClear}
              />
            </div>
            
            <div className="lg:col-span-3">
              <div className="mb-4">
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value)}
                  placeholder="Name your Pookkalam..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                />
              </div>
              <PookkalamCanvas
                canvasState={currentState}
                onCanvasStateChange={updateState}
                onSaveState={saveState}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <Gallery
            designs={designs}
            onDesignLike={handleDesignLike}
            onDesignVote={handleDesignVote}
          />
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-4xl">🌸</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">About Pookkalam</h2>
              <p className="text-lg text-orange-600">Traditional Onam Flower Carpets</p>
            </div>

            <div className="prose prose-orange max-w-none">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">What is Pookkalam?</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Pookkalam is a traditional floral carpet made during Onam, the harvest festival of Kerala, India. 
                    These intricate designs are created using fresh flower petals arranged in beautiful geometric patterns, 
                    symbolizing prosperity, joy, and the welcoming of King Mahabali.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Traditional Flowers</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center"><span className="mr-2">🌼</span> Marigold - Prosperity and good fortune</li>
                    <li className="flex items-center"><span className="mr-2">🌹</span> Rose - Love and devotion</li>
                    <li className="flex items-center"><span className="mr-2">🌺</span> Jasmine - Purity and grace</li>
                    <li className="flex items-center"><span className="mr-2">🪷</span> Lotus - Spiritual enlightenment</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Using the Designer</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">1</div>
                      <div>
                        <strong>Choose flowers</strong> from the traditional palette on the left
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">2</div>
                      <div>
                        <strong>Select symmetry mode</strong> to create balanced patterns
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">3</div>
                      <div>
                        <strong>Click and drag</strong> on the canvas to place flowers
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-sm font-bold">4</div>
                      <div>
                        <strong>Use tools</strong> to erase, move, or generate patterns
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-700 text-sm">
                      <strong>Tip:</strong> Try the radial symmetry mode with lotus flowers 
                      for authentic traditional patterns!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        designName={designName}
        onShare={handleShare}
        onDownload={handleDownload}
      />

      
      <footer className="bg-white border-t border-orange-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">🌸 Happy Onam! Create beautiful Pookkalam designs 🌸</p>
            <p className="text-sm">Celebrating Kerala's rich cultural heritage through digital art</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;*/

/*import React, { useState, useRef, useEffect } from 'react';
import { Palette, GalleryVertical as GalleryIcon, Info } from 'lucide-react';
import { FlowerPalette } from './components/FlowerPalette';
import { ToolBar } from './components/ToolBar';
import { PookkalamCanvas } from './components/PookkalamCanvas';
import { Gallery } from './components/Gallery';
import { ShareModal } from './components/ShareModal';
import { useCanvasHistory } from './hooks/useCanvasHistory';
import { TRADITIONAL_FLOWERS } from './data/flowers';
import { SAMPLE_DESIGNS } from './data/sampleDesigns';
import { generateRandomPattern } from './utils/patternGenerator';
import { shareToSocialMedia, downloadCanvasAsImage } from './utils/socialShare';
import { CanvasState, PookkalamDesign, FlowerType } from './types';
import api from './api'; // Axios instance

const INITIAL_STATE: CanvasState = {
  flowers: [],
  symmetryMode: 'none',
  selectedTool: 'flower',
  selectedFlower: TRADITIONAL_FLOWERS[0],
  brushSize: 20,
};

function App() {
  const [activeTab, setActiveTab] = useState<'design' | 'gallery' | 'about'>('design');
  const [designs, setDesigns] = useState<PookkalamDesign[]>(SAMPLE_DESIGNS);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [designName, setDesignName] = useState('My Beautiful Pookkalam');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    currentState,
    updateState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasHistory(INITIAL_STATE);

  // --- Fetch designs from backend ---
  useEffect(() => {
    api.get('/designs/')
      .then(res => setDesigns(res.data))
      .catch(err => console.error(err));
  }, []);

  // --- Save current design to backend ---
  const handleSaveToBackend = async () => {
    if (!canvasRef.current) return;

    const imageData = canvasRef.current.toDataURL('image/png');
    const payload: PookkalamDesign = {
      id: Date.now().toString(),
      name: designName,
      flowers: currentState.flowers,
      symmetryMode: currentState.symmetryMode,
      brushSize: currentState.brushSize,
      image: imageData,
      likes: 0,
      votes: 0,
      rating: 0,
    };

    try {
      const res = await api.post('/designs/', payload);
      setDesigns(prev => [...prev, res.data]);
      setShareModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Event Handlers ---
  const handleToolSelect = (tool: 'flower' | 'eraser' | 'move') =>
    updateState({ ...currentState, selectedTool: tool });

  const handleFlowerSelect = (flower: FlowerType) =>
    updateState({ ...currentState, selectedFlower: flower, selectedTool: 'flower' });

  const handleSymmetryChange = (mode: CanvasState['symmetryMode']) =>
    updateState({ ...currentState, symmetryMode: mode });

  const handleBrushSizeChange = (size: number) =>
    updateState({ ...currentState, brushSize: size });

  const handleGeneratePattern = () => {
    const newFlowers = generateRandomPattern(600, 600, 40);
    updateState({ ...currentState, flowers: newFlowers });
    saveState();
  };

  const handleClear = () => {
    updateState({ ...currentState, flowers: [] });
    saveState();
  };

  const handleShare = (platform: string) => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL('image/png');
    shareToSocialMedia(designName, imageData, platform as any);
    setShareModalOpen(false);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsImage(
      canvasRef.current,
      `${designName.toLowerCase().replace(/\s+/g, '-')}.png`
    );
    setShareModalOpen(false);
  };

  const handleDesignLike = async (id: string) => {
    try {
      await api.post(`/designs/${id}/like/`);
      setDesigns(prev =>
        prev.map(d => (d.id === id ? { ...d, likes: d.likes + 1 } : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDesignVote = async (id: string) => {
    try {
      await api.post(`/designs/${id}/vote/`);
      setDesigns(prev =>
        prev.map(d =>
          d.id === id
            ? { ...d, votes: d.votes + 1, rating: Math.min(5, d.rating + 0.1) }
            : d
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'design' as const, label: 'Designer', icon: Palette },
    { id: 'gallery' as const, label: 'Gallery', icon: GalleryIcon },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pookkalam Designer</h1>
                <p className="text-sm text-orange-600">Traditional Onam Flower Carpets</p>
              </div>
            </div>

            <nav className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <FlowerPalette
                flowers={TRADITIONAL_FLOWERS}
                selectedFlower={currentState.selectedFlower}
                onFlowerSelect={handleFlowerSelect}
              />
              <ToolBar
                selectedTool={currentState.selectedTool}
                onToolSelect={handleToolSelect}
                symmetryMode={currentState.symmetryMode}
                onSymmetryChange={handleSymmetryChange}
                brushSize={currentState.brushSize}
                onBrushSizeChange={handleBrushSizeChange}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onGeneratePattern={handleGeneratePattern}
                onSave={() => setShareModalOpen(true)}
                onShare={() => setShareModalOpen(true)}
                onClear={handleClear}
              />
            </div>

            <div className="lg:col-span-3">
              <input
                type="text"
                value={designName}
                onChange={e => setDesignName(e.target.value)}
                placeholder="Name your Pookkalam..."
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              <PookkalamCanvas
                ref={canvasRef}
                canvasState={currentState}
                onCanvasStateChange={updateState}
                onSaveState={saveState}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <Gallery designs={designs} onDesignLike={handleDesignLike} onDesignVote={handleDesignVote} />
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Pookkalam</h2>
            <p className="text-gray-600">
              Traditional Onam Flower Carpets created digitally for fun and learning.
            </p>
          </div>
        )}
      </main>

      
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        designName={designName}
        onShare={handleShare}
        onDownload={handleDownload}
        onSaveToBackend={handleSaveToBackend}
      />


      <footer className="bg-white border-t border-orange-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          <p>🌸 Happy Onam! Create beautiful Pookkalam designs 🌸</p>
        </div>
      </footer>
    </div>
  );
}

export default App;*/

/*import React, { useState, useRef, useEffect } from 'react';
import { Palette, GalleryVertical as GalleryIcon, Info } from 'lucide-react';
import { FlowerPalette } from './components/FlowerPalette';
import { ToolBar } from './components/ToolBar';
import { PookkalamCanvas } from './components/PookkalamCanvas';
import { Gallery } from './components/Gallery';
import { ShareModal } from './components/ShareModal';
import { useCanvasHistory } from './hooks/useCanvasHistory';
import { TRADITIONAL_FLOWERS } from './data/flowers';
import { generateRandomPattern } from './utils/patternGenerator';
import { shareToSocialMedia, downloadCanvasAsImage } from './utils/socialShare';
import { CanvasState, PookkalamDesign, FlowerType } from './types';
import api from './api'; // Axios instance

const INITIAL_STATE: CanvasState = {
  flowers: [],
  symmetryMode: 'none',
  selectedTool: 'flower',
  selectedFlower: TRADITIONAL_FLOWERS[0],
  brushSize: 20,
};

function App() {
  const [activeTab, setActiveTab] = useState<'design' | 'gallery' | 'about'>('design');
  const [designs, setDesigns] = useState<PookkalamDesign[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [designName, setDesignName] = useState('My Beautiful Pookkalam');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    currentState,
    updateState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasHistory(INITIAL_STATE);

  // --- Fetch designs from backend ---
  useEffect(() => {
    api.get('/designs/')
      .then(res => setDesigns(res.data))
      .catch(err => console.error(err));
  }, []);

  // --- Save current design to backend ---
  const handleSaveToBackend = async () => {
    if (!canvasRef.current) return;

    const imageData = canvasRef.current.toDataURL('image/png');
    const payload: PookkalamDesign = {
      id: Date.now().toString(),
      name: designName,
      flowers: currentState.flowers,
      symmetryMode: currentState.symmetryMode,
      brushSize: currentState.brushSize,
      image: imageData,
      likes: 0,
      votes: 0,
      rating: 0,
    };

    try {
      const res = await api.post('/designs', payload);
      setDesigns(prev => [...prev, res.data]); // <-- Gallery updates immediately
      setShareModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToolSelect = (tool: 'flower' | 'eraser' | 'move') =>
    updateState({ ...currentState, selectedTool: tool });

  const handleFlowerSelect = (flower: FlowerType) =>
    updateState({ ...currentState, selectedFlower: flower, selectedTool: 'flower' });

  const handleSymmetryChange = (mode: CanvasState['symmetryMode']) =>
    updateState({ ...currentState, symmetryMode: mode });

  const handleBrushSizeChange = (size: number) =>
    updateState({ ...currentState, brushSize: size });

  const handleGeneratePattern = () => {
    const newFlowers = generateRandomPattern(600, 600, 40);
    updateState({ ...currentState, flowers: newFlowers });
    saveState();
  };

  const handleClear = () => {
    updateState({ ...currentState, flowers: [] });
    saveState();
  };

  const handleShare = (platform: string) => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL('image/png');
    shareToSocialMedia(designName, imageData, platform as any);
    setShareModalOpen(false);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsImage(
      canvasRef.current,
      `${designName.toLowerCase().replace(/\s+/g, '-')}.png`
    );
    setShareModalOpen(false);
  };

  const handleDesignLike = async (id: string) => {
    try {
      await api.post(`/designs/${id}/like`);
      setDesigns(prev =>
        prev.map(d => (d.id === id ? { ...d, likes: d.likes + 1 } : d))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDesignVote = async (id: string) => {
    try {
      await api.post(`/designs/${id}/vote`);
      setDesigns(prev =>
        prev.map(d =>
          d.id === id
            ? { ...d, votes: d.votes + 1, rating: Math.min(5, d.rating + 0.1) }
            : d
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'design' as const, label: 'Designer', icon: Palette },
    { id: 'gallery' as const, label: 'Gallery', icon: GalleryIcon },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pookkalam Designer</h1>
                <p className="text-sm text-orange-600">Traditional Onam Flower Carpets</p>
              </div>
            </div>

            <nav className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <FlowerPalette
                flowers={TRADITIONAL_FLOWERS}
                selectedFlower={currentState.selectedFlower}
                onFlowerSelect={handleFlowerSelect}
              />
              <ToolBar
                selectedTool={currentState.selectedTool}
                onToolSelect={handleToolSelect}
                symmetryMode={currentState.symmetryMode}
                onSymmetryChange={handleSymmetryChange}
                brushSize={currentState.brushSize}
                onBrushSizeChange={handleBrushSizeChange}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onGeneratePattern={handleGeneratePattern}
                onSave={() => setShareModalOpen(true)}
                onShare={() => setShareModalOpen(true)}
                onClear={handleClear}
              />
            </div>

            <div className="lg:col-span-3">
              <input
                type="text"
                value={designName}
                onChange={e => setDesignName(e.target.value)}
                placeholder="Name your Pookkalam..."
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              <PookkalamCanvas
                ref={canvasRef} // ✅ Works with forwardRef
                canvasState={currentState}
                onCanvasStateChange={updateState}
                onSaveState={saveState}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <Gallery
            designs={designs}
            onDesignLike={handleDesignLike}
            onDesignVote={handleDesignVote}
          />
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Pookkalam</h2>
            <p className="text-gray-600">
              Traditional Onam Flower Carpets created digitally for fun and learning.
            </p>
          </div>
        )}
      </main>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        designName={designName}
        onShare={handleShare}
        onDownload={handleDownload}
        onSaveToBackend={handleSaveToBackend}
      />

      <footer className="bg-white border-t border-orange-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          <p>🌸 Happy Onam! Create beautiful Pookkalam designs 🌸</p>
        </div>
      </footer>
    </div>
  );
}

export default App;*/

/*import React, { useState, useRef, useEffect } from 'react';
import { Palette, GalleryVertical as GalleryIcon, Info } from 'lucide-react';
import { FlowerPalette } from './components/FlowerPalette';
import { ToolBar } from './components/ToolBar';
import { PookkalamCanvas } from './components/PookkalamCanvas';
import { Gallery } from './components/Gallery';
import { ShareModal } from './components/ShareModal';
import { useCanvasHistory } from './hooks/useCanvasHistory';
import { TRADITIONAL_FLOWERS } from './data/flowers';
import { generateRandomPattern } from './utils/patternGenerator';
import { shareToSocialMedia, downloadCanvasAsImage } from './utils/socialShare';
import { CanvasState, PookkalamDesign, FlowerType } from './types';
import api from './api';

const INITIAL_STATE: CanvasState = {
  flowers: [],
  symmetryMode: 'none',
  selectedTool: 'flower',
  selectedFlower: TRADITIONAL_FLOWERS[0],
  brushSize: 20,
};

function App() {
  const [activeTab, setActiveTab] = useState<'design' | 'gallery' | 'about'>('design');
  const [designs, setDesigns] = useState<PookkalamDesign[]>([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [designName, setDesignName] = useState('My Beautiful Pookkalam');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    currentState,
    updateState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasHistory(INITIAL_STATE);

  // --- Fetch designs from backend ---
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await api.get('/designs/');
        setDesigns(res.data);
      } catch (err) {
        console.error('Failed to fetch designs:', err);
      }
    };
    fetchDesigns();
  }, []);

  // --- Save current design to backend ---
  const handleSaveToBackend = async () => {
    if (!canvasRef.current) return;

    const imageData = canvasRef.current.toDataURL('image/png');
    const payload: Omit<PookkalamDesign, 'id'> = {
      name: designName,
      flowers: currentState.flowers,
      symmetryMode: currentState.symmetryMode,
      brushSize: currentState.brushSize,
      image: imageData,
      likes: 0,
      votes: 0,
      rating: 0,
    };

    try {
      const res = await api.post('/designs/', payload);
      setDesigns(prev => [...prev, res.data]);
      setShareModalOpen(false);
    } catch (err) {
      console.error('Failed to save design:', err);
    }
  };

  // --- Event Handlers ---
  const handleToolSelect = (tool: 'flower' | 'eraser' | 'move') =>
    updateState({ ...currentState, selectedTool: tool });

  const handleFlowerSelect = (flower: FlowerType) =>
    updateState({ ...currentState, selectedFlower: flower, selectedTool: 'flower' });

  const handleSymmetryChange = (mode: CanvasState['symmetryMode']) =>
    updateState({ ...currentState, symmetryMode: mode });

  const handleBrushSizeChange = (size: number) =>
    updateState({ ...currentState, brushSize: size });

  const handleGeneratePattern = () => {
    const newFlowers = generateRandomPattern(600, 600, 40);
    updateState({ ...currentState, flowers: newFlowers });
    saveState();
  };

  const handleClear = () => {
    updateState({ ...currentState, flowers: [] });
    saveState();
  };

  const handleShare = (platform: string) => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL('image/png');
    shareToSocialMedia(designName, imageData, platform as any);
    setShareModalOpen(false);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsImage(
      canvasRef.current,
      `${designName.toLowerCase().replace(/\s+/g, '-')}.png`
    );
    setShareModalOpen(false);
  };

  const handleDesignLike = async (id: string) => {
    try {
      const res = await api.post(`/designs/${id}/like/`);
      setDesigns(prev =>
        prev.map(d => (d.id === id ? { ...d, likes: res.data.likes } : d))
      );
    } catch (err) {
      console.error('Failed to like design:', err);
    }
  };

  const handleDesignVote = async (id: string) => {
    try {
      const res = await api.post(`/designs/${id}/vote/`);
      setDesigns(prev =>
        prev.map(d =>
          d.id === id ? { ...d, votes: res.data.votes, rating: res.data.rating } : d
        )
      );
    } catch (err) {
      console.error('Failed to vote design:', err);
    }
  };

  const tabs = [
    { id: 'design' as const, label: 'Designer', icon: Palette },
    { id: 'gallery' as const, label: 'Gallery', icon: GalleryIcon },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pookkalam Designer</h1>
                <p className="text-sm text-orange-600">Traditional Onam Flower Carpets</p>
              </div>
            </div>
            <nav className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <FlowerPalette
                flowers={TRADITIONAL_FLOWERS}
                selectedFlower={currentState.selectedFlower}
                onFlowerSelect={handleFlowerSelect}
              />
              <ToolBar
                selectedTool={currentState.selectedTool}
                onToolSelect={handleToolSelect}
                symmetryMode={currentState.symmetryMode}
                onSymmetryChange={handleSymmetryChange}
                brushSize={currentState.brushSize}
                onBrushSizeChange={handleBrushSizeChange}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onGeneratePattern={handleGeneratePattern}
                onSave={() => setShareModalOpen(true)}
                onShare={() => setShareModalOpen(true)}
                onClear={handleClear}
              />
            </div>
            <div className="lg:col-span-3">
              <input
                type="text"
                value={designName}
                onChange={e => setDesignName(e.target.value)}
                placeholder="Name your Pookkalam..."
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              <PookkalamCanvas
                ref={canvasRef}
                canvasState={currentState}
                onCanvasStateChange={updateState}
                onSaveState={saveState}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <Gallery
            designs={designs}
            onDesignLike={handleDesignLike}
            onDesignVote={handleDesignVote}
          />
        )}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Pookkalam</h2>
            <p className="text-gray-600">
              Traditional Onam Flower Carpets created digitally for fun and learning.
            </p>
          </div>
        )}
      </main>

     
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        designName={designName}
        onShare={handleShare}
        onDownload={handleDownload}
        onSaveToBackend={handleSaveToBackend}
      />

     
      <footer className="bg-white border-t border-orange-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          <p>🌸 Happy Onam! Create beautiful Pookkalam designs 🌸</p>
        </div>
      </footer>
    </div>
  );
}

export default App;*/

import React, { useState, useRef, useEffect } from 'react';
import { Palette, GalleryVertical as GalleryIcon, Info } from 'lucide-react';
import { FlowerPalette } from './components/FlowerPalette';
import { ToolBar } from './components/ToolBar';
import { PookkalamCanvas } from './components/PookkalamCanvas';
import { Gallery } from './components/Gallery';
import { useCanvasHistory } from './hooks/useCanvasHistory';
import { TRADITIONAL_FLOWERS } from './data/flowers';
import { generateRandomPattern } from './utils/patternGenerator';
import { shareToSocialMedia, downloadCanvasAsImage } from './utils/socialShare';
import { CanvasState, FlowerType } from './types';
import { getDesigns, saveDesign } from './api';

const INITIAL_STATE: CanvasState = {
  flowers: [],
  symmetryMode: 'none',
  selectedTool: 'flower',
  selectedFlower: TRADITIONAL_FLOWERS[0],
  brushSize: 20,
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'gallery' | 'about'>('design');
  const [designs, setDesigns] = useState<any[]>([]);
  const [designName, setDesignName] = useState('My Beautiful Pookkalam');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    currentState,
    updateState,
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useCanvasHistory(INITIAL_STATE);

  // Fetch designs from backend
  useEffect(() => {
    getDesigns()
      .then(res => setDesigns(res.data))
      .catch(err => console.error(err));
  }, []);

  // Save current design
  const handleSaveToBackend = async () => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL('image/png');
    const payload = {
      title: designName,
      flowers: currentState.flowers,
      image: imageData,
    };

    try {
      const res = await saveDesign(payload);
      setDesigns(prev => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    downloadCanvasAsImage(canvasRef.current, `${designName.toLowerCase().replace(/\s+/g, '-')}.png`);
  };

  const handleShare = (platform: string) => {
    if (!canvasRef.current) return;
    const imageData = canvasRef.current.toDataURL('image/png');
    shareToSocialMedia(designName, imageData, platform as any);
  };

  const handleToolSelect = (tool: 'flower' | 'eraser' | 'move') =>
    updateState({ ...currentState, selectedTool: tool });

  const handleFlowerSelect = (flower: FlowerType) =>
    updateState({ ...currentState, selectedFlower: flower, selectedTool: 'flower' });

  const handleSymmetryChange = (mode: 'none' | '2-fold' | '4-fold' | '8-fold') => {
  updateState({ ...currentState, symmetryMode: mode });
};


  const handleBrushSizeChange = (size: number) =>
    updateState({ ...currentState, brushSize: size });

  const handleGeneratePattern = () => {
    const newFlowers = generateRandomPattern(600, 600, 40);
    updateState({ ...currentState, flowers: newFlowers });
    saveState();
  };

  const handleClear = () => {
    updateState({ ...currentState, flowers: [] });
    saveState();
  };

  const tabs = [
    { id: 'design' as const, label: 'Designer', icon: Palette },
    { id: 'gallery' as const, label: 'Gallery', icon: GalleryIcon },
    { id: 'about' as const, label: 'About', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-50 to-yellow-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🌸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pookkalam Designer</h1>
                <p className="text-sm text-orange-600">Traditional Onam Flower Carpets</p>
              </div>
            </div>

            <nav className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'design' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <FlowerPalette
                flowers={TRADITIONAL_FLOWERS}
                selectedFlower={currentState.selectedFlower}
                onFlowerSelect={handleFlowerSelect}
              />
              <ToolBar
                selectedTool={currentState.selectedTool}
                onToolSelect={handleToolSelect}
                symmetryMode={currentState.symmetryMode}
                onSymmetryChange={handleSymmetryChange}
                brushSize={currentState.brushSize}
                onBrushSizeChange={handleBrushSizeChange}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onGeneratePattern={handleGeneratePattern}
                onClear={handleClear}
                onSave={handleSaveToBackend}
                onDownload={handleDownload}
                onShare={() => handleShare('facebook')} // example platform
              />
            </div>

            <div className="lg:col-span-3">
              <input
                type="text"
                value={designName}
                onChange={e => setDesignName(e.target.value)}
                placeholder="Name your Pookkalam..."
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              />
              <PookkalamCanvas
                ref={canvasRef}
                canvasState={currentState}
                onCanvasStateChange={updateState}
                onSaveState={saveState}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </div>
        )}

        {activeTab === 'gallery' && <Gallery designs={designs} />}

        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Pookkalam</h2>
            <p className="text-gray-600">Pookalam is a traditional floral artwork, or rangoli, created during the Onam festival in Kerala to welcome the spirit of the mythical King Mahabali. The word "Pookalam" combines "Poo" (flower) and "Kolam" (design). Keralites create Pookalams on the ground, often in a circular shape, using various fresh flowers, with the designs growing in size and complexity over the ten days of the festival, which culminates in the grandest designs on the final day of Thiruvonam.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-orange-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600">
          <p>🌸 Happy Onam! Create beautiful Pookkalam designs 🌸</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
