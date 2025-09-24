import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ImageLayer } from './ImageLayer';

interface ImageLayerItem {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface DrawingCanvasProps {
  width: number;
  height: number;
  brushSize: number;
  brushColor: string;
  tool: 'brush' | 'eraser' | 'image';
  backgroundImage?: string;
  onCanvasChange?: () => void;
  onClear?: () => void;
  imagesToAdd?: string[];
  onImagesAdded?: () => void;
}

export interface DrawingCanvasRef {
  clearCanvas: () => void;
  addImage: (imageUrl: string) => void;
  exportCanvas: () => string;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(({
  width,
  height,
  brushSize,
  brushColor,
  tool,
  backgroundImage,
  onCanvasChange,
  onClear,
  imagesToAdd = [],
  onImagesAdded
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);
  const [imageLayerItems, setImageLayerItems] = useState<ImageLayerItem[]>([]);

  const addImage = useCallback((imageUrl: string) => {
    const newImage: ImageLayerItem = {
      id: `img-${Date.now()}-${Math.random()}`,
      src: imageUrl,
      x: width * 0.25,
      y: height * 0.25,
      width: width * 0.3,
      height: height * 0.3,
      rotation: 0
    };
    
    setImageLayerItems(prev => [...prev, newImage]);
    onCanvasChange?.();
  }, [width, height, onCanvasChange]);

  const updateImage = useCallback((id: string, updates: Partial<ImageLayerItem>) => {
    setImageLayerItems(prev => 
      prev.map(img => img.id === id ? { ...img, ...updates } : img)
    );
    onCanvasChange?.();
  }, [onCanvasChange]);

  const deleteImage = useCallback((id: string) => {
    setImageLayerItems(prev => prev.filter(img => img.id !== id));
    onCanvasChange?.();
  }, [onCanvasChange]);

  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    // Create a temporary canvas to combine drawing and images
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return '';

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Draw the main canvas content
    tempCtx.drawImage(canvas, 0, 0);

    // Draw each image layer
    imageLayerItems.forEach(imageItem => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        tempCtx.save();
        
        // Calculate center point for rotation
        const centerX = imageItem.x + imageItem.width / 2;
        const centerY = imageItem.y + imageItem.height / 2;
        
        // Apply rotation
        tempCtx.translate(centerX, centerY);
        tempCtx.rotate((imageItem.rotation * Math.PI) / 180);
        tempCtx.translate(-centerX, -centerY);
        
        // Draw the image
        tempCtx.drawImage(img, imageItem.x, imageItem.y, imageItem.width, imageItem.height);
        tempCtx.restore();
      };
      
      img.src = imageItem.src;
    });

    return tempCanvas.toDataURL();
  }, [width, height, imageLayerItems]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = backgroundImage;
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
    }
    
    setImageLayerItems([]);
    onCanvasChange?.();
    onClear?.();
  }, [width, height, backgroundImage, onCanvasChange, onClear]);

  useImperativeHandle(ref, () => ({
    clearCanvas,
    addImage,
    exportCanvas
  }), [clearCanvas, addImage, exportCanvas]);

  // Handle adding new images
  useEffect(() => {
    if (imagesToAdd.length > 0) {
      imagesToAdd.forEach(imageUrl => {
        addImage(imageUrl);
      });
      onImagesAdded?.();
    }
  }, [imagesToAdd, addImage, onImagesAdded]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = backgroundImage;
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
    }
  }, [width, height, backgroundImage]);

  const getEventPoint = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

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
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'image') return; // Don't draw when in image mode
    
    e.preventDefault();
    const point = getEventPoint(e);
    setIsDrawing(true);
    setLastPoint(point);
  }, [tool, getEventPoint]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint || tool === 'image') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const currentPoint = getEventPoint(e);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
    }

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    setLastPoint(currentPoint);
    onCanvasChange?.();
  }, [isDrawing, lastPoint, brushSize, brushColor, tool, getEventPoint, onCanvasChange]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastPoint(null);
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 touch-none max-w-full max-h-full"
        style={{ width: '100%', height: 'auto' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      
      {/* Image Layer */}
      <ImageLayer
        images={imageLayerItems}
        onUpdateImage={updateImage}
        onDeleteImage={deleteImage}
        canvasWidth={width}
        canvasHeight={height}
        isActive={tool === 'image'}
      />
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';