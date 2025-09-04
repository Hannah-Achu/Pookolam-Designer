/*import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { DrawnFlower, FlowerType, CanvasState } from '../types';

interface PookkalamCanvasProps {
  canvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
  onSaveState: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const PookkalamCanvas: React.FC<PookkalamCanvasProps> = ({
  canvasState,
  onCanvasStateChange,
  onSaveState,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [draggedFlower, setDraggedFlower] = useState<DrawnFlower | null>(null);

  const drawFlower = useCallback((ctx: CanvasRenderingContext2D, flower: DrawnFlower) => {
    ctx.save();
    ctx.translate(flower.x, flower.y);
    ctx.rotate(flower.rotation);
    ctx.scale(flower.scale, flower.scale);

    // Draw flower petals
    const petalCount = flower.type.petals;
    const petalLength = flower.type.size;
    
    ctx.fillStyle = flower.type.color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < petalCount; i++) {
      ctx.save();
      ctx.rotate((2 * Math.PI * i) / petalCount);
      
      // Draw petal
      ctx.beginPath();
      ctx.ellipse(0, -petalLength / 2, petalLength / 4, petalLength / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Draw center
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(0, 0, petalLength / 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }, []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background pattern
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw traditional rangoli circles
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 8; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, i * 40, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw symmetry guides
    if (canvasState.symmetryMode !== 'none') {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 0.5;
      
      const lines = canvasState.symmetryMode === '2-fold' ? 2 : 
                   canvasState.symmetryMode === '4-fold' ? 4 : 
                   canvasState.symmetryMode === '8-fold' ? 8 : 16;
      
      for (let i = 0; i < lines; i++) {
        const angle = (2 * Math.PI * i) / lines;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle) * canvas.width,
          centerY + Math.sin(angle) * canvas.height
        );
        ctx.stroke();
      }
    }

    // Draw flowers
    canvasState.flowers.forEach(flower => {
      drawFlower(ctx, flower);
    });
  }, [canvasState, drawFlower]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const createSymmetricFlowers = (x: number, y: number, flower: FlowerType): DrawnFlower[] => {
    const canvas = canvasRef.current;
    if (!canvas) return [];

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const flowers: DrawnFlower[] = [];

    if (canvasState.symmetryMode === 'none') {
      flowers.push({
        id: Date.now().toString() + Math.random(),
        type: flower,
        x,
        y,
        rotation: Math.random() * 2 * Math.PI,
        scale: 0.8 + Math.random() * 0.4,
      });
    } else {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const baseAngle = Math.atan2(dy, dx);

      const symmetryCount = canvasState.symmetryMode === '2-fold' ? 2 : 
                           canvasState.symmetryMode === '4-fold' ? 4 : 
                           canvasState.symmetryMode === '8-fold' ? 8 : 16;

      for (let i = 0; i < symmetryCount; i++) {
        const angle = baseAngle + (2 * Math.PI * i) / symmetryCount;
        const newX = centerX + Math.cos(angle) * distance;
        const newY = centerY + Math.sin(angle) * distance;

        flowers.push({
          id: Date.now().toString() + Math.random() + i,
          type: flower,
          x: newX,
          y: newY,
          rotation: angle + Math.PI / 2,
          scale: 0.8 + Math.random() * 0.4,
        });
      }
    }

    return flowers;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    
    if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
      setIsDrawing(true);
      const newFlowers = createSymmetricFlowers(pos.x, pos.y, canvasState.selectedFlower);
      onCanvasStateChange({
        ...canvasState,
        flowers: [...canvasState.flowers, ...newFlowers],
      });
      onSaveState();
    } else if (canvasState.selectedTool === 'eraser') {
      setIsDrawing(true);
      const remainingFlowers = canvasState.flowers.filter(flower => {
        const distance = Math.sqrt(
          Math.pow(flower.x - pos.x, 2) + Math.pow(flower.y - pos.y, 2)
        );
        return distance > canvasState.brushSize;
      });
      
      if (remainingFlowers.length !== canvasState.flowers.length) {
        onCanvasStateChange({
          ...canvasState,
          flowers: remainingFlowers,
        });
        onSaveState();
      }
    } else if (canvasState.selectedTool === 'move') {
      const clickedFlower = canvasState.flowers.find(flower => {
        const distance = Math.sqrt(
          Math.pow(flower.x - pos.x, 2) + Math.pow(flower.y - pos.y, 2)
        );
        return distance <= flower.type.size;
      });
      
      if (clickedFlower) {
        setDraggedFlower(clickedFlower);
        setIsDrawing(true);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    
    if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
      const newFlowers = createSymmetricFlowers(pos.x, pos.y, canvasState.selectedFlower);
      onCanvasStateChange({
        ...canvasState,
        flowers: [...canvasState.flowers, ...newFlowers],
      });
    } else if (canvasState.selectedTool === 'eraser') {
      const remainingFlowers = canvasState.flowers.filter(flower => {
        const distance = Math.sqrt(
          Math.pow(flower.x - pos.x, 2) + Math.pow(flower.y - pos.y, 2)
        );
        return distance > canvasState.brushSize;
      });
      
      if (remainingFlowers.length !== canvasState.flowers.length) {
        onCanvasStateChange({
          ...canvasState,
          flowers: remainingFlowers,
        });
      }
    } else if (canvasState.selectedTool === 'move' && draggedFlower) {
      const updatedFlowers = canvasState.flowers.map(flower =>
        flower.id === draggedFlower.id
          ? { ...flower, x: pos.x, y: pos.y }
          : flower
      );
      
      onCanvasStateChange({
        ...canvasState,
        flowers: updatedFlowers,
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && (canvasState.selectedTool === 'move' || canvasState.selectedTool === 'eraser')) {
      onSaveState();
    }
    setIsDrawing(false);
    setDraggedFlower(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Pookkalam Designer</h2>
        <div className="flex space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Undo"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Redo"
          >
            <RotateCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="border-2 border-orange-200 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="block cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <span>Selected: {canvasState.selectedTool} | Symmetry: {canvasState.symmetryMode}</span>
        <span>{canvasState.flowers.length} flowers placed</span>
      </div>
    </div>
  );
};
import React, { useRef, useEffect, useState, useCallback, forwardRef, ForwardedRef } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { DrawnFlower, FlowerType, CanvasState } from '../types';

interface PookkalamCanvasProps {
  canvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
  onSaveState: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const PookkalamCanvas = forwardRef<HTMLCanvasElement, PookkalamCanvasProps>(
  (
    { canvasState, onCanvasStateChange, onSaveState, onUndo, onRedo, canUndo, canRedo },
    ref: ForwardedRef<HTMLCanvasElement>
  ) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = (ref as React.MutableRefObject<HTMLCanvasElement | null>) || internalRef;

    const [isDrawing, setIsDrawing] = useState(false);
    const [draggedFlower, setDraggedFlower] = useState<DrawnFlower | null>(null);

    const drawFlower = useCallback((ctx: CanvasRenderingContext2D, flower: DrawnFlower) => {
      ctx.save();
      ctx.translate(flower.x, flower.y);
      ctx.rotate(flower.rotation);
      ctx.scale(flower.scale, flower.scale);

      const petalCount = flower.type.petals;
      const petalLength = flower.type.size;

      ctx.fillStyle = flower.type.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < petalCount; i++) {
        ctx.save();
        ctx.rotate((2 * Math.PI * i) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, -petalLength / 2, petalLength / 4, petalLength / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(0, 0, petalLength / 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }, []);

    const drawCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw background circles
      ctx.strokeStyle = '#F3F4F6';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 8; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, i * 40, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Symmetry guides
      if (canvasState.symmetryMode !== 'none') {
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 0.5;
        const lines =
          canvasState.symmetryMode === '2-fold'
            ? 2
            : canvasState.symmetryMode === '4-fold'
            ? 4
            : canvasState.symmetryMode === '8-fold'
            ? 8
            : 16;

        for (let i = 0; i < lines; i++) {
          const angle = (2 * Math.PI * i) / lines;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + Math.cos(angle) * canvas.width, centerY + Math.sin(angle) * canvas.height);
          ctx.stroke();
        }
      }

      // Draw flowers
      canvasState.flowers.forEach(flower => drawFlower(ctx, flower));
    }, [canvasState, drawFlower, canvasRef]);

    useEffect(() => {
      drawCanvas();
    }, [drawCanvas]);

    const getMousePos = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const createSymmetricFlowers = (x: number, y: number, flower: FlowerType): DrawnFlower[] => {
      const canvas = canvasRef.current;
      if (!canvas) return [];

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const flowers: DrawnFlower[] = [];

      if (canvasState.symmetryMode === 'none') {
        flowers.push({
          id: Date.now().toString() + Math.random(),
          type: flower,
          x,
          y,
          rotation: Math.random() * 2 * Math.PI,
          scale: 0.8 + Math.random() * 0.4,
        });
      } else {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const baseAngle = Math.atan2(dy, dx);
        const symmetryCount =
          canvasState.symmetryMode === '2-fold'
            ? 2
            : canvasState.symmetryMode === '4-fold'
            ? 4
            : canvasState.symmetryMode === '8-fold'
            ? 8
            : 16;

        for (let i = 0; i < symmetryCount; i++) {
          const angle = baseAngle + (2 * Math.PI * i) / symmetryCount;
          flowers.push({
            id: Date.now().toString() + Math.random() + i,
            type: flower,
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            rotation: angle + Math.PI / 2,
            scale: 0.8 + Math.random() * 0.4,
          });
        }
      }

      return flowers;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      const pos = getMousePos(e);

      if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
        setIsDrawing(true);
        const newFlowers = createSymmetricFlowers(pos.x, pos.y, canvasState.selectedFlower);
        onCanvasStateChange({ ...canvasState, flowers: [...canvasState.flowers, ...newFlowers] });
        onSaveState();
      } else if (canvasState.selectedTool === 'eraser') {
        setIsDrawing(true);
        const remainingFlowers = canvasState.flowers.filter(
          flower => Math.hypot(flower.x - pos.x, flower.y - pos.y) > canvasState.brushSize
        );
        if (remainingFlowers.length !== canvasState.flowers.length) {
          onCanvasStateChange({ ...canvasState, flowers: remainingFlowers });
          onSaveState();
        }
      } else if (canvasState.selectedTool === 'move') {
        const clickedFlower = canvasState.flowers.find(
          flower => Math.hypot(flower.x - pos.x, flower.y - pos.y) <= flower.type.size
        );
        if (clickedFlower) {
          setDraggedFlower(clickedFlower);
          setIsDrawing(true);
        }
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDrawing) return;
      const pos = getMousePos(e);

      if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
        const newFlowers = createSymmetricFlowers(pos.x, pos.y, canvasState.selectedFlower);
        onCanvasStateChange({ ...canvasState, flowers: [...canvasState.flowers, ...newFlowers] });
      } else if (canvasState.selectedTool === 'eraser') {
        const remainingFlowers = canvasState.flowers.filter(
          flower => Math.hypot(flower.x - pos.x, flower.y - pos.y) > canvasState.brushSize
        );
        if (remainingFlowers.length !== canvasState.flowers.length) {
          onCanvasStateChange({ ...canvasState, flowers: remainingFlowers });
        }
      } else if (canvasState.selectedTool === 'move' && draggedFlower) {
        const updatedFlowers = canvasState.flowers.map(flower =>
          flower.id === draggedFlower.id ? { ...flower, x: pos.x, y: pos.y } : flower
        );
        onCanvasStateChange({ ...canvasState, flowers: updatedFlowers });
      }
    };

    const handleMouseUp = () => {
      if (isDrawing && (canvasState.selectedTool === 'move' || canvasState.selectedTool === 'eraser')) {
        onSaveState();
      }
      setIsDrawing(false);
      setDraggedFlower(null);
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="block cursor-crosshair border-2 border-orange-200 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    );
  }
);

PookkalamCanvas.displayName = 'PookkalamCanvas';*/

/*import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import { RotateCcw, RotateCw } from 'lucide-react';
import { CanvasState, FlowerType, DrawnFlower } from '../types';

interface PookkalamCanvasProps {
  canvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
  onSaveState: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const PookkalamCanvas = forwardRef<HTMLCanvasElement, PookkalamCanvasProps>(
  ({ canvasState, onCanvasStateChange, onSaveState, onUndo, onRedo, canUndo, canRedo }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const combinedRef = (ref as React.RefObject<HTMLCanvasElement>) || canvasRef;

    const [isDrawing, setIsDrawing] = useState(false);
    const [draggedFlower, setDraggedFlower] = useState<DrawnFlower | null>(null);

    const drawFlower = useCallback((ctx: CanvasRenderingContext2D, flower: DrawnFlower) => {
      ctx.save();
      ctx.translate(flower.x, flower.y);
      ctx.rotate(flower.rotation);
      ctx.scale(flower.scale, flower.scale);

      const petalCount = flower.type.petals;
      const petalLength = flower.type.size;

      ctx.fillStyle = flower.type.color;
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 0.5;

      for (let i = 0; i < petalCount; i++) {
        ctx.save();
        ctx.rotate((2 * Math.PI * i) / petalCount);
        ctx.beginPath();
        ctx.ellipse(0, -petalLength / 2, petalLength / 4, petalLength / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Center
      ctx.fillStyle = '#FCD34D';
      ctx.beginPath();
      ctx.arc(0, 0, petalLength / 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }, []);

    const drawCanvas = useCallback(() => {
      const canvas = combinedRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Background circles
      ctx.strokeStyle = '#F3F4F6';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 8; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, i * 40, 0, 2 * Math.PI);
        ctx.stroke();
      }

      // Symmetry guides
      if (canvasState.symmetryMode !== 'none') {
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 0.5;
        const lines =
          canvasState.symmetryMode === '2-fold'
            ? 2
            : canvasState.symmetryMode === '4-fold'
            ? 4
            : canvasState.symmetryMode === '8-fold'
            ? 8
            : 16;

        for (let i = 0; i < lines; i++) {
          const angle = (2 * Math.PI * i) / lines;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + Math.cos(angle) * canvas.width, centerY + Math.sin(angle) * canvas.height);
          ctx.stroke();
        }
      }

      // Draw flowers
      canvasState.flowers.forEach(flower => drawFlower(ctx, flower));
    }, [canvasState, drawFlower, combinedRef]);

    useEffect(() => {
      drawCanvas();
    }, [drawCanvas]);

    const getMousePos = (e: React.MouseEvent) => {
      const canvas = combinedRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const createSymmetricFlowers = (x: number, y: number, flower: FlowerType): DrawnFlower[] => {
      const canvas = combinedRef.current;
      if (!canvas) return [];

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const flowers: DrawnFlower[] = [];

      if (canvasState.symmetryMode === 'none') {
        flowers.push({
          id: Date.now().toString() + Math.random(),
          type: flower,
          x,
          y,
          rotation: Math.random() * 2 * Math.PI,
          scale: 0.8 + Math.random() * 0.4,
        });
      } else {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const baseAngle = Math.atan2(dy, dx);

        const symmetryCount =
          canvasState.symmetryMode === '2-fold'
            ? 2
            : canvasState.symmetryMode === '4-fold'
            ? 4
            : canvasState.symmetryMode === '8-fold'
            ? 8
            : 16;

        for (let i = 0; i < symmetryCount; i++) {
          const angle = baseAngle + (2 * Math.PI * i) / symmetryCount;
          flowers.push({
            id: Date.now().toString() + Math.random() + i,
            type: flower,
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
            rotation: angle + Math.PI / 2,
            scale: 0.8 + Math.random() * 0.4,
          });
        }
      }

      return flowers;
    };

    const handleMouseDown = (e: React.MouseEvent) => {
      const pos = getMousePos(e);
      if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
        setIsDrawing(true);
        const newFlowers = createSymmetricFlowers(pos.x, pos.y, canvasState.selectedFlower);
        onCanvasStateChange({ ...canvasState, flowers: [...canvasState.flowers, ...newFlowers] });
        onSaveState();
      }
      // eraser and move can be handled similarly
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDrawing) return;
      const pos = getMousePos(e);
      if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
        const newFlowers = createSymmetricFlowers(pos.x, pos.y, canvasState.selectedFlower);
        onCanvasStateChange({ ...canvasState, flowers: [...canvasState.flowers, ...newFlowers] });
      }
    };

    const handleMouseUp = () => {
      setIsDrawing(false);
      setDraggedFlower(null);
    };

    return (
      <div className="border-2 border-orange-200 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50">
        <canvas
          ref={combinedRef}
          width={600}
          height={600}
          className="block cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    );
  }
);

PookkalamCanvas.displayName = 'PookkalamCanvas';*/

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { CanvasState, DrawnFlower, FlowerType } from '../types';

interface PookkalamCanvasProps {
  canvasState: CanvasState;
  onCanvasStateChange: (state: CanvasState) => void;
  onSaveState: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const PookkalamCanvas = forwardRef<HTMLCanvasElement, PookkalamCanvasProps>(({
  canvasState,
  onCanvasStateChange,
  onSaveState
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => canvasRef.current!);

  const [isDrawing, setIsDrawing] = useState(false);
  const [draggedFlower, setDraggedFlower] = useState<DrawnFlower | null>(null);

  // Draw single flower
  const drawFlower = useCallback((ctx: CanvasRenderingContext2D, flower: DrawnFlower) => {
    ctx.save();
    ctx.translate(flower.x, flower.y);
    ctx.rotate(flower.rotation || 0);
    ctx.scale(flower.scale || 1, flower.scale || 1);

    const petalCount = flower.type.petals;
    const petalLength = flower.type.size;
    ctx.fillStyle = flower.type.color;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 0.5;

    for (let i = 0; i < petalCount; i++) {
      ctx.save();
      ctx.rotate((2 * Math.PI * i) / petalCount);
      ctx.beginPath();
      ctx.ellipse(0, -petalLength / 2, petalLength / 4, petalLength / 2, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // center
    ctx.fillStyle = '#FCD34D';
    ctx.beginPath();
    ctx.arc(0, 0, petalLength / 6, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }, []);

  // Draw all flowers & symmetry guides
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // symmetry guides
    if (canvasState.symmetryMode !== 'none') {
      ctx.strokeStyle = '#E5E7EB';
      ctx.lineWidth = 0.5;
      const lines = canvasState.symmetryMode === '2-fold' ? 2 :
                    canvasState.symmetryMode === '4-fold' ? 4 :
                    canvasState.symmetryMode === '8-fold' ? 8 : 16;
      for (let i = 0; i < lines; i++) {
        const angle = (2 * Math.PI * i) / lines;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * canvas.width, centerY + Math.sin(angle) * canvas.height);
        ctx.stroke();
      }
    }

    // draw flowers
    canvasState.flowers.forEach(f => drawFlower(ctx, f));
  }, [canvasState, drawFlower]);

  useEffect(() => { drawCanvas(); }, [drawCanvas]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const createFlower = (x: number, y: number, flower: FlowerType): DrawnFlower[] => {
    const canvas = canvasRef.current;
    if (!canvas) return [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const flowers: DrawnFlower[] = [];

    const symmetryCount = canvasState.symmetryMode === '2-fold' ? 2 :
                          canvasState.symmetryMode === '4-fold' ? 4 :
                          canvasState.symmetryMode === '8-fold' ? 8 : 1;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);

    for (let i = 0; i < symmetryCount; i++) {
      const angle = baseAngle + (2 * Math.PI * i) / symmetryCount;
      flowers.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2,5),
        type: flower,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        rotation: angle + Math.PI/2,
        scale: 0.8 + Math.random()*0.4,
      });
    }

    return flowers;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
      setIsDrawing(true);
      const newFlowers = createFlower(pos.x, pos.y, canvasState.selectedFlower);
      onCanvasStateChange({ ...canvasState, flowers: [...canvasState.flowers, ...newFlowers] });
      onSaveState();
    } else if (canvasState.selectedTool === 'eraser') {
      setIsDrawing(true);
      const remainingFlowers = canvasState.flowers.filter(f => Math.hypot(f.x - pos.x, f.y - pos.y) > canvasState.brushSize);
      onCanvasStateChange({ ...canvasState, flowers: remainingFlowers });
      onSaveState();
    } else if (canvasState.selectedTool === 'move') {
      const clickedFlower = canvasState.flowers.find(f => Math.hypot(f.x - pos.x, f.y - pos.y) <= f.type.size);
      if (clickedFlower) { setDraggedFlower(clickedFlower); setIsDrawing(true); }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);

    if (canvasState.selectedTool === 'flower' && canvasState.selectedFlower) {
      const newFlowers = createFlower(pos.x, pos.y, canvasState.selectedFlower);
      onCanvasStateChange({ ...canvasState, flowers: [...canvasState.flowers, ...newFlowers] });
    } else if (canvasState.selectedTool === 'eraser') {
      const remainingFlowers = canvasState.flowers.filter(f => Math.hypot(f.x - pos.x, f.y - pos.y) > canvasState.brushSize);
      onCanvasStateChange({ ...canvasState, flowers: remainingFlowers });
    } else if (canvasState.selectedTool === 'move' && draggedFlower) {
      const updatedFlowers = canvasState.flowers.map(f => f.id === draggedFlower.id ? { ...f, x: pos.x, y: pos.y } : f);
      onCanvasStateChange({ ...canvasState, flowers: updatedFlowers });
    }
  };

  const handleMouseUp = () => { setIsDrawing(false); setDraggedFlower(null); onSaveState(); };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="block cursor-crosshair rounded-lg shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
});
