import React, { useState } from 'react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ 
  src, 
  alt, 
  className = "w-full h-64 object-cover rounded-lg",
  fallbackText = "Image not available"
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if this is a valid image source
  const isValidImage = src && 
    src !== 'undefined' && 
    !src.includes('undefined') && 
    (src.startsWith('data:') || (!src.includes('fake-upload.com') && (src.startsWith('http') || src.startsWith('/'))));

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!isValidImage || hasError) {
    return (
      <div className={`${className} bg-muted/30 flex items-center justify-center`}>
        <div className="text-center text-muted-foreground">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm">{fallbackText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-muted/30 flex items-center justify-center absolute inset-0`}>
          <div className="text-center text-muted-foreground">
            <div className="animate-spin text-2xl mb-2">⏳</div>
            <p className="text-sm">Loading image...</p>
          </div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
};
