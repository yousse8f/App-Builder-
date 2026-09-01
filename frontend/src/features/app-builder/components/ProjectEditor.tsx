'use client';

import { useState } from 'react';
import { Plus, Trash2, Copy, GripVertical } from 'lucide-react';
import { Element, ScreenConfig } from './types';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import Button from '@/components/shared/Button';
import { ProjectAsset } from '@/lib/api/projects';

interface ProjectScreen {
  id: string;
  name: string;
  order: number;
  config: ScreenConfig;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  screens: ProjectScreen[];
  assets: ProjectAsset[];
  width?: number;
  height?: number;
  deviceType?: string;
}

interface ProjectEditorProps {
  project: Project;
  onUpdate: (project: Project) => void;
}

export default function ProjectEditor({ project, onUpdate }: ProjectEditorProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(
    project.screens[0]?.id || null
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const selectedScreen = project.screens.find((s: ProjectScreen) => s.id === selectedScreenId);
  const selectedElement = selectedScreen?.config.elements.find((e: Element) => e.id === selectedElementId);

  const handleAddScreen = () => {
    const newScreen: ProjectScreen = {
      id: `screen-${Date.now()}`,
      name: `Screen ${project.screens.length + 1}`,
      order: project.screens.length,
      config: {
        width: project.width || 1290,
        height: project.height || 2796,
        background: {
          type: 'color',
          value: '#FFFFFF',
        },
        device: {
          type: (project.deviceType?.toLowerCase() as 'iphone' | 'ipad' | 'android-phone' | 'android-tablet') || 'iphone',
          model: '6.9',
        },
        elements: [] as Element[],
      },
    };

    onUpdate({
      ...project,
      screens: [...project.screens, newScreen],
    });
    setSelectedScreenId(newScreen.id);
  };

  const handleDeleteScreen = (screenId: string) => {
    if (project.screens.length <= 1) {
      alert('You must have at least one screen');
      return;
    }

    const updatedScreens = project.screens.filter((s: ProjectScreen) => s.id !== screenId);
    onUpdate({
      ...project,
      screens: updatedScreens,
    });

    if (selectedScreenId === screenId) {
      setSelectedScreenId(updatedScreens[0]?.id || null);
    }
  };

  const handleDuplicateScreen = (screenId: string) => {
    const screenToDuplicate = project.screens.find((s: ProjectScreen) => s.id === screenId);
    if (!screenToDuplicate) return;

    const newScreen: ProjectScreen = {
      ...screenToDuplicate,
      id: `screen-${crypto.randomUUID()}`,
      name: `${screenToDuplicate.name} (Copy)`,
      order: project.screens.length,
      config: {
        ...JSON.parse(JSON.stringify(screenToDuplicate.config)),
        elements: JSON.parse(JSON.stringify(screenToDuplicate.config.elements)) as Element[]
      },
    };

    onUpdate({
      ...project,
      screens: [...project.screens, newScreen],
    });
    setSelectedScreenId(newScreen.id);
  };

  const handleUpdateScreen = (screenId: string, config: ScreenConfig) => {
    const updatedScreens = project.screens.map((s: ProjectScreen) =>
      s.id === screenId ? { ...s, config: { ...config, elements: config.elements as Element[] } } : s
    );
    onUpdate({
      ...project,
      screens: updatedScreens,
    });
  };

  const handleUpdateElement = (elementId: string, updates: Partial<Element>) => {
    if (!selectedScreen) return;

    const updatedElements = selectedScreen.config.elements.map((e: Element) =>
      e.id === elementId ? { ...e, ...updates } as Element : e as Element
    );

    handleUpdateScreen(selectedScreen.id, {
      ...selectedScreen.config,
      elements: updatedElements,
    });
  };

  const handleAddElement = (type: Element['type']) => {
    if (!selectedScreen) return;

    let newElement: Element;

    if (type === 'text') {
      newElement = {
        id: `element-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        text: 'New Text',
        fontSize: 24,
        fontWeight: 'normal',
        color: '#000000',
      };
    } else if (type === 'image' || type === 'logo') {
      newElement = {
        id: `element-${Date.now()}`,
        type,
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        src: '',
      };
    } else if (type === 'shape') {
      newElement = {
        id: `element-${Date.now()}`,
        type: 'shape',
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        shape: 'rectangle',
        backgroundColor: '#3B82F6',
      };
    } else if (type === 'button') {
      newElement = {
        id: `element-${Date.now()}`,
        type: 'button',
        x: 100,
        y: 100,
        width: 120,
        height: 40,
        text: 'Button',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'normal',
      };
    } else {
      // Fallback for any other type
      newElement = {
        id: `element-${Date.now()}`,
        type: 'text',
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        text: 'New Text',
        fontSize: 24,
        fontWeight: 'normal',
        color: '#000000',
      };
    }

    handleUpdateScreen(selectedScreen.id, {
      ...selectedScreen.config,
      elements: [...(selectedScreen.config.elements as Element[]), newElement as Element],
    });
    setSelectedElementId(newElement.id);
  };

  const handleDeleteElement = (elementId: string) => {
    if (!selectedScreen) return;

    const updatedElements = selectedScreen.config.elements.filter((e: Element) => e.id !== elementId);
    handleUpdateScreen(selectedScreen.id, {
      ...selectedScreen.config,
      elements: updatedElements,
    });
    setSelectedElementId(null);
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Screens */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 mb-3">Screens</h2>
          <Button
            size="small"
            onClick={handleAddScreen}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Screen
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {project.screens.map((screen: ProjectScreen, index: number) => (
            <div
              key={screen.id}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedScreenId === screen.id
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedScreenId(screen.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-sm">{screen.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateScreen(screen.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy className="w-3 h-3 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScreen(screen.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        {selectedScreen ? (
          <Canvas
            config={selectedScreen.config}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onAddElement={handleAddElement}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a screen to edit</p>
          </div>
        )}
      </div>

      {/* Right Panel - Properties */}
      <div className="w-80 border-l bg-white flex flex-col">
        {selectedElement ? (
          <PropertiesPanel
            element={selectedElement}
            onUpdate={handleUpdateElement}
            onDelete={() => handleDeleteElement(selectedElement.id)}
          />
        ) : selectedScreen ? (
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Screen Properties</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Type
                </label>
                <select
                  value={selectedScreen.config.background.type}
                  onChange={(e) => handleUpdateScreen(selectedScreen.id, {
                    ...selectedScreen.config,
                    background: { ...selectedScreen.config.background, type: e.target.value as 'color' | 'gradient' | 'image' }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="color">Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </select>
              </div>

              {selectedScreen.config.background.type === 'color' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={selectedScreen.config.background.value || '#FFFFFF'}
                    onChange={(e) => handleUpdateScreen(selectedScreen.id, {
                      ...selectedScreen.config,
                      background: { ...selectedScreen.config.background, value: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width
                  </label>
                  <input
                    type="number"
                    value={selectedScreen.config.width}
                    onChange={(e) => handleUpdateScreen(selectedScreen.id, {
                      ...selectedScreen.config,
                      width: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height
                  </label>
                  <input
                    type="number"
                    value={selectedScreen.config.height}
                    onChange={(e) => handleUpdateScreen(selectedScreen.id, {
                      ...selectedScreen.config,
                      height: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <p className="text-gray-500 text-center">
              Select an element to edit its properties
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
