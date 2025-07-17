import React, { useState } from 'react';

const Image = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/images/placeholder.svg',
  loading = 'lazy',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={handleError}
      {...props}
    />
  );
};

export default Image;