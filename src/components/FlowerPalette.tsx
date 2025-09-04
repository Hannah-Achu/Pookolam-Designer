/*import React from 'react';
import { FlowerType } from '../types';

interface FlowerPaletteProps {
  flowers: FlowerType[];
  selectedFlower: FlowerType | null;
  onFlowerSelect: (flower: FlowerType) => void;
}

export const FlowerPalette: React.FC<FlowerPaletteProps> = ({
  flowers,
  selectedFlower,
  onFlowerSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Traditional Flowers</h3>
      <div className="grid grid-cols-4 gap-2">
        {flowers.map((flower) => (
          <button
            key={flower.id}
            onClick={() => onFlowerSelect(flower)}
            className={`
              group relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
              ${
                selectedFlower?.id === flower.id
                  ? 'border-orange-400 bg-orange-50 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
              }
            `}
          >
            <div 
              className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-lg"
              style={{ backgroundColor: flower.color + '20', color: flower.color }}
            >
              {flower.emoji}
            </div>
            <p className="text-xs font-medium text-gray-700 text-center truncate">
              {flower.name}
            </p>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-orange-100/50 to-transparent"></div>
          </button>
        ))}
      </div>
    </div>
  );
};*/

import React from 'react';
import { FlowerType } from '../types';

interface FlowerPaletteProps {
  flowers: FlowerType[];
  selectedFlower: FlowerType | null;
  onFlowerSelect: (flower: FlowerType) => void;
}

export const FlowerPalette: React.FC<FlowerPaletteProps> = ({
  flowers,
  selectedFlower,
  onFlowerSelect,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Traditional Flowers</h3>
      <div className="grid grid-cols-4 gap-2">
        {flowers.map((flower) => (
          <button
            key={flower.id} // <- make sure FlowerType has an 'id' property
            onClick={() => onFlowerSelect(flower)}
            className={`
              group relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105
              ${
                selectedFlower?.id === flower.id
                  ? 'border-orange-400 bg-orange-50 shadow-lg'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
              }
            `}
          >
            <div 
              className="w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-lg"
              style={{ backgroundColor: flower.color + '20', color: flower.color }}
            >
              {flower.emoji}
            </div>
            <p className="text-xs font-medium text-gray-700 text-center truncate">
              {flower.name}
            </p>
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-t from-orange-100/50 to-transparent"></div>
          </button>
        ))}
      </div>
    </div>
  );
};
