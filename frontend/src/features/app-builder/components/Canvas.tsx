'use client';

import { useRef, useEffect, useState } from 'react';
import { ScreenConfig, Element } from './types';

interface CanvasProps {
  config: ScreenConfig;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<Element>) => void;
  onAddElement: (type: Element['type']) => void;
}

export default function Canvas({
  config,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (config.background.type === 'color') {
      ctx.fillStyle = config.background.value || '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (config.background.type === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, config.background.color1 || '#000000');
      gradient.addColorStop(1, config.background.color2 || '#FFFFFF');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (config.background.type === 'image' && config.background.imageUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
      img.src = config.background.imageUrl;
    }

    // Draw elements
    config.elements.forEach((element) => {
      drawElement(ctx, element, element.id === selectedElementId);
    });
  }, [config, selectedElementId]);

  const drawElement = (ctx: CanvasRenderingContext2D, element: Element, isSelected: boolean) => {
    ctx.save();

    if (element.rotation) {
      ctx.translate(element.x + (element.width || 0) / 2, element.y + (element.height || 0) / 2);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-(element.x + (element.width || 0) / 2), -(element.y + (element.height || 0) / 2));
    }

    if (element.opacity !== undefined) {
      ctx.globalAlpha = element.opacity;
    }

    if (element.type === 'text') {
      ctx.font = `${element.fontWeight || 'normal'} ${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
      ctx.fillStyle = element.color || '#000000';
      ctx.textAlign = element.alignment === 'center' ? 'center' : element.alignment === 'right' ? 'right' : 'left';
      ctx.fillText(element.text || '', element.x, element.y + (element.fontSize || 16));
    } else if (element.type === 'image' || element.type === 'logo') {
      if (element.src) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, element.x, element.y, element.width || 150, element.height || 150);
        };
        img.src = element.src;
      } else {
        ctx.fillStyle = '#E5E7EB';
        ctx.fillRect(element.x, element.y, element.width || 150, element.height || 150);
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No Image', element.x + (element.width || 150) / 2, element.y + (element.height || 150) / 2);
      }
    } else if (element.type === 'shape') {
      ctx.fillStyle = element.backgroundColor || '#3B82F6';
      if (element.shape === 'rectangle') {
        ctx.fillRect(element.x, element.y, element.width || 100, element.height || 100);
      } else if (element.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(
          element.x + (element.width || 100) / 2,
          element.y + (element.height || 100) / 2,
          (element.width || 100) / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    } else if (element.type === 'button') {
      ctx.fillStyle = element.backgroundColor || '#3B82F6';
      ctx.fillRect(element.x, element.y, element.width || 120, element.height || 40);
      ctx.fillStyle = element.textColor || '#FFFFFF';
      ctx.font = `${element.fontWeight || 'normal'} ${element.fontSize || 16}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(
        element.text || 'Button',
        element.x + (element.width || 120) / 2,
        element.y + (element.height || 40) / 2 + (element.fontSize || 16) / 2
      );
    }

    ctx.restore();

    // Draw selection border
    if (isSelected) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(element.x - 2, element.y - 2, (element.width || 100) + 4, (element.height || 100) + 4);
      ctx.setLineDash([]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on an element (reverse order to check top elements first)
    for (let i = config.elements.length - 1; i >= 0; i--) {
      const element = config.elements[i];
      if (
        x >= element.x &&
        x <= element.x + (element.width || 100) &&
        y >= element.y &&
        y <= element.y + (element.height || 100)
      ) {
        onSelectElement(element.id);
        setIsDragging(true);
        setDragOffset({ x: x - element.x, y: y - element.y });
        return;
      }
    }

    // If no element clicked, deselect
    onSelectElement(null);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElementId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onUpdateElement(selectedElementId, {
      x: x - dragOffset.x,
      y: y - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={config.width}
          height={config.height}
          className="border border-gray-300 bg-white shadow-lg cursor-move"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        
        {/* Quick Add Buttons */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white rounded-lg shadow-lg p-2">
          <button
            onClick={() => onAddElement('text')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            + Text
          </button>
          <button
            onClick={() => onAddElement('image')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            + Image
          </button>
          <button
            onClick={() => onAddElement('shape')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            + Shape
          </button>
          <button
            onClick={() => onAddElement('button')}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            + Button
          </button>
        </div>
      </div>
    </div>
  );
}
