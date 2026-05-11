'use client';

import { useState } from 'react';
import AnimatedModal from '@/app/components/AnimatedModal';

interface ContactModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
}

export default function ContactModal({ isOpen, onCloseAction }: ContactModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const feedback = { name, email, message };

        try {
            const res = await fetch('/api/send-feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedback),
            });

            const result = await res.json();
            if (!res.ok) {
                console.error('Email failed:', result.error);
                setStatus('error');
                return;
            }

            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
        } catch (err) {
            console.error('Submission error:', err);
            setStatus('error');
        }
    };

    return (
        <AnimatedModal isOpen={isOpen} onClose={onCloseAction} title="Contact Us">
            <div className="bg-bone text-ink w-full max-w-lg p-7 sm:p-8 border border-rule-strong space-y-5">
                <div>
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-oxblood">
                        Get in touch
                    </p>
                    <h2 className="font-serif text-2xl font-semibold text-ink mt-1.5">
                        Contact us
                    </h2>
                </div>

                {status === 'success' && (
                    <p className="font-sans text-sm text-moss bg-moss/[0.06] border-l-2 border-moss px-4 py-3">
                        Thanks for reaching out. We&rsquo;ll be in touch.
                    </p>
                )}
                {status === 'error' && (
                    <p className="font-sans text-sm text-oxblood bg-oxblood/[0.06] border-l-2 border-oxblood px-4 py-3">
                        Something went wrong. Please try again later.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Your name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full font-sans text-base bg-paper border border-ink/40 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors"
                    />
                    <input
                        type="email"
                        placeholder="Your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full font-sans text-base bg-paper border border-ink/40 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors"
                    />
                    <textarea
                        placeholder="Your message"
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full font-sans text-base bg-paper border border-ink/40 px-3 py-2.5 text-ink placeholder-muted focus:outline-none focus:border-ink transition-colors resize-none"
                    />

                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center px-6 py-2.5 font-sans text-sm font-semibold text-bone bg-ink hover:bg-ink-soft transition-colors"
                        >
                            Send message
                        </button>
                    </div>
                </form>

                <hr className="border-rule" />

                <div className="font-sans text-sm text-ink-soft">
                    <p>You can also reach us directly at:</p>
                    <p className="mt-1">
                        Email:{' '}
                        <a
                            href="mailto:MTA.admn@gmail.com"
                            className="text-oxblood hover:text-ink underline underline-offset-4 transition-colors"
                        >
                            MTA.admn@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </AnimatedModal>
    );
}
