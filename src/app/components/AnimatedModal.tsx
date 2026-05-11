'use client';

import { ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';

type AnimatedModalProps = {
    isOpen: boolean;
    onClose: () => void;
    /** Accessible label for the dialog. Set this to the heading of the
     *  modal content (e.g. "Login", "Register", "Contact Us"). */
    title: string;
    /** Optional accessible description; defaults to the visually-hidden
     *  empty string since most callers carry their own helper text. */
    description?: string;
    children: ReactNode;
};

/**
 * Radix Dialog wrapped with framer-motion entrance/exit. Provides:
 *   - focus trap + focus restoration on close
 *   - ESC to close
 *   - click-on-overlay to close (and NOT click-on-content)
 *   - aria-modal, aria-labelledby, aria-describedby wired automatically
 *   - portal rendering so the modal escapes any clipped parent
 *
 * Callers pass their modal content as `children`; AnimatedModal handles
 * the surrounding chrome (overlay + centered positioning + animation).
 */
export default function AnimatedModal({
    isOpen,
    onClose,
    title,
    description = '',
    children,
}: AnimatedModalProps) {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(next) => {
                if (!next) onClose();
            }}
        >
            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 bg-black/60 z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild aria-describedby={description ? undefined : undefined}>
                            <motion.div
                                className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 30 }}
                                transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                                <Dialog.Title className="sr-only">{title}</Dialog.Title>
                                {description && (
                                    <Dialog.Description className="sr-only">
                                        {description}
                                    </Dialog.Description>
                                )}
                                {children}
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}
