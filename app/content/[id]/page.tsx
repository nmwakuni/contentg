
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import API_BASE_URL from '../../components/baseurl';

interface Content {
    id: number;
    topic: string;
    contentType: string;
    tone: string;
    wordCount: number;
    generatedContent: string;
    createdAt: string;
}

export default function ContentPage() {
    const params = useParams();
    const [content, setContent] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/content/history/${params.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch content');
                }
                const data = await response.json();
                setContent(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="p-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || 'Content not found'}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{content.topic}</h1>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(content.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded text-sm">
                            {content.contentType}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded text-sm">
                            {content.tone}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded text-sm">
                            {content.wordCount} words
                        </span>
                    </div>
                    <div className="prose dark:prose-invert max-w-none">
                        {content.generatedContent.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-4 text-gray-600 dark:text-gray-300">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}