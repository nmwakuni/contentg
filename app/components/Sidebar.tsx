'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300`}>
            <div className="p-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 w-full mb-4"
                >
                    {isSidebarOpen ? '← Collapse' : '→'}
                </button>
                <nav className="space-y-2">
                    <Link
                        href="/"
                        className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isSidebarOpen ? 'Generate Content' : '✏️'}
                    </Link>
                    <Link
                        href="/history"
                        className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isSidebarOpen ? 'History' : '📜'}
                    </Link>
                    <Link
                        href="/generate-image"
                        className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isSidebarOpen ? 'Generate Images' : '🖼️'}
                    </Link>
                    <Link
                        href="/image-history"
                        className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isSidebarOpen ? 'Image History' : '🎞️'}
                    </Link>
                </nav>
            </div>
        </div>
    );
}