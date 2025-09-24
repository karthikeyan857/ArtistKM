import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { X, RotateCw, Move, Maximize2 } from 'lucide-react';

interface ImageLayerItem {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface ImageLayerProps {
  images: ImageLayerItem[];
  onUpdateImage: (id: string, updates: Partial<ImageLayerItem>) => void;
  onDeleteImage: (id: string) => void;
  canvasWidth: number;
  canvasHeight: number;
  isActive: boolean;
}

export const ImageLayer: React.FC<ImageLayerProps> = ({
  images,
  onUpdateImage,
  onDeleteImage,
  canvasWidth,
  canvasHeight,
  isActive
}) => {
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getEventPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const scaleX = canvasWidth / rect.width;
    const scaleY = canvasHeight / rect.height;

    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX || 0;
      clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY || 0;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, [canvasWidth, canvasHeight]);

  const handleImageMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent, imageId: string) => {
    if (!isActive) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setSelectedImageId(imageId);
    setIsDragging(true);
    
    const point = getEventPoint(e);
    setDragStart(point);
  }, [isActive, getEventPoint]);

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !selectedImageId || !dragStart || !isActive) return;

    e.preventDefault();
    const currentPoint = getEventPoint(e);
    const deltaX = currentPoint.x - dragStart.x;
    const deltaY = currentPoint.y - dragStart.y;

    const selectedImage = images.find(img => img.id === selectedImageId);
    if (!selectedImage) return;

    const newX = Math.max(0, Math.min(canvasWidth - selectedImage.width, selectedImage.x + deltaX));
    const newY = Math.max(0, Math.min(canvasHeight - selectedImage.height, selectedImage.y + deltaY));

    onUpdateImage(selectedImageId, { x: newX, y: newY });
    setDragStart(currentPoint);
  }, [isDragging, selectedImageId, dragStart, isActive, getEventPoint, images, canvasWidth, canvasHeight, onUpdateImage]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove as any);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove as any);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleRotate = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      onUpdateImage(imageId, { rotation: (image.rotation + 90) % 360 });
    }
  };

  const handleResize = (imageId: string, scale: number) => {
    const image = images.find(img => img.id === imageId);
    if (image) {
      const newWidth = Math.max(50, Math.min(canvasWidth / 2, image.width * scale));
      const newHeight = Math.max(50, Math.min(canvasHeight / 2, image.height * scale));
      
      onUpdateImage(imageId, { 
        width: newWidth, 
        height: newHeight,
        x: Math.max(0, Math.min(canvasWidth - newWidth, image.x)),
        y: Math.max(0, Math.min(canvasHeight - newHeight, image.y))
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    >
      {images.map((image) => (
        <div
          key={image.id}
          className={`absolute pointer-events-auto ${selectedImageId === image.id ? 'ring-2 ring-blue-500' : ''}`}
          style={{
            left: `${(image.x / canvasWidth) * 100}%`,
            top: `${(image.y / canvasHeight) * 100}%`,
            width: `${(image.width / canvasWidth) * 100}%`,
            height: `${(image.height / canvasHeight) * 100}%`,
            transform: `rotate(${image.rotation}deg)`,
            cursor: isActive ? (isDragging && selectedImageId === image.id ? 'grabbing' : 'grab') : 'default'
          }}
          onMouseDown={(e) => handleImageMouseDown(e, image.id)}
          onTouchStart={(e) => handleImageMouseDown(e, image.id)}
        >
          <ImageWithFallback
            src={image.src}
            alt="Layer image"
            className="w-full h-full object-cover rounded border border-gray-300"
            draggable={false}
          />
          
          {/* Controls for selected image */}
          {selectedImageId === image.id && isActive && (
            <div className="absolute -top-10 left-0 flex space-x-1 bg-white rounded shadow-lg p-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRotate(image.id)}
                className="w-6 h-6 p-0"
              >
                <RotateCw className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResize(image.id, 1.2)}
                className="w-6 h-6 p-0"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResize(image.id, 0.8)}
                className="w-6 h-6 p-0"
              >
                <span className="text-xs">↘</span>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDeleteImage(image.id)}
                className="w-6 h-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};