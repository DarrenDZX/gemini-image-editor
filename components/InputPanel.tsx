
import React, { useRef } from 'react';
import Icon from './Icon';
import type { ImageFile } from '../types';

interface InputPanelProps {
  originalImage: ImageFile | null;
  onImageUpload: (file: File) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
  onAnalyze: () => void;
  onGenerate: () => void;
  isAnalyzing: boolean;
  isLoading: boolean;
  removeBackgroundEnabled: boolean;
  onRemoveBackgroundToggle: (enabled: boolean) => void;
  analysisResult: string | null;
}

const InputPanel: React.FC<InputPanelProps> = ({
  originalImage,
  onImageUpload,
  prompt,
  onPromptChange,
  onAnalyze,
  onGenerate,
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

      <button
        onClick={onAnalyze}
        disabled={isAnalyzing || !originalImage}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
      >
        {isAnalyzing ? (
          <>
            <Icon name="loader" className="w-5 h-5 mr-2 animate-spin" />
            Analyzing Pet...
          </>
        ) : (
          <>
            <Icon name="sparkles" className="w-5 h-5 mr-2" />
            Analyze Pet Breed & Posture
          </>
        )}
      </button>

      {analysisResult && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-lg p-4 shadow-lg">
          <h3 className="font-bold text-purple-400 mb-2 flex items-center">
            <Icon name="sparkles" className="w-5 h-5 mr-2" />
            Pet Analysis Result
          </h3>
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{analysisResult}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="font-semibold text-gray-300">
          Additional Instructions (Optional)
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="e.g., make it wear a Christmas hat, add a rainbow background, make it look extra fluffy..."
          className="w-full h-32 bg-gray-900/50 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow duration-200 resize-none text-sm"
          rows={4}
          disabled={!analysisResult}
        />
        <p className="text-xs text-gray-500">
          {analysisResult
            ? "Add any extra creative touches you want!"
            : "Analyze the pet first to enable this field"}
        </p>
      </div>

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
        onClick={onGenerate}
        disabled={isLoading || !analysisResult}
        className="w-full mt-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-800 disabled:to-purple-800 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-lg flex items-center justify-center transition-all duration-200 text-lg shadow-lg shadow-indigo-600/20"
      >
        {isLoading ? (
          <>
            <Icon name="loader" className="w-6 h-6 mr-3 animate-spin" />
            Generating Image...
          </>
        ) : (
          <>
            <Icon name="sparkles" className="w-6 h-6 mr-3" />
            Generate Cartoon Image
          </>
        )}
      </button>
    </div>
  );
};

export default InputPanel;
