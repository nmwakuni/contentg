'use client';

import { useState } from 'react';
import API_BASE_URL from './components/baseurl';

export default function Home() {
  const [formData, setFormData] = useState({
    topic: '',
    contentType: 'article',
    tone: 'professional',
    wordCount: 500,
    maxTokens: 1000
  });
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/content/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check if the server is running.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.content);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'wordCount' || name === 'maxTokens' ? parseInt(value) : value
    }));
  };

  return (
    <>
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Content Generator
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Topic
              </label>
              <input
                type="text"
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Enter your topic"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Content Type
                </label>
                <select
                  id="contentType"
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="article">Article</option>
                  <option value="blog">Blog Post</option>
                  <option value="social-post">Social Post</option>
                </select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Tone
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="wordCount" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Word Count
                </label>
                <input
                  type="number"
                  id="wordCount"
                  name="wordCount"
                  value={formData.wordCount}
                  onChange={handleInputChange}
                  min="50"
                  max="2000"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Max Tokens (optional)
                </label>
                <input
                  type="number"
                  id="maxTokens"
                  name="maxTokens"
                  value={formData.maxTokens}
                  onChange={handleInputChange}
                  min="1"
                  max="4096"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {content && (
            <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Generated Content:</h2>
              <div className="prose dark:prose-invert max-w-none">
                {content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
