'use client'

export default function BackToTopButton() {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="text-center py-10 border-t border-rule">
            <button
                onClick={handleClick}
                className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
            >
                Back to top
            </button>
        </div>
    );
}
