'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimatedModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

export default function AnimatedModal({ isOpen, onClose, children }: AnimatedModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Scrim */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        onClick={onClose}
                    />

                    {/* Modal box */}
                    <motion.div
                        className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 p-0"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
