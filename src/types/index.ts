/*export interface FlowerType {
  id: string;
  name: string;
  color: string;
  petals: number;
  size: number;
  emoji: string;
}

export interface DrawnFlower {
  id: string;
  type: FlowerType;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}

export type SymmetryMode = 'none' | '2-fold' | '4-fold' | '8-fold' | 'radial';

export interface CanvasState {
  flowers: DrawnFlower[];
  symmetryMode: 'none' | '2-fold' | '4-fold' | '8-fold' | '16-fold'; // <- include all used
  selectedTool: 'flower' | 'eraser' | 'move';
  selectedFlower: FlowerType;
  brushSize: number;
}




export interface PookkalamDesign {
  id: string;
  name: string;
  author: string;
  flowers: DrawnFlower[];
  likes: number;
  votes: number;
  rating: number;
  createdAt: Date;
  imageData?: string;
}

export interface CanvasHistory {
  states: CanvasState[];
  currentIndex: number;
}*/

// types.ts

// Single flower type in palette
export type SymmetryMode = 'none' | '2-fold' | '4-fold' | '8-fold';

export interface FlowerType {
  id: string;
  name: string;
  emoji: string;
  color: string;
  petals: number;
  size: number;
}

export interface DrawnFlower {
  id: string;
  type: FlowerType;
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
}

export interface CanvasState {
  flowers: DrawnFlower[];
  symmetryMode: SymmetryMode;
  selectedTool: 'flower' | 'eraser' | 'move';
  selectedFlower: FlowerType | null;
  brushSize: number;
}
export interface CanvasHistory {
  states: CanvasState[];
  currentIndex: number;
}

export interface PookkalamDesign {
  id: string | number;
  title?: string;
  flowers: DrawnFlower[];
  image?: string;
  likes?: number;
  rating?: number;
}
