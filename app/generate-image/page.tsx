'use client';

import { useState } from 'react';
import API_BASE_URL from '../components/baseurl';
import Image from 'next/image';

export default function GenerateImage() {
  const [imageFormData, setImageFormData] = useState({
    prompt: '',
    width: 1024,
    height: 1024,
    model: 'flux'
  });
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setImageFormData(prev => ({
      ...prev,
      [name]: name === 'width' || name === 'height' ? parseInt(value) : value
    }));
  };

  // Fix downloadImage function
  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Add handleImageSubmit function
  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageLoading(true);
    setImageError('');

    try {
      const baseUrl = 'https://image.pollinations.ai/prompt/';
      const encodedPrompt = encodeURIComponent(imageFormData.prompt);
      const params = new URLSearchParams({
        width: imageFormData.width.toString(),
        height: imageFormData.height.toString(),
        seed: Date.now().toString(),
      });

      const directImageUrl = `${baseUrl}${encodedPrompt}?${params.toString()}`;
      setImageUrl(directImageUrl);

      await fetch(`${API_BASE_URL}/content/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...imageFormData,
          imageUrl: directImageUrl
        }),
      });

    } catch (err) {
      console.error('Error:', err);
      setImageError(err instanceof Error ? err.message : 'An error occurred during image generation');
    } finally {
      setImageLoading(false);
    }
  };

  // Update the model options
  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Image Generator
        </h1>

        <form onSubmit={handleImageSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Prompt
            </label>
            <input
              type="text"
              id="prompt"
              name="prompt"
              value={imageFormData.prompt}
              onChange={handleImageInputChange}
              required
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Describe the image you want to generate"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Width
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={imageFormData.width}
                onChange={handleImageInputChange}
                min="64"
                max="2048"
                step="64"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Height
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={imageFormData.height}
                onChange={handleImageInputChange}
                min="64"
                max="2048"
                step="64"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Model
            </label>
            <select
              id="model"
              name="model"
              value={imageFormData.model}
              onChange={handleImageInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            >
              <option value="flux">flux</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={imageLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {imageLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </form>

        {imageError && (
          <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {imageError}
          </div>
        )}

        {imageUrl && (
          <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Generated Image:</h2>
            <div className="relative aspect-square w-full">
              <Image
                src={imageUrl}
                alt="Generated"
                className="rounded-lg w-full"
              />
            </div>
            <button
              onClick={() => downloadImage(imageUrl)}
              className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Download Image
            </button>
          </div>
        )}
      </main>
    </div>
  );
}