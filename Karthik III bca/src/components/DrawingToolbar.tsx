import React, { useState } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Brush, 
  Eraser, 
  Palette, 
  Download, 
  Upload, 
  RotateCcw, 
  Image as ImageIcon, 
  Layout, 
  Sparkles,
  Settings,
  Undo,
  Redo,
  Save,
  Share,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { ImageGallery } from './ImageGallery';
import { ArtTemplates } from './ArtTemplates';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface DrawingToolbarProps {
  brushSize: number;
  brushColor: string;
  tool: 'brush' | 'eraser' | 'image';
  onBrushSizeChange: (size: number) => void;
  onBrushColorChange: (color: string) => void;
  onToolChange: (tool: 'brush' | 'eraser' | 'image') => void;
  onClear: () => void;
  onSave: () => void;
  onLoadImage: (file: File) => void;
  onSelectGalleryImage: (imageUrl: string) => void;
  onSelectTemplate: (templateUrl: string) => void;
}

const colors = [
  // Essential colors
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  // Extended palette
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  // Artistic colors
  '#FFC0CB', '#A52A2A', '#808080', '#FFB6C1', '#DDA0DD',
  '#87CEEB', '#98FB98', '#F0E68C', '#CD853F', '#D2691E',
  // Professional art colors
  '#2F4F4F', '#8B4513', '#556B2F', '#8B0000', '#191970',
  '#008B8B', '#B22222', '#228B22', '#4B0082', '#FF1493',
  // Additional web-friendly colors
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const brushSizes = [
  { size: 1, label: 'Fine' },
  { size: 3, label: 'Thin' },
  { size: 5, label: 'Normal' },
  { size: 8, label: 'Medium' },
  { size: 12, label: 'Thick' },
  { size: 20, label: 'Bold' },
  { size: 30, label: 'Heavy' },
  { size: 50, label: 'Max' }
];

export const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  brushSize,
  brushColor,
  tool,
  onBrushSizeChange,
  onBrushColorChange,
  onToolChange,
  onClear,
  onSave,
  onLoadImage,
  onSelectGalleryImage,
  onSelectTemplate
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isColorsExpanded, setIsColorsExpanded] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadImage(file);
    }
  };

  const handleTemplateSelect = (templateUrl: string) => {
    onSelectTemplate(templateUrl);
  };

  const quickSave = () => {
    onSave();
  };

  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          onSave();
          break;
        case 'z':
          e.preventDefault();
          // Undo functionality would go here
          break;
        case 'y':
          e.preventDefault();
          // Redo functionality would go here
          break;
      }
    }
    
    // Tool shortcuts
    switch (e.key.toLowerCase()) {
      case 'b':
        onToolChange('brush');
        break;
      case 'e':
        onToolChange('eraser');
        break;
      case 'i':
        onToolChange('image');
        break;
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, []);

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      {/* Main Toolbar */}
      <div className="p-3 space-y-3">
        {/* Primary Tools */}
        <div className="flex justify-center items-center space-x-2 flex-wrap gap-2">
          <div className="flex space-x-1 bg-gray-50 rounded-lg p-1">
            <Button
              variant={tool === 'brush' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('brush')}
              className="flex items-center space-x-1 text-xs"
              title="Brush Tool (B)"
            >
              <Brush className="w-4 h-4" />
              <span className="hidden sm:inline">Brush</span>
            </Button>
            <Button
              variant={tool === 'eraser' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('eraser')}
              className="flex items-center space-x-1 text-xs"
              title="Eraser Tool (E)"
            >
              <Eraser className="w-4 h-4" />
              <span className="hidden sm:inline">Eraser</span>
            </Button>
            <Button
              variant={tool === 'image' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onToolChange('image')}
              className="flex items-center space-x-1 text-xs"
              title="Image Tool (I)"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Images</span>
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Quick Actions */}
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Undo functionality */}}
              className="text-xs"
              title="Undo (Ctrl+Z)"
              disabled
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* Redo functionality */}}
              className="text-xs"
              title="Redo (Ctrl+Y)"
              disabled
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
              className="text-xs"
              title="Clear Canvas"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={quickSave}
              className="flex items-center space-x-1 text-xs"
              title="Save Artwork (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
          </div>
        </div>

        {/* Tool-specific Quick Controls */}
        {tool !== 'image' && (
          <div className="flex justify-center items-center space-x-4 flex-wrap">
            {/* Brush Size Quick Select */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-600">Size:</span>
              <div className="flex space-x-1">
                {brushSizes.slice(0, 4).map((brush) => (
                  <Button
                    key={brush.size}
                    variant={brushSize === brush.size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onBrushSizeChange(brush.size)}
                    className="text-xs px-2 py-1"
                    title={`${brush.label} (${brush.size}px)`}
                  >
                    {brush.size}
                  </Button>
                ))}
              </div>
              <Badge variant="secondary" className="text-xs">
                {brushSize}px
              </Badge>
            </div>

            {/* Color Quick Select - only for brush */}
            {tool === 'brush' && (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-600">Color:</span>
                <div className="flex space-x-1">
                  {colors.slice(0, 8).map((color) => (
                    <button
                      key={color}
                      className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                        brushColor === color ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => onBrushColorChange(color)}
                      title={color.toUpperCase()}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsColorsExpanded(!isColorsExpanded)}
                    className="px-2 py-1 text-xs"
                  >
                    <Palette className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Expanded Color Palette */}
        {tool === 'brush' && isColorsExpanded && (
          <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Complete Color Palette</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsColorsExpanded(false)}
                className="text-xs"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                    brushColor === color ? 'border-gray-800 ring-2 ring-gray-300' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onBrushColorChange(color)}
                  title={color.toUpperCase()}
                />
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Current: {brushColor.toUpperCase()}</span>
              <div className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: brushColor }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Controls */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Advanced Tools & Resources</span>
                <Badge variant="outline" className="text-xs">
                  Templates • Gallery • Upload
                </Badge>
              </div>
              {isAdvancedOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="p-4 bg-gray-50 border-b border-gray-200 space-y-4">
            {/* Detailed Tool Controls */}
            {tool !== 'image' && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Tool Settings</span>
                </div>
                
                {/* Brush Size Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {tool === 'brush' ? 'Brush Size' : 'Eraser Size'}
                    </span>
                    <Badge variant="secondary">{brushSize}px</Badge>
                  </div>
                  <Slider
                    value={[brushSize]}
                    onValueChange={(value) => onBrushSizeChange(value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Fine (1px)</span>
                    <span>Maximum (50px)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Art Resources */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Art Resources</span>
                <Badge variant="outline" className="text-xs">
                  Professional Assets
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <ArtTemplates onSelectTemplate={handleTemplateSelect} />
                
                <ImageGallery
                  onSelectImage={onSelectGalleryImage}
                  onLoadCustomImage={onLoadImage}
                />
                
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" className="flex items-center space-x-1 w-full">
                    <Upload className="w-4 h-4" />
                    <span>Upload Image</span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Image Mode Help */}
            {tool === 'image' && (
              <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Image Mode Active</span>
                </div>
                <div className="text-xs text-blue-700 space-y-1">
                  <p><strong>Web Controls:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Click and drag images to reposition</li>
                    <li>Use corner handles to resize</li>
                    <li>Drag rotation handle to rotate</li>
                    <li>Right-click for context menu</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Keyboard Shortcuts */}
            <div className="space-y-2 p-3 bg-gray-100 rounded-lg">
              <span className="text-xs font-medium text-gray-700">Keyboard Shortcuts:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
                <div><kbd className="px-1 py-0.5 bg-white rounded border">B</kbd> Brush</div>
                <div><kbd className="px-1 py-0.5 bg-white rounded border">E</kbd> Eraser</div>
                <div><kbd className="px-1 py-0.5 bg-white rounded border">I</kbd> Images</div>
                <div><kbd className="px-1 py-0.5 bg-white rounded border">Ctrl+S</kbd> Save</div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};