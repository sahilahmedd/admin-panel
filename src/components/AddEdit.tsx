import React from "react";

type ModalProps = {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ title, onClose, onSubmit, children }) => {
  return (
    <div className="fixed inset-0 bg-gray-300/25 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
