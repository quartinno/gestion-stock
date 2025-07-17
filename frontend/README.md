# Stock Management Frontend

This is the frontend application for the Stock Management System, built with React and Tailwind CSS. The application provides interfaces for managing inventory, clients, sales, and invoicing for retail businesses like supermarkets, drugstores, and parapharmacies.

## Project Structure

```
frontend/
├── public/              # Static files
├── src/                 # Source code
│   ├── assets/          # Images, icons, and other static assets
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Common UI components (buttons, cards, etc.)
│   │   ├── layout/      # Layout components (sidebar, header, etc.)
│   │   ├── forms/       # Form components
│   │   └── data/        # Data display components (tables, charts, etc.)
│   ├── contexts/        # React contexts for state management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   │   ├── auth/        # Authentication pages
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── products/    # Product management pages
│   │   ├── clients/     # Client management pages
│   │   ├── pos/         # Point of Sale pages
│   │   ├── invoices/    # Invoice management pages
│   │   └── reports/     # Reporting pages
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── .eslintrc.js         # ESLint configuration
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Features

- **Authentication**: Secure login with role-based access control
- **Dashboard**: Overview of key metrics and quick access to features
- **Product Management**: Add, edit, delete products with barcode scanning
- **Client Management**: Manage clients and their credit
- **Point of Sale (POS)**: Process sales with barcode scanning
- **Invoice Management**: Generate and manage invoices
- **Reporting**: Generate and export various reports

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

### Development

To start the development server:

```
npm run dev
```

or

```
yarn dev
```

This will start the Vite development server at `http://localhost:5173`.

### Building for Production

To build the application for production:

```
npm run build
```

or

```
yarn build
```

### Linting

To run ESLint:

```
npm run lint
```

or

```
yarn lint
```

## Vite Commands and Shortcuts

- `npm run dev` or `yarn dev`: Start the development server
- `npm run build` or `yarn build`: Build for production
- `npm run preview` or `yarn preview`: Preview the production build locally
- `npm run lint` or `yarn lint`: Run ESLint

## Component Development Guide

### Creating a New Component

1. Create a new file in the appropriate directory under `src/components/`
2. Use the following template:

```jsx
import React from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### Creating a New Page

1. Create a new file in the appropriate directory under `src/pages/`
2. Use the following template:

```jsx
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

const PageName = () => {
  return (
    <MainLayout>
      {/* Page content */}
    </MainLayout>
  );
};

export default PageName;
```

3. Add the page to the routes in `src/App.jsx`

## API Integration

The application uses Axios for API requests. API services are organized by domain in the `src/services/` directory.

Example:

```jsx
// src/services/productService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const getProducts = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/products`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// More methods...
```

## State Management

The application uses:
- React Context API for global state (auth, theme, etc.)
- React Query for server state
- Local component state for UI-specific state

## Styling

The application uses Tailwind CSS for styling. Custom components should follow the established design system.

## Internationalization

The application supports English, French, and Arabic using i18next.

## Testing

Unit tests are written using Jest and React Testing Library.

## Contributing

1. Follow the established project structure
2. Use consistent naming conventions
3. Write clean, maintainable code
4. Document your components and functions
5. Write tests for new features

## License

This project is proprietary and confidential.