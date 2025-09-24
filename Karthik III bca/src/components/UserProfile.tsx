import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { User, LogOut, Palette, Calendar, Image as ImageIcon, Trash2, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SavedDrawing {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileProps {
  onStartDrawing: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onStartDrawing }) => {
  const { user, logout } = useAuth();
  const [savedDrawings, setSavedDrawings] = useState<SavedDrawing[]>([]);

  // Mock saved drawings - in a real app, this would come from Supabase
  useEffect(() => {
    if (user) {
      const mockDrawings: SavedDrawing[] = [
        {
          id: 'drawing-1',
          title: 'Sunset Landscape',
          thumbnail: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU1NjQxODk0fDA&ixlib=rb-4.1.0&q=80&w=300',
          createdAt: '2024-08-20T10:30:00Z',
          updatedAt: '2024-08-20T11:15:00Z'
        },
        {
          id: 'drawing-2',
          title: 'Abstract Art',
          thumbnail: 'https://images.unsplash.com/photo-1486551937199-baf066858de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhdHRlcm5zfGVufDF8fHx8MTc1NTcwNTQ3MHww&ixlib=rb-4.1.0&q=80&w=300',
          createdAt: '2024-08-19T14:20:00Z',
          updatedAt: '2024-08-19T14:45:00Z'
        },
        {
          id: 'drawing-3',
          title: 'Character Sketch',
          thumbnail: 'https://images.unsplash.com/photo-1734417090592-796137b57a5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWFscyUyMHN0aWNrZXJzfGVufDF8fHx8MTc1NTc1OTQ4Nnww&ixlib=rb-4.1.0&q=80&w=300',
          createdAt: '2024-08-18T09:10:00Z',
          updatedAt: '2024-08-18T09:30:00Z'
        }
      ];
      setSavedDrawings(mockDrawings);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleDeleteDrawing = (drawingId: string) => {
    setSavedDrawings(prev => prev.filter(d => d.id !== drawingId));
    toast.success('Drawing deleted');
  };

  const handleDownloadDrawing = (drawing: SavedDrawing) => {
    // In a real app, this would download the actual drawing file
    toast.success(`Downloading ${drawing.title}...`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                Member since {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onStartDrawing}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">New Drawing</h3>
                <p className="text-sm text-gray-600">Start creating art</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">My Drawings</h3>
                <p className="text-sm text-gray-600">{savedDrawings.length} saved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved Drawings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>My Drawings</span>
          </CardTitle>
          <CardDescription>
            Your saved artwork and drawings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {savedDrawings.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No drawings yet</h3>
              <p className="text-gray-600 mb-4">Start creating your first masterpiece!</p>
              <Button onClick={onStartDrawing} className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Create Drawing</span>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDrawings.map((drawing) => (
                <div key={drawing.id} className="group relative">
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square relative">
                      <ImageWithFallback
                        src={drawing.thumbnail}
                        alt={drawing.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleDownloadDrawing(drawing)}
                            className="flex items-center space-x-1"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteDrawing(drawing.id)}
                            className="flex items-center space-x-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-900 mb-1">{drawing.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created {formatDate(drawing.createdAt)}</span>
                        <Badge variant="secondary" className="text-xs">
                          Artwork
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};