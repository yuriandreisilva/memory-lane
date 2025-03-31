import React, { ReactNode } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {children}
        <button onClick={onClose} className="w-full mt-4 bg-gray-400 text-white px-4 py-2 rounded-lg">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default Dialog;
