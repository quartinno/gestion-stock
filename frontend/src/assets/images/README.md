# Assets Images Directory

This directory contains images that are imported and bundled with your React components.

## Usage

Place images here when you need to:
- Import them directly in JavaScript/JSX files
- Have them processed by Webpack/Vite (optimization, hashing)
- Use them as module imports

### Example Usage:

```jsx
// Import the image
import logo from '@/assets/images/logo.png';
// or
import productImage from '../../assets/images/products/product1.jpg';

// Use in your component
function Header() {
  return (
    <div>
      <img src={logo} alt="Company Logo" />
    </div>
  );
}
```

## Benefits

- Images are optimized during build
- Automatic cache busting with hashed filenames
- TypeScript support for imports
- Better for component-specific images

## File Structure

Organize your images by feature or type:
- `logos/` - Company and brand logos
- `products/` - Product images
- `backgrounds/` - Background images
- `illustrations/` - UI illustrations and graphics