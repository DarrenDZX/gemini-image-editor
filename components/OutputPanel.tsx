
import React from 'react';
import Icon from './Icon';

interface OutputPanelProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ generatedImage, isLoading, error }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 flex flex-col gap-4 h-full sticky top-28">
       <h2 className="text-xl font-bold text-center text-gray-300">Generated Result</h2>
      <div className="relative aspect-square w-full bg-gray-900/50 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center">
        {isLoading && (
          <div className="flex flex-col items-center text-gray-400 animate-pulse">
            <Icon name="loader" className="w-16 h-16 animate-spin text-indigo-400" />
            <p className="mt-4 text-lg">Generating your masterpiece...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="text-center text-red-400 p-4">
            <Icon name="error" className="w-16 h-16 mx-auto mb-2" />
            <p className="font-semibold">An Error Occurred</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        {!isLoading && !error && generatedImage && (
          <img
            src={generatedImage}
            alt="Generated"
            className="w-full h-full object-contain"
          />
        )}
        {!isLoading && !error && !generatedImage && (
          <div className="text-center text-gray-500 p-4">
             <Icon name="image" className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p className="font-semibold">Your generated image will appear here.</p>
            <p className="text-sm mt-1">Click "Generate" to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
