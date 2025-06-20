type LogoProps = {
    className?: string;
};

export default function Logo({ className }: LogoProps) {
    return (
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className} // ✅ Apply the className here
        >
            <rect width="40" height="40" rx="8" fill="#3B3B3B" />
            <path
                d="M9.184 25.5V14.14H12.432L15.328 22.412L18.208 14.14H21.456V25.5H19.024V18.14L16.352 25.468H14.272L11.616 18.14V25.5H9.184ZM25.7555 25.5V16.188H22.3635V14.14H31.6115V16.188H28.2035V25.5H25.7555Z"
                fill="#FFDF20"
            />
        </svg>
    );
}
