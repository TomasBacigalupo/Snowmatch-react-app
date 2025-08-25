import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { RentalCartProvider } from '../../../contexts/RentalCartContext';
import ProductCard from '../ProductCard';
import theme from '../../../theme';

// Mock product data
const mockProduct = {
  id: 'test-ski',
  title: 'Test Ski',
  description: 'Test description',
  fromPricePerDay: 70,
  level: ['Intermediate', 'Advanced'],
  type: 'Ski',
  includes: ['Skis', 'Boots', 'Poles'],
  idealFor: 'Test ideal for',
  rating: 4.8,
  reviews: 124,
  images: ['/test-image.jpg'],
  sizes: ['150', '160', '170'],
  bootSizes: {
    US: ['6', '7', '8'],
    EU: ['38', '39', '40'],
    MP: ['24', '25', '26']
  },
  features: ['Feature 1', 'Feature 2']
};

// Mock the useRentalCart hook
jest.mock('../../../contexts/RentalCartContext', () => ({
  ...jest.requireActual('../../../contexts/RentalCartContext'),
  useRentalCart: () => ({
    addItem: jest.fn(),
    getDaysCount: () => 3,
  }),
}));

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <RentalCartProvider>
          {component}
        </RentalCartProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  test('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Ski')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('Test ideal for')).toBeInTheDocument();
    expect(screen.getByText('4.8 (124)')).toBeInTheDocument();
    expect(screen.getByText('$210')).toBeInTheDocument(); // 70 * 3 days
  });

  test('renders product badges correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Ski')).toBeInTheDocument();
  });

  test('renders includes chips correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Skis')).toBeInTheDocument();
    expect(screen.getByText('Boots')).toBeInTheDocument();
    expect(screen.getByText('Poles')).toBeInTheDocument();
  });

  test('renders size selectors correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Talla de esquí')).toBeInTheDocument();
    expect(screen.getByText('Talla de bota')).toBeInTheDocument();
  });

  test('add to cart button is disabled when no size is selected', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    const addButton = screen.getByText('Agregar al carrito');
    expect(addButton).toBeDisabled();
  });

  test('shows discount badge for 3+ days', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('-10% descuento por 3+ días')).toBeInTheDocument();
  });

  test('renders features correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
  });
}); 