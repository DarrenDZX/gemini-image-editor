
import React, { useRef } from 'react';
import Icon from './Icon';
import type { ImageFile } from '../types';

interface InputPanelProps {
  originalImage: ImageFile | null;
  onImageUpload: (file: File) => void;
  onAnalyzeAndGenerate: () => void;
  isAnalyzing: boolean;
  isLoading: boolean;
  removeBackgroundEnabled: boolean;
  onRemoveBackgroundToggle: (enabled: boolean) => void;
  analysisResult: string | null;
}

const InputPanel: React.FC<InputPanelProps> = ({
  originalImage,
  onImageUpload,
  onAnalyzeAndGenerate,
  isAnalyzing,
  isLoading,
  removeBackgroundEnabled,
  onRemoveBackgroundToggle,
  analysisResult,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 flex flex-col gap-6 h-full">
      <div className="relative aspect-square w-full bg-gray-900/50 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 flex items-center justify-center">
        {originalImage ? (
          <img
            src={originalImage.dataUrl}
            alt="Original"
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-center text-gray-400">
            <Icon name="image" className="w-16 h-16 mx-auto mb-2" />
            <p>Upload an image to start</p>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <button
        onClick={handleUploadClick}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
      >
        <Icon name="upload" className="w-5 h-5 mr-2" />
        Upload Pet Image
      </button>

      <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-600 rounded-lg p-3">
        <input
          type="checkbox"
          id="removeBgCheckbox"
          checked={removeBackgroundEnabled}
          onChange={(e) => onRemoveBackgroundToggle(e.target.checked)}
          className="w-5 h-5 text-indigo-600 bg-gray-800 border-gray-600 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
        />
        <label htmlFor="removeBgCheckbox" className="text-gray-300 cursor-pointer flex-1">
          Remove background automatically
        </label>
      </div>

      <button
        onClick={onAnalyzeAndGenerate}
        disabled={isLoading || isAnalyzing || !originalImage}
        className="w-full mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-800 disabled:to-indigo-800 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center transition-all duration-200 text-lg shadow-lg shadow-purple-600/20"
      >
        {isAnalyzing ? (
          <>
            <Icon name="loader" className="w-6 h-6 mr-3 animate-spin" />
            Analyzing Pet...
          </>
        ) : isLoading ? (
          <>
            <Icon name="loader" className="w-6 h-6 mr-3 animate-spin" />
            Generating Image...
          </>
        ) : (
          <>
            <Icon name="sparkles" className="w-6 h-6 mr-3" />
            Analyze & Generate
          </>
        )}
      </button>

      {analysisResult && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-lg p-4 shadow-lg">
          <h3 className="font-bold text-purple-400 mb-2 flex items-center">
            <Icon name="sparkles" className="w-5 h-5 mr-2" />
            Pet Analysis
          </h3>
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default InputPanel;
