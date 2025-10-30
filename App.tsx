
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { DEFAULT_IMAGE_DATA_URL, DEFAULT_PROMPT } from './constants';
import { fileToGenerativePart } from './utils/fileUtils';
import { removeBackground } from './utils/removebg';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import OutputPanel from './components/OutputPanel';
import type { ImageFile } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<ImageFile | null>({
    dataUrl: DEFAULT_IMAGE_DATA_URL,
    mimeType: 'image/jpeg',
  });
  const [prompt, setPrompt] = useState<string>(DEFAULT_PROMPT);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [removeBackgroundEnabled, setRemoveBackgroundEnabled] = useState<boolean>(true);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage({
        dataUrl: reader.result as string,
        mimeType: file.type,
      });
      setGeneratedImage(null); // Clear previous result on new image upload
      setAnalysisResult(null); // Clear previous analysis
    };
    reader.onerror = () => {
      setError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const analyzeAndGenerate = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const imagePart = await fileToGenerativePart(originalImage.dataUrl, originalImage.mimeType);

      // Step 1: Analyze the pet
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: {
          parts: [
            imagePart,
            {
              text: `Analyze this pet image in detail. Please provide:
1. Pet type (dog, cat, etc.)
2. Specific breed or breed characteristics
3. Physical features (color, fur type/texture, size, distinctive markings)
4. Body posture and stance (sitting, standing, lying down, running, etc.)
5. Facial expression and mood
6. Fur condition (fluffy, wet, groomed, messy, etc.)
7. Any distinctive accessories or features
8. Overall appearance and notable characteristics

Please be very specific and detailed in your analysis, as this will be used to generate an accurate cartoon version.`
            },
          ],
        },
      });

      const analysisText = analysisResponse.text || 'Unable to analyze the image.';
      setAnalysisResult(analysisText);
      setIsAnalyzing(false);

      // Step 2: Generate image based on analysis
      const generationPrompt = `Create a 3D-style cartoon character that EXACTLY matches this pet analysis:

${analysisText}

CRITICAL REQUIREMENTS:
- The breed, coloring, and markings MUST match the analysis exactly
- The pose and body position MUST be the same as described
- The fur texture and condition (wet/dry/fluffy) MUST be accurate
- Any distinctive features or accessories MUST be included
- Facial expression MUST match the analysis

Style requirements:
- Cute, stylized, Pixar-like 3D cartoon style
- Large round expressive eyes
- Soft shading and smooth, glossy texture
- Slightly exaggerated proportions for cuteness (larger head, shorter limbs)
- Soft studio lighting with subtle reflections on eyes and nose
- Transparent or white background suitable for sticker use
- Professional toy/mascot quality rendering

The character should look like a high-quality toy design while PERFECTLY preserving ALL distinctive features from the real pet.`;

      setPrompt(generationPrompt);

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            imagePart,
            { text: generationPrompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const firstPart = imageResponse.candidates?.[0]?.content?.parts?.[0];
      if (firstPart && firstPart.inlineData) {
        const newImageData = firstPart.inlineData;
        let finalImageUrl = `data:${newImageData.mimeType};base64,${newImageData.data}`;

        // Apply background removal if enabled
        if (removeBackgroundEnabled) {
          try {
            finalImageUrl = await removeBackground(finalImageUrl);
          } catch (bgError: unknown) {
            const bgErrorMessage = bgError instanceof Error ? bgError.message : 'Unknown error';
            console.warn('Background removal failed:', bgErrorMessage);
            // Still show the image even if background removal fails
          }
        }

        setGeneratedImage(finalImageUrl);
      } else {
        throw new Error('No image was generated. The model may have refused the prompt.');
      }
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsAnalyzing(false);
    }
  }, [originalImage, removeBackgroundEnabled]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <InputPanel
          originalImage={originalImage}
          onImageUpload={handleImageUpload}
          onAnalyzeAndGenerate={analyzeAndGenerate}
          isAnalyzing={isAnalyzing}
          isLoading={isLoading}
          removeBackgroundEnabled={removeBackgroundEnabled}
          onRemoveBackgroundToggle={setRemoveBackgroundEnabled}
          analysisResult={analysisResult}
        />
        <OutputPanel
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </div>
  );
};

export default App;
