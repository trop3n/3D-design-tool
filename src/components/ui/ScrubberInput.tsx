import React, { useState, useRef, useEffect } from 'react';

interface ScrubberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  className?: string;
}

export const ScrubberInput: React.FC<ScrubberInputProps> = ({
  label,
  value,
  onChange,
  step = 0.1,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number>(0);
  const startValue = useRef<number>(0);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - startX.current;
        const newValue = startValue.current + deltaX * step;
        // Round to 2 decimal places to avoid floating point issues
        onChange(Math.round(newValue * 100) / 100);
      }
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = 'default';
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'ew-resize';
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, onChange, step]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.clientX;
    startValue.current = value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val)) {
      onChange(val);
    }
  };

  return (
    <div className={`flex items-center bg-gray-800 rounded overflow-hidden ${className}`}>
      <div
        onPointerDown={handlePointerDown}
        className="px-2 py-1 cursor-ew-resize hover:text-blue-400 select-none text-xs font-bold text-gray-400 bg-gray-700 hover:bg-gray-600 transition-colors"
        title="Drag to change value"
      >
        {label}
      </div>
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        step={step}
        className="w-full bg-transparent text-white px-2 py-1 text-sm text-right focus:outline-none appearance-none"
      />
    </div>
  );
};
