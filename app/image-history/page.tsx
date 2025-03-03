'use client';

import { useState, useEffect } from 'react';
import API_BASE_URL from '../components/baseurl';
import Image from 'next/image';

interface ImageGenerationHistory {
    id: number;
    prompt: string;
    imageUrl: string;
    width?: number;
    height?: number;
    model?: string;
    createdAt: string;
}

export default function ImageHistory() {
    const [history, setHistory] = useState<ImageGenerationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState<ImageGenerationHistory | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`${API_BASE_URL}/content/image-history`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setHistory(data.generations || []);

        } catch (err) {
            console.error('Error fetching image history:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch image history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="p-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Error: {error}
            </div>
        </div>
    );

    const downloadImage = async (imageUrl: string, prompt: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent modal from opening when clicking download
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const sanitizedPrompt = prompt.slice(0, 30).replace(/[^a-z0-9]/gi, '_');
            link.download = `${sanitizedPrompt}-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                Image Generation History
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                    >
                        <div
                            className="aspect-square relative cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.prompt}
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                                {item.prompt}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                                {item.width && item.height && (
                                    <span>{item.width}x{item.height}</span>
                                )}
                                {item.model && (
                                    <span>{item.model}</span>
                                )}
                            </div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 mb-4">
                                {new Date(item.createdAt).toLocaleString()}
                            </div>
                            <button
                                onClick={(e) => downloadImage(item.imageUrl, item.prompt, e)}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="relative">
                            <Image
                                src={selectedImage.imageUrl}
                                alt={selectedImage.prompt}
                                className="w-full h-auto object-contain max-h-[70vh] rounded-lg mb-4"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            {selectedImage.prompt}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                            {selectedImage.width && selectedImage.height && (
                                <span>Dimensions: {selectedImage.width}x{selectedImage.height}</span>
                            )}
                            {selectedImage.model && (
                                <span>Model: {selectedImage.model}</span>
                            )}
                            <span>Created: {new Date(selectedImage.createdAt).toLocaleString()}</span>
                        </div>
                        {/* Replace the existing download link in the modal with this button */}
                        <button
                            onClick={(e) => downloadImage(selectedImage.imageUrl, selectedImage.prompt, e)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Download Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}