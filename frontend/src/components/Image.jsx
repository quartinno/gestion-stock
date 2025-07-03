import styles from './Image.module.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

const Image = ({ src, alt, size = 'medium', caption, className, ...props }) => {
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    setIsError(true);
  };

  return (
    <div className={`${styles.imageContainer} ${styles[size]} ${className || ''}`}>
      {isError ? (
        <div className={styles.fallback}>Image not available</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={styles.image}
          loading="lazy"
          onError={handleError}
          {...props}
        />
      )}
      {caption && <p className={styles.caption}>{caption}</p>}
    </div>
  );
};

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  caption: PropTypes.string,
  className: PropTypes.string,
};

export default Image;