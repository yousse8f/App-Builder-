'use client';

import { Element, TextElement, ImageElement, ShapeElement, ButtonElement } from './types';
import { Trash2 } from 'lucide-react';

interface PropertiesPanelProps {
  element: Element;
  onUpdate: (elementId: string, updates: Partial<Element>) => void;
  onDelete: () => void;
}

export default function PropertiesPanel({ element, onUpdate, onDelete }: PropertiesPanelProps) {
  const handleChange = (field: string, value: string | number | boolean) => {
    onUpdate(element.id, { [field]: value });
  };

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 capitalize">{element.type} Properties</h3>
        <button
          onClick={onDelete}
          className="p-1 hover:bg-red-100 rounded text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Common Properties */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">X</label>
            <input
              type="number"
              value={element.x}
              onChange={(e) => handleChange('x', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Y</label>
            <input
              type="number"
              value={element.y}
              onChange={(e) => handleChange('y', parseInt(e.target.value) || 0)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
            <input
              type="number"
              value={element.width || 100}
              onChange={(e) => handleChange('width', parseInt(e.target.value) || 100)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
            <input
              type="number"
              value={element.height || 100}
              onChange={(e) => handleChange('height', parseInt(e.target.value) || 100)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rotation</label>
          <input
            type="number"
            value={element.rotation || 0}
            onChange={(e) => handleChange('rotation', parseInt(e.target.value) || 0)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.opacity ?? 1}
            onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Type-specific properties */}
        {element.type === 'text' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
              <textarea
                value={(element as TextElement).text}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={2}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
              <input
                type="number"
                value={(element as TextElement).fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value) || 16)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Font Weight</label>
              <select
                value={(element as TextElement).fontWeight}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
                <option value="700">700</option>
                <option value="800">800</option>
                <option value="900">900</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={(element as TextElement).color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Alignment</label>
              <select
                value={(element as TextElement).alignment || 'left'}
                onChange={(e) => handleChange('alignment', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}

        {(element.type === 'image' || element.type === 'logo') && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={(element as ImageElement).src}
                onChange={(e) => handleChange('src', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
              <input
                type="number"
                value={(element as ImageElement).borderRadius || 0}
                onChange={(e) => handleChange('borderRadius', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Fit</label>
              <select
                value={(element as ImageElement).fit || 'cover'}
                onChange={(e) => handleChange('fit', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="fill">Fill</option>
                <option value="none">None</option>
              </select>
            </div>
          </>
        )}

        {element.type === 'shape' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Shape</label>
              <select
                value={(element as ShapeElement).shape}
                onChange={(e) => handleChange('shape', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={(element as ShapeElement).backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Border Color</label>
              <input
                type="color"
                value={(element as ShapeElement).borderColor || '#000000'}
                onChange={(e) => handleChange('borderColor', e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Border Width</label>
              <input
                type="number"
                value={(element as ShapeElement).borderWidth || 0}
                onChange={(e) => handleChange('borderWidth', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </>
        )}

        {element.type === 'button' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text</label>
              <input
                type="text"
                value={(element as ButtonElement).text}
                onChange={(e) => handleChange('text', e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="color"
                value={(element as ButtonElement).backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Text Color</label>
              <input
                type="color"
                value={(element as ButtonElement).textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Font Size</label>
              <input
                type="number"
                value={(element as ButtonElement).fontSize}
                onChange={(e) => handleChange('fontSize', parseInt(e.target.value) || 16)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Border Radius</label>
              <input
                type="number"
                value={(element as ButtonElement).borderRadius || 0}
                onChange={(e) => handleChange('borderRadius', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
