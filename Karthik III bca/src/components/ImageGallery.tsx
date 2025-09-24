import React, { useState } from 'react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, Image as ImageIcon, Upload, Search, Star } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface ImageGalleryProps {
  onSelectImage: (imageUrl: string) => void;
  onLoadCustomImage: (file: File) => void;
}

const predefinedImages = [
  // Nature & Landscapes
  {
    id: 'nature1',
    url: 'https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGV8ZW58MXx8fHwxNzU1NjQxODk0fDA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Mountain Landscape',
    category: 'Nature',
    featured: true
  },
  {
    id: 'botanical1',
    url: 'https://images.unsplash.com/photo-1727527248663-5b0c475061b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3RhbmljYWwlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzU1NzA5NDE4fDA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Botanical Illustration',
    category: 'Nature'
  },
  {
    id: 'floral1',
    url: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBwYXR0ZXJufGVufDF8fHx8MTc1NTc2MTM5Nnww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Floral Pattern',
    category: 'Nature'
  },

  // Abstract & Modern Art
  {
    id: 'abstract1',
    url: 'https://images.unsplash.com/flagged/photo-1567934150921-7632371abb32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhaW50aW5nfGVufDF8fHx8MTc1NTc2MTM4N3ww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Abstract Painting',
    category: 'Abstract',
    featured: true
  },
  {
    id: 'watercolor1',
    url: 'https://images.unsplash.com/photo-1629654858857-615c2c8be8a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTU3MTExODh8MA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Watercolor Background',
    category: 'Abstract'
  },
  {
    id: 'minimalist1',
    url: 'https://images.unsplash.com/photo-1683659635051-39336c5476b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJ0fGVufDF8fHx8MTc1NTcxNDMzNHww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Minimalist Art',
    category: 'Abstract'
  },
  {
    id: 'cosmic1',
    url: 'https://images.unsplash.com/photo-1660786254519-e899d4e2e405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBzcGFjZSUyMGFydHxlbnwxfHx8fDE3NTU3NjEzOTV8MA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Cosmic Space Art',
    category: 'Abstract'
  },
  {
    id: 'surreal1',
    url: 'https://images.unsplash.com/photo-1704123298707-d68f96152464?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXJyZWFsJTIwYXJ0fGVufDF8fHx8MTc1NTc2MTQwMXww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Surreal Art',
    category: 'Abstract'
  },

  // Geometric & Patterns
  {
    id: 'geometric1',
    url: 'https://images.unsplash.com/photo-1604782206219-3b9576575203?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBzaGFwZXN8ZW58MXx8fHwxNzU1NjY5NTE4fDA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Geometric Shapes',
    category: 'Geometric'
  },
  {
    id: 'geometric2',
    url: 'https://images.unsplash.com/photo-1704121113061-d174b9b9219b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyaWMlMjBhcnR8ZW58MXx8fHwxNzU1NzYxMzk2fDA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Geometric Art',
    category: 'Geometric'
  },
  {
    id: 'mandala1',
    url: 'https://images.unsplash.com/photo-1704423896061-b0a1057e20a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwcGF0dGVybnxlbnwxfHx8fDE3NTU3NjEzOTF8MA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Mandala Pattern',
    category: 'Geometric',
    featured: true
  },
  {
    id: 'patterns1',
    url: 'https://images.unsplash.com/photo-1486551937199-baf066858de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHBhdHRlcm5zfGVufDF8fHx8MTc1NTcwNTQ3MHww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Abstract Patterns',
    category: 'Geometric'
  },

  // Traditional & Cultural Art
  {
    id: 'japanese1',
    url: 'https://images.unsplash.com/photo-1687382130081-ebd36ecd38a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFydHxlbnwxfHx8fDE3NTU3NjEzOTF8MA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Japanese Art',
    category: 'Traditional',
    featured: true
  },
  {
    id: 'vintage1',
    url: 'https://images.unsplash.com/photo-1579541513287-3f17a5d8d62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwYXJ0fGVufDF8fHx8MTc1NTc2MTM4N3ww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Vintage Art',
    category: 'Traditional'
  },
  {
    id: 'oil1',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvaWwlMjBwYWludGluZ3xlbnwxfHx8fDE3NTU3NjEzOTl8MA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Oil Painting',
    category: 'Traditional'
  },

  // Digital & Modern
  {
    id: 'digital1',
    url: 'https://images.unsplash.com/photo-1634035302742-91206968e455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1NTY1NzIyM3ww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Digital Illustration',
    category: 'Digital'
  },
  {
    id: 'pop1',
    url: 'https://images.unsplash.com/photo-1619632973808-4acf8041df42?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3AlMjBhcnR8ZW58MXx8fHwxNzU1NzYxMzk2fDA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Pop Art',
    category: 'Digital'
  },
  {
    id: 'street1',
    url: 'https://images.unsplash.com/photo-1628522994788-53bc1b1502c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBhcnQlMjBncmFmZml0aXxlbnwxfHx8fDE3NTU3NjEzOTJ8MA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Street Art',
    category: 'Digital'
  },
  {
    id: 'typography1',
    url: 'https://images.unsplash.com/photo-1618605720320-7cc6d95367bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXBvZ3JhcGh5JTIwYXJ0fGVufDF8fHx8MTc1NTc2MTQwMHww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Typography Art',
    category: 'Digital'
  },

  // Textures & Backgrounds
  {
    id: 'marble1',
    url: 'https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjB0ZXh0dXJlfGVufDF8fHx8MTc1NTcxMTE4OHww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Marble Texture',
    category: 'Textures'
  },
  {
    id: 'texture1',
    url: 'https://images.unsplash.com/photo-1583591900414-7031eb309cb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZXh0dXJlJTIwcGFpbnR8ZW58MXx8fHwxNzU1NzYxMzkyfDA&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Paint Texture',
    category: 'Textures'
  },

  // Sketch & Drawing
  {
    id: 'sketch1',
    url: 'https://images.unsplash.com/photo-1608804375269-d077e2a2adaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2V0Y2glMjBkcmF3aW5nfGVufDF8fHx8MTc1NTc2MTQwMHww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Sketch Drawing',
    category: 'Sketches'
  },
  {
    id: 'collage1',
    url: 'https://images.unsplash.com/photo-1704634616614-281ace4a8bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsYWdlJTIwYXJ0fGVufDF8fHx8MTc1NTc2MTQwMHww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Collage Art',
    category: 'Sketches'
  },

  // Animals & Characters
  {
    id: 'animals1',
    url: 'https://images.unsplash.com/photo-1734417090592-796137b57a5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwYW5pbWFscyUyMHN0aWNrZXJzfGVufDF8fHx8MTc1NTc1OTQ4Nnww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Cute Animals',
    category: 'Characters'
  },
  {
    id: 'emoji1',
    url: 'https://images.unsplash.com/photo-1666152686644-6660da2f1c98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbW9qaSUyMGZhY2VzfGVufDF8fHx8MTc1NTc1OTQ4OHww&ixlib=rb-4.1.0&q=80&w=400',
    title: 'Emoji Faces',
    category: 'Characters'
  }
];

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  onSelectImage,
  onLoadCustomImage
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    'Featured', 'All', 'Abstract', 'Nature', 'Geometric', 'Traditional', 
    'Digital', 'Textures', 'Sketches', 'Characters'
  ];

  const getFilteredImages = () => {
    let filtered = predefinedImages;

    // Filter by category
    if (selectedCategory === 'Featured') {
      filtered = predefinedImages.filter(img => img.featured);
    } else if (selectedCategory !== 'All') {
      filtered = predefinedImages.filter(img => img.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredImages = getFilteredImages();

  const handleImageSelect = (imageUrl: string) => {
    onSelectImage(imageUrl);
    setIsOpen(false);
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadCustomImage(file);
      setIsOpen(false);
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'Featured') {
      return predefinedImages.filter(img => img.featured).length;
    } else if (category === 'All') {
      return predefinedImages.length;
    } else {
      return predefinedImages.filter(img => img.category === category).length;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-1">
          <ImageIcon className="w-4 h-4" />
          <span>Art Gallery</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Art Image Gallery</span>
            <Badge variant="secondary" className="text-xs">
              {predefinedImages.length} images
            </Badge>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full mt-4">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search art styles, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap flex items-center space-x-1"
              >
                {category === 'Featured' && <Star className="w-3 h-3" />}
                <span>{category}</span>
                <Badge variant="secondary" className="text-xs ml-1">
                  {getCategoryCount(category)}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Custom Upload */}
          <div className="mb-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomImageUpload}
                className="hidden"
              />
              <Button variant="outline" size="sm" className="flex items-center space-x-1 w-full">
                <Upload className="w-4 h-4" />
                <span>Upload Your Art</span>
              </Button>
            </label>
          </div>

          {/* Results info */}
          {searchQuery && (
            <div className="mb-3 text-sm text-gray-600">
              Found {filteredImages.length} images matching "{searchQuery}"
            </div>
          )}

          {/* Image Grid */}
          <div className="flex-1 overflow-y-auto">
            {filteredImages.length === 0 ? (
              <div className="text-center py-8">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No images found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4">
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:border-gray-400 transition-all hover:shadow-md group"
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <div className="aspect-square relative">
                      <ImageWithFallback
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      {image.featured && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-yellow-400 text-yellow-900 rounded-full p-1">
                            <Star className="w-3 h-3 fill-current" />
                          </div>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white rounded-full p-2 shadow-lg">
                            <ImageIcon className="w-4 h-4 text-gray-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm text-gray-900 truncate">{image.title}</p>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">
                          {image.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};