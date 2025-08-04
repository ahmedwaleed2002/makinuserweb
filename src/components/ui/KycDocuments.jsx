import React from 'react';
import { storageService } from '../../services/storageService';

const KycDocuments = ({ 
  kycDocuments, 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-16 h-12',
    md: 'w-24 h-18',
    lg: 'w-32 h-24',
    xl: 'w-48 h-32'
  };

  // Parse KYC documents JSON string
  let documents = {};
  try {
    documents = kycDocuments ? JSON.parse(kycDocuments) : {};
  } catch (error) {
    console.error('Error parsing KYC documents:', error);
    return <div className="text-red-500 text-sm">Invalid KYC documents format</div>;
  }

  // If no documents, show placeholder
  if (!documents.front && !documents.back) {
    return (
      <div className="text-gray-500 text-sm">
        No KYC documents uploaded
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* Front Document */}
      {documents.front && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Identity Proof (Front)</h4>
          <div className={`${sizeClasses[size]} rounded-lg overflow-hidden border border-gray-300`}>
            <img
              src={storageService.getFilePreview(documents.front, 200, 150)}
              alt="Identity Front"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-document.png'; // Fallback image
              }}
            />
          </div>
          <a
            href={storageService.getFileView(documents.front)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            View Full Size
          </a>
        </div>
      )}

      {/* Back Document */}
      {documents.back && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Identity Proof (Back)</h4>
          <div className={`${sizeClasses[size]} rounded-lg overflow-hidden border border-gray-300`}>
            <img
              src={storageService.getFilePreview(documents.back, 200, 150)}
              alt="Identity Back"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/placeholder-document.png'; // Fallback image
              }}
            />
          </div>
          <a
            href={storageService.getFileView(documents.back)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            View Full Size
          </a>
        </div>
      )}
    </div>
  );
};

export default KycDocuments;
