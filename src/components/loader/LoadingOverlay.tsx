// components/LoadingOverlay.tsx
import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';

const LoadingOverlay: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll'); // Cleanup on unmount
    };
  }, []);

  return ReactDOM.createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/35 backdrop-opacity-55 bg-opacity-5 flex items-center justify-center z-80 overflow-hidden opacity-100 transition-opacity duration-300"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4">Processing, please wait...</p>
      </div>
    </div>,
    document.body
  );
};

export default LoadingOverlay;
