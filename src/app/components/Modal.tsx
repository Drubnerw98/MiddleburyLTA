"use client";

import { ReactNode } from "react";

interface ModalProps {
  title?: string;
  children: ReactNode;
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function Modal({
                                title,
                                children,
                                isOpen,
                                onCloseAction,
                              }: ModalProps) {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
        <div className="bg-[#2c3545] border border-white/10 p-6 rounded-lg max-w-sm w-full text-white shadow-lg space-y-4">
          {title && (
              <h3 className="text-xl font-semibold text-blue-300">{title}</h3>
          )}
          <div className="text-sm leading-relaxed text-gray-200">{children}</div>
          <button
              onClick={onCloseAction}
              className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-medium"
          >
            Got it
          </button>
        </div>
      </div>
  );
}
