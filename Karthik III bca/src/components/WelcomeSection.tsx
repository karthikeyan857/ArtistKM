import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Palette, 
  Image as ImageIcon, 
  Brush, 
  Download, 
  Users, 
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Heart,
  Star
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WelcomeSectionProps {
  onGetStarted: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Brush className="w-6 h-6 text-blue-500" />,
      title: "Professional Drawing Tools",
      description: "Advanced brush system with 40+ colors, customizable sizes, and smooth drawing experience"
    },
    {
      icon: <ImageIcon className="w-6 h-6 text-green-500" />,
      title: "Rich Art Gallery",
      description: "20+ categorized art images, templates, and the ability to upload your own images"
    },
    {
      icon: <Download className="w-6 h-6 text-purple-500" />,
      title: "Export & Save",
      description: "Save your artwork as high-quality PNG files and build your personal gallery"
    },
    {
      icon: <Monitor className="w-6 h-6 text-orange-500" />,
      title: "Cross-Platform",
      description: "Optimized for web, mobile, and tablet devices with responsive design"
    }
  ];

  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Active Artists", value: "10K+" },
    { icon: <Palette className="w-5 h-5" />, label: "Artworks Created", value: "50K+" },
    { icon: <ImageIcon className="w-5 h-5" />, label: "Art Templates", value: "20+" },
    { icon: <Star className="w-5 h-5" />, label: "User Rating", value: "4.9" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Digital Art Studio
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Create Anywhere
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A powerful web-based drawing application with professional tools, rich art galleries, 
            and seamless cross-platform experience. Create stunning digital artwork with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Palette className="w-5 h-5 mr-2" />
              Start Creating
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-3"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              View Gallery
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-8">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>Fast & Responsive</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>User Friendly</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>Professional Tools</span>
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className="flex justify-center mb-2 text-blue-500">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade tools and features designed for artists, designers, and creative minds
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {feature.icon}
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Device Compatibility */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Works on All Your Devices
                </h3>
                <p className="text-gray-600 mb-6">
                  Optimized for desktop, tablet, and mobile with responsive design
                </p>
                
                <div className="flex items-center justify-center space-x-8">
                  <div className="text-center">
                    <Monitor className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Desktop</span>
                  </div>
                  <div className="text-center">
                    <Tablet className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Tablet</span>
                  </div>
                  <div className="text-center">
                    <Smartphone className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Mobile</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Start Creating?
              </h3>
              <p className="text-blue-100 mb-6">
                Join thousands of artists already using our platform to create amazing digital art
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={onGetStarted}
                className="text-lg bg-white text-blue-600 hover:bg-gray-100"
              >
                <Palette className="w-5 h-5 mr-2" />
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};