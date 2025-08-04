import React from 'react';
import { User } from 'lucide-react';
import { storageService } from '../../services/storageService';

const ProfileImage = ({ 
  imageId, 
  size = 'md', 
  alt = 'Profile', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  // If no imageId provided, show default avatar
  if (!imageId) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center ${className}`}>
        <User className={`${iconSizeClasses[size]} text-gray-500`} />
      </div>
    );
  }

  // Get image URL from storage
  const imageUrl = storageService.getFilePreview(imageId, 200, 200);

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          // If image fails to load, show default avatar
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 items-center justify-center hidden`}>
        <User className={`${iconSizeClasses[size]} text-gray-500`} />
      </div>
    </div>
  );
};

export default ProfileImage;
