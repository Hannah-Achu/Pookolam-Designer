/*import React, { useState } from 'react';
import { X, Twitter, Facebook, MessageCircle, Download, Copy } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  designName: string;
  onShare: (platform: string) => void;
  onDownload: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  designName,
  onShare,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareOptions = [
    { id: 'twitter', label: 'Twitter', icon: Twitter, color: 'bg-blue-400 hover:bg-blue-500' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500 hover:bg-green-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Share Your Pookkalam</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-lg font-semibold text-orange-800">"{designName}"</p>
            <p className="text-sm text-orange-600">Ready to share your beautiful creation!</p>
          </div>

         
          <div className="grid grid-cols-1 gap-3">
            {shareOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => onShare(option.id)}
                className={`
                  flex items-center justify-center space-x-3 py-3 px-4 rounded-lg text-white transition-all duration-200 hover:scale-105 ${option.color}
                `}
              >
                <option.icon size={20} />
                <span>Share on {option.label}</span>
              </button>
            ))}
          </div>

          
          <div className="border-t pt-4 space-y-2">
            <button
              onClick={onDownload}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Download size={16} />
              <span>Download as Image</span>
            </button>
            
            <button
              onClick={handleCopyLink}
              className={`
                w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105
                ${copied ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
              `}
            >
              <Copy size={16} />
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};*/

/*import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  designName: string;
  onShare: (platform: string) => void;
  onDownload: () => void;
  onSaveToBackend: () => void; // New prop for backend save
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  designName,
  onShare,
  onDownload,
  onSaveToBackend,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Save & Share</h2>
        <p className="mb-4">Design: <strong>{designName}</strong></p>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => onShare('facebook')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Share to Facebook
          </button>
          <button
            onClick={() => onShare('twitter')}
            className="w-full bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition"
          >
            Share to Twitter
          </button>
          <button
            onClick={onDownload}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Download PNG
          </button>
          <button
            onClick={onSaveToBackend}
            className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
          >
            Save to Gallery
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-2 border rounded text-gray-600 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};*/

import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  designName: string;
  onSaveToBackend: () => void;
  onShare: (platform: string) => void;
  onDownload: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  designName,
  onSaveToBackend,
  onShare,
  onDownload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 space-y-4">
        <h2 className="text-xl font-bold">Save & Share</h2>
        <p className="text-gray-600">Design: <strong>{designName}</strong></p>

        <div className="flex flex-col space-y-2">
          <button
            onClick={onSaveToBackend}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Save to Gallery
          </button>

          <button
            onClick={() => onShare('facebook')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Share on Facebook
          </button>

          <button
            onClick={() => onShare('twitter')}
            className="w-full px-4 py-2 bg-sky-400 text-white rounded hover:bg-sky-500 transition"
          >
            Share on Twitter
          </button>

          <button
            onClick={onDownload}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Download Image
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

