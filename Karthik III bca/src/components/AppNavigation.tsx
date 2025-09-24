import React, { useState } from 'react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { User, Palette, ArrowLeft } from 'lucide-react';

interface AppNavigationProps {
  currentView: 'drawing' | 'profile';
  onViewChange: (view: 'drawing' | 'profile') => void;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentView,
  onViewChange
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentView === 'profile' ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewChange('drawing')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Drawing</span>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-gray-900">Drawing Studio</h1>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {currentView === 'drawing' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewChange('profile')}
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </Button>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <span className="hidden sm:inline">{user.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};