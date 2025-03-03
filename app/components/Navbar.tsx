import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-100 transition-colors">
                            TechWorld With Nick
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}