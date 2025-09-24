import React, { useState, useRef, useCallback } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginScreen } from "./components/LoginScreen";
import { UserProfile } from "./components/UserProfile";
import { AppNavigation } from "./components/AppNavigation";
import {
  DrawingCanvas,
  DrawingCanvasRef,
} from "./components/DrawingCanvas";
import { DrawingToolbar } from "./components/DrawingToolbar";
import { toast, Toaster } from "sonner@2.0.3";
import { Palette, Monitor, Smartphone } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";

const DrawingApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<
    "drawing" | "profile"
  >("drawing");
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState("#000000");
  const [tool, setTool] = useState<
    "brush" | "eraser" | "image"
  >("brush");
  const [backgroundImage, setBackgroundImage] = useState<
    string | undefined
  >();
  const [imagesToAdd, setImagesToAdd] = useState<string[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<DrawingCanvasRef>(null);

  // Responsive canvas sizing
  const getOptimalCanvasSize = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    if (screenWidth < 768) {
      // Mobile devices
      return {
        width: Math.min(600, screenWidth - 32),
        height: Math.min(400, (screenWidth - 32) * 0.75)
      };
    } else if (screenWidth < 1024) {
      // Tablet devices
      return {
        width: Math.min(700, screenWidth - 64),
        height: Math.min(500, (screenWidth - 64) * 0.7)
      };
    } else {
      // Desktop devices
      return {
        width: isFullscreen ? screenWidth - 64 : 800,
        height: isFullscreen ? screenHeight - 200 : 600
      };
    }
  }, [isFullscreen]);

  React.useEffect(() => {
    const updateCanvasSize = () => {
      setCanvasSize(getOptimalCanvasSize());
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [getOptimalCanvasSize]);

  const handleLoadImage = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;

        if (tool === "image") {
          setImagesToAdd([result]);
          toast.success("🖼️ Image added to canvas!");
        } else {
          setBackgroundImage(result);
          toast.success("🎨 Background image loaded!");
        }
      };
      reader.readAsDataURL(file);
    },
    [tool],
  );

  const handleSelectGalleryImage = useCallback(
    (imageUrl: string) => {
      if (tool === "image") {
        setImagesToAdd([imageUrl]);
        toast.success("✨ Art image added to canvas!");
      } else {
        setBackgroundImage(imageUrl);
        toast.success("🎨 Art background loaded!");
      }
    },
    [tool],
  );

  const handleSelectTemplate = useCallback(
    (templateUrl: string) => {
      setBackgroundImage(templateUrl);
      toast.success("🎨 Art template loaded as background!");
    },
    [],
  );

  const handleImagesAdded = useCallback(() => {
    setImagesToAdd([]);
  }, []);

  const handleSave = useCallback(() => {
    if (!canvasRef.current) {
      toast.error("Canvas not found");
      return;
    }

    try {
      const dataUrl = canvasRef.current.exportCanvas();

      if (!dataUrl) {
        const canvas = document.querySelector(
          "canvas",
        ) as HTMLCanvasElement;
        if (!canvas) {
          toast.error("Canvas not found");
          return;
        }

        const link = document.createElement("a");
        link.download = `drawing-${Date.now()}.png`;
        link.href = canvas.toDataURL();

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const link = document.createElement("a");
        link.download = `artwork-${Date.now()}.png`;
        link.href = dataUrl;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success("🎨 Artwork saved successfully!");
      toast.info("✨ Artwork saved to your downloads!");
    } catch (error) {
      toast.error("Failed to save artwork");
      console.error("Save error:", error);
    }
  }, []);

  const handleClear = useCallback(() => {
    canvasRef.current?.clearCanvas();
    toast.success("🧹 Canvas cleared!");
  }, []);

  const handleCanvasChange = useCallback(() => {
    // Auto-save functionality could be implemented here
  }, []);

  const handleToolChange = useCallback(
    (newTool: "brush" | "eraser" | "image") => {
      setTool(newTool);

      const toolMessages = {
        image: "🖼️ Image mode: Select and position images on your canvas",
        brush: "🖌️ Brush mode: Paint freely with your selected color",
        eraser: "🧹 Eraser mode: Remove parts of your drawing"
      };

      toast.info(toolMessages[newTool]);
    },
    [],
  );

  const handleStartDrawing = useCallback(() => {
    setCurrentView("drawing");
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    toast.info(isFullscreen ? "📱 Normal view" : "🖥️ Fullscreen mode");
  }, [isFullscreen]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Drawing Studio</h2>
          <p className="text-gray-600">Preparing your creative workspace...</p>
        </div>
      </div>
    );
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  // Show user profile
  if (currentView === "profile") {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppNavigation
          currentView={currentView}
          onViewChange={setCurrentView}
        />
        <UserProfile onStartDrawing={handleStartDrawing} />
      </div>
    );
  }

  // Show drawing app
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <AppNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* Status Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Tool indicator */}
            <div className="flex items-center space-x-2">
              <Badge variant={tool === 'brush' ? 'default' : 'secondary'} className="text-xs">
                🖌️ {tool === 'brush' ? 'Painting' : tool === 'eraser' ? '🧹 Erasing' : '🖼️ Images'}
              </Badge>
              {tool === 'brush' && (
                <>
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300" 
                    style={{ backgroundColor: brushColor }}
                  />
                  <span className="text-xs text-gray-600">{brushSize}px</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Canvas size info */}
            <Badge variant="outline" className="text-xs">
              {canvasSize.width} × {canvasSize.height}
            </Badge>
            
            {/* Device indicator */}
            <div className="hidden sm:flex items-center space-x-1 text-xs text-gray-500">
              {window.innerWidth < 768 ? (
                <><Smartphone className="w-3 h-3" /> Mobile</>
              ) : (
                <><Monitor className="w-3 h-3" /> Web</>
              )}
            </div>
            
            {/* Fullscreen toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-xs"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          </div>
        </div>
        
        {/* Tool tip */}
        {tool === "image" && (
          <div className="mt-2 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs">
              💡 Tip: Click on images in your gallery to add them to the canvas, then drag to position
            </div>
          </div>
        )}
      </div>

      {/* Canvas Container */}
      <div className={`flex-1 flex items-center justify-center p-4 overflow-auto ${isFullscreen ? 'p-2' : ''}`}>
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-full">
          <div className="flex items-center justify-center mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Palette className="w-4 h-4" />
              <span>Digital Canvas</span>
            </div>
          </div>
          
          <DrawingCanvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            brushSize={brushSize}
            brushColor={brushColor}
            tool={tool}
            backgroundImage={backgroundImage}
            onCanvasChange={handleCanvasChange}
            onClear={handleClear}
            imagesToAdd={imagesToAdd}
            onImagesAdded={handleImagesAdded}
          />
          
          {/* Canvas info */}
          <div className="mt-2 text-center text-xs text-gray-500">
            Canvas optimized for {window.innerWidth < 768 ? 'mobile' : 'web'} • 
            Click and drag to draw • Use toolbar below for tools
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={isFullscreen ? 'h-auto' : ''}>
        <DrawingToolbar
          brushSize={brushSize}
          brushColor={brushColor}
          tool={tool}
          onBrushSizeChange={setBrushSize}
          onBrushColorChange={setBrushColor}
          onToolChange={handleToolChange}
          onClear={handleClear}
          onSave={handleSave}
          onLoadImage={handleLoadImage}
          onSelectGalleryImage={handleSelectGalleryImage}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DrawingApp />
      <Toaster 
        richColors 
        position="top-center" 
        expand={true}
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
          },
        }}
      />
    </AuthProvider>
  );
}