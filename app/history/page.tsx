'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import API_BASE_URL from '../components/baseurl';

interface ContentGenerationHistory {
    id: number;
    topic: string;
    contentType: string;
    tone: string;
    wordCount: number;
    generatedContent: string;
    createdAt: string;
}

export default function History() {
    const [contentHistory, setContentHistory] = useState<ContentGenerationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedContent, setSelectedContent] = useState<ContentGenerationHistory | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/content/history`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch history');
                const data = await response.json();
                setContentHistory(data.generations || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch history');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (loading) return <div className="p-8">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Content Generation History</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentHistory.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">{item.topic}</h2>
                                <div className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-xs">
                                    {item.contentType}
                                </span>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-xs">
                                    {item.tone}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded text-xs">
                                    {item.wordCount} words
                                </span>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
                                    {item.generatedContent.split('\n')[0]}
                                </p>
                                <Link href={`/content/${item.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                                    Read More
                                </Link>
                            </div>
                            <button
                                onClick={() => setSelectedContent(item)}
                                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm inline-block text-center"
                            >
                                View Full Content
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedContent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedContent.topic}</h2>
                                <button
                                    onClick={() => setSelectedContent(null)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-sm">
                                    {selectedContent.contentType}
                                </span>
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-sm">
                                    {selectedContent.tone}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded text-sm">
                                    {selectedContent.wordCount} words
                                </span>
                            </div>
                            <div className="prose dark:prose-invert max-w-none">
                                {selectedContent.generatedContent.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-4 text-gray-600 dark:text-gray-300">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}