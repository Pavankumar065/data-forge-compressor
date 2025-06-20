
import { Pen, Square, Circle, Eraser, Type, Undo, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface WhiteboardToolbarProps {
  activeTool: 'pen' | 'rectangle' | 'circle' | 'eraser' | 'text';
  onToolClick: (tool: 'pen' | 'rectangle' | 'circle' | 'eraser' | 'text') => void;
  activeColor: string;
  onColorChange: (color: string) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  onClear: () => void;
  onUndo: () => void;
}

const WhiteboardToolbar = ({
  activeTool,
  onToolClick,
  activeColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  onClear,
  onUndo
}: WhiteboardToolbarProps) => {
  const tools = [
    { id: 'pen' as const, icon: Pen, label: 'Pen' },
    { id: 'rectangle' as const, icon: Square, label: 'Rectangle' },
    { id: 'circle' as const, icon: Circle, label: 'Circle' },
    { id: 'eraser' as const, icon: Eraser, label: 'Eraser' },
    { id: 'text' as const, icon: Type, label: 'Text' },
  ];

  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Drawing Tools */}
        <div className="flex gap-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => onToolClick(tool.id)}
              className="flex items-center gap-2"
            >
              <tool.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tool.label}</span>
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Color Picker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Color:</span>
          <div className="flex gap-1">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`w-6 h-6 rounded border-2 ${
                  activeColor === color ? 'border-gray-400 dark:border-gray-500' : 'border-gray-200 dark:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <input
              type="color"
              value={activeColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-6 h-6 rounded border border-gray-200 dark:border-gray-600 cursor-pointer"
            />
          </div>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => onBrushSizeChange(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 w-6">{brushSize}</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onUndo}>
            <Undo className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Undo</span>
          </Button>
          <Button variant="outline" size="sm" onClick={onClear} className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Clear</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardToolbar;
