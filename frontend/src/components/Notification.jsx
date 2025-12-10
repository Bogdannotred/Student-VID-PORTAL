import React, { useState, useEffect } from 'react';

export default function Notification({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 3000); 
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const borderColor = type === 'success' ? 'border-green-700' : 'border-red-700';

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white border-l-4 ${bgColor} ${borderColor} transition-opacity duration-300 z-50 max-w-xs sm:max-w-sm`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <p className="pr-6">{message}</p>
      <button onClick={() => setIsVisible(false)} className="absolute top-1 right-2 text-lg font-bold p-1 leading-none">
        &times;
      </button>
    </div>
  );
}