import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  zIndex?: string;
  headerAction?: React.ReactNode;
}

export const Modal = ({ onClose, title, children, zIndex = 'z-50', headerAction }: ModalProps) => (
  <div className={`fixed inset-0 bg-black/50 ${zIndex} flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200`} onClick={onClose}>
    <div className="bg-white w-full max-w-sm rounded-main shadow-elevated overflow-hidden flex flex-col max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
      <div className="p-4 border-b flex justify-between items-center bg-surface-modal flex-none">
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="flex items-center gap-2">
          {headerAction}
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={20} /></button>
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex-1">{children}</div>
    </div>
  </div>
);
