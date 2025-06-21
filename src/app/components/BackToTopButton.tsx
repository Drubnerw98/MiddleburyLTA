'use client'

export default function BackToTopButton() {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="text-center py-8">
            <button
                onClick={handleClick}
                className="border border-gray-400 text-sm text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition"
            >
                Back to Top
            </button>
        </div>
    );
}
