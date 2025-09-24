import React, { useState } from 'react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Layout, Image as ImageIcon, Palette, Star } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';

interface ArtTemplatesProps {
  onSelectTemplate: (templateUrl: string) => void;
}

const artTemplates = [
  {
    id: 'template-1',
    url: 'https://images.unsplash.com/photo-1629654858857-615c2c8be8a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmNvbG9yJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTU3MTExODh8MA&ixlib=rb-4.1.0&q=80&w=800',
    title: 'Watercolor Canvas',
    description: 'Perfect for digital painting',
    category: 'Painting',
    featured: true
  },
  {
    id: 'template-2',
    url: 'https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJibGUlMjB0ZXh0dXJlfGVufDF8fHx8MTc1NTcxMTE4OHww&ixlib=rb-4.1.0&q=80&w=800',
    title: 'Marble Background',
    description: 'Elegant marble texture base',
    category: 'Texture',
    featured: true
  },
  {
    id: 'template-3',
    url: 'https://images.unsplash.com/photo-1704423896061-b0a1057e20a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kYWxhJTIwcGF0dGVybnxlbnwxfHx8fDE3NTU3NjEzOTF8MA&ixlib=rb-4.1.0&q=80&w=800',
    title: 'Mandala Base',
    description: 'Sacred geometry template',
    category: 'Geometric'
  },
  {
    id: 'template-4',
    url: 'https://images.unsplash.com/photo-1687382130081-ebd36ecd38a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMGFydHxlbnwxfHx8fDE3NTU3NjEzOTF8MA&ixlib=rb-4.1.0&q=80&w=800',
    title: 'Japanese Art Style',
    description: 'Traditional Japanese aesthetic',
    category: 'Traditional'
  },
  {
    id: 'template-5',
    url: 'https://images.unsplash.com/photo-1577083165633-14ebcdb0f658?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBwYXR0ZXJufGVufDF8fHx8MTc1NTc2MTM5Nnww&ixlib=rb-4.1.0&q=80&w=800',
    title: 'Floral Framework',
    description: 'Nature-inspired canvas',
    category: 'Nature'
  },
  {
    id: 'template-6',
    url: 'https://images.unsplash.com/photo-1660786254519-e899d4e2e405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBzcGFjZSUyMGFydHxlbnwxfHx8fDE3NTU3NjEzOTV8MA&ixlib=rb-4.1.0&q=80&w=800',
    title: 'Cosmic Space',
    description: 'Galaxy and stars background',
    category: 'Abstract'
  }
];

export const ArtTemplates: React.FC<ArtTemplatesProps> = ({
  onSelectTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Featured');
  const [isOpen, setIsOpen] = useState(false);

  const categories = ['Featured', 'All', 'Painting', 'Texture', 'Geometric', 'Traditional', 'Nature', 'Abstract'];

  const getFilteredTemplates = () => {
    if (selectedCategory === 'Featured') {
      return artTemplates.filter(template => template.featured);
    } else if (selectedCategory === 'All') {
      return artTemplates;
    } else {
      return artTemplates.filter(template => template.category === selectedCategory);
    }
  };

  const filteredTemplates = getFilteredTemplates();

  const handleTemplateSelect = (templateUrl: string) => {
    onSelectTemplate(templateUrl);
    setIsOpen(false);
  };

  const getCategoryCount = (category: string) => {
    if (category === 'Featured') {
      return artTemplates.filter(template => template.featured).length;
    } else if (category === 'All') {
      return artTemplates.length;
    } else {
      return artTemplates.filter(template => template.category === category).length;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-1">
          <Layout className="w-4 h-4" />
          <span>Templates</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <Layout className="w-5 h-5" />
            <span>Art Templates</span>
            <Badge variant="secondary" className="text-xs">
              {artTemplates.length} templates
            </Badge>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full mt-4">
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

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="relative bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:border-gray-400 transition-all hover:shadow-md group"
                  onClick={() => handleTemplateSelect(template.url)}
                >
                  <div className="aspect-video relative">
                    <ImageWithFallback
                      src={template.url}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                    {template.featured && (
                      <div className="absolute top-2 right-2">
                        <div className="bg-yellow-400 text-yellow-900 rounded-full p-1">
                          <Star className="w-3 h-3 fill-current" />
                        </div>
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-white rounded-full p-3 shadow-lg">
                          <Palette className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{template.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};