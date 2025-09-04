/*import React, { useState } from 'react';
import { Heart, ThumbsUp, Trophy, Eye, Calendar } from 'lucide-react';
import { PookkalamDesign } from '../types';

interface GalleryProps {
  designs: PookkalamDesign[];
  onDesignLike: (id: string) => void;
  onDesignVote: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({
  designs,
  onDesignLike,
  onDesignVote,
}) => {
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'top-rated'>('popular');
  const [selectedDesign, setSelectedDesign] = useState<PookkalamDesign | null>(null);

  const sortedDesigns = React.useMemo(() => {
    const sorted = [...designs];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'popular':
        return sorted.sort((a, b) => b.likes - a.likes);
      case 'top-rated':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [designs, sortBy]);

  const topDesigns = sortedDesigns.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Community Gallery</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="popular">Most Popular</option>
          <option value="recent">Most Recent</option>
          <option value="top-rated">Top Rated</option>
        </select>
      </div>

      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Trophy className="mr-2 text-yellow-500" size={20} />
          Top Designs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topDesigns.map((design, index) => (
            <div
              key={design.id}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 cursor-pointer
                ${index === 0 ? 'border-yellow-400 bg-yellow-50' :
                  index === 1 ? 'border-gray-400 bg-gray-50' :
                  'border-orange-400 bg-orange-50'}
              `}
              onClick={() => setSelectedDesign(design)}
            >
              <div className={`
                absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                ${index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-500' :
                  'bg-orange-500'}
              `}>
                {index + 1}
              </div>
              
              <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-4xl">🌸</span>
              </div>
              
              <h4 className="font-semibold text-gray-800 truncate">{design.name}</h4>
              <p className="text-sm text-gray-600 mb-2">by {design.author}</p>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center text-red-500">
                    <Heart size={14} className="mr-1" />
                    {design.likes}
                  </span>
                  <span className="flex items-center text-blue-500">
                    <ThumbsUp size={14} className="mr-1" />
                    {design.votes}
                  </span>
                </div>
                <div className="text-yellow-500 font-semibold">
                  ★ {design.rating.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Designs</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedDesigns.map((design) => (
            <div
              key={design.id}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
              onClick={() => setSelectedDesign(design)}
            >
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
              
              <div className="p-3">
                <h4 className="font-medium text-gray-800 text-sm truncate">{design.name}</h4>
                <p className="text-xs text-gray-500 mb-2">by {design.author}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDesignLike(design.id);
                      }}
                      className="flex items-center text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Heart size={12} className="mr-1" />
                      {design.likes}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDesignVote(design.id);
                      }}
                      className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <ThumbsUp size={12} className="mr-1" />
                      {design.votes}
                    </button>
                  </div>
                  <span className="text-yellow-500 text-xs font-semibold">
                    ★ {design.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>


      {selectedDesign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{selectedDesign.name}</h3>
                <button
                  onClick={() => setSelectedDesign(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="aspect-square bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-6xl">🌸</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Created by</span>
                  <span className="font-semibold">{selectedDesign.author}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {selectedDesign.createdAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="text-yellow-500 font-semibold">
                    ★ {selectedDesign.rating.toFixed(1)} ({selectedDesign.votes} votes)
                  </span>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => onDesignLike(selectedDesign.id)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    <Heart size={16} />
                    <span>Like ({selectedDesign.likes})</span>
                  </button>
                  
                  <button
                    onClick={() => onDesignVote(selectedDesign.id)}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <ThumbsUp size={16} />
                    <span>Vote ({selectedDesign.votes})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};*/

// src/components/Gallery.tsx
import React from 'react';
import { PookkalamDesign } from '../types';

interface GalleryProps {
  designs: PookkalamDesign[];
  onDesignLike?: (id: string) => void;
  onDesignVote?: (id: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ designs, onDesignLike, onDesignVote }) => {
  if (!designs.length) {
    return <p className="text-center text-gray-500">No designs available yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => {
        // Ensure ID is a string
        const designId = design.id?.toString() || '0';
        return (
          <div key={designId} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {design.image && (
              <img
                src={design.image}
                alt={design.title || 'Pookkalam Design'}
                className="w-full h-56 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{design.title || 'Untitled'}</h3>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <button
                  onClick={() => onDesignLike && onDesignLike(designId)}
                  className="hover:text-red-500"
                >
                  ❤️ {design.likes || 0}
                </button>
                <button
                  onClick={() => onDesignVote && onDesignVote(designId)}
                  className="hover:text-green-500"
                >
                  ⭐ {design.rating?.toFixed(1) || 0}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
