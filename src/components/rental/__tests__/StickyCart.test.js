import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import { RentalCartProvider } from '../../../contexts/RentalCartContext';
import StickyCart from '../StickyCart';
import theme from '../../../theme';

// Mock the useRentalCart hook
const mockCartContext = {
  items: [
    {
      id: 'test-ski',
      title: 'Test Ski',
      price: 210,
      size: '170',
      bootSize: '8',
      bootSizeSystem: 'US',
      quantity: 1,
      image: '/test-image.jpg'
    }
  ],
  upsells: [
    {
      id: 'helmet',
      title: 'Casco',
      price: 15
    }
  ],
  getTotal: () => 225,
  getItemsCount: () => 1,
  getDaysCount: () => 3,
  removeItem: jest.fn(),
  updateItemQuantity: jest.fn(),
  removeUpsell: jest.fn(),
  deliveryDate: '2024-01-15',
  pickupDate: '2024-01-18',
  location: 'bariloche'
};

jest.mock('../../../contexts/RentalCartContext', () => ({
  ...jest.requireActual('../../../contexts/RentalCartContext'),
  useRentalCart: () => mockCartContext,
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

describe('StickyCart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders cart header with item count', () => {
    renderWithProviders(<StickyCart />);
    
    expect(screen.getByText('Carrito (1)')).toBeInTheDocument();
  });

  test('shows cart items when expanded', () => {
    renderWithProviders(<StickyCart />);
    
    // Click to expand
    const header = screen.getByText('Carrito (1)').closest('div');
    fireEvent.click(header);
    
    expect(screen.getByText('Test Ski')).toBeInTheDocument();
    expect(screen.getByText('170cm • Bota 8 US')).toBeInTheDocument();
    expect(screen.getByText('$210')).toBeInTheDocument();
  });

  test('shows upsells when expanded', () => {
    renderWithProviders(<StickyCart />);
    
    // Click to expand
    const header = screen.getByText('Carrito (1)').closest('div');
    fireEvent.click(header);
    
    expect(screen.getByText('Extras:')).toBeInTheDocument();
    expect(screen.getByText('Casco')).toBeInTheDocument();
    expect(screen.getByText('$15')).toBeInTheDocument();
  });

  test('shows total and discount', () => {
    renderWithProviders(<StickyCart />);
    
    // Click to expand
    const header = screen.getByText('Carrito (1)').closest('div');
    fireEvent.click(header);
    
    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('$225')).toBeInTheDocument();
    expect(screen.getByText('Descuento (3+ días):')).toBeInTheDocument();
    expect(screen.getByText('-$22.5')).toBeInTheDocument();
    expect(screen.getByText('$202.5')).toBeInTheDocument();
  });

  test('shows dates information', () => {
    renderWithProviders(<StickyCart />);
    
    // Click to expand
    const header = screen.getByText('Carrito (1)').closest('div');
    fireEvent.click(header);
    
    expect(screen.getByText('15/1/2024 - 18/1/2024')).toBeInTheDocument();
  });

  test('shows checkout button', () => {
    renderWithProviders(<StickyCart />);
    
    // Click to expand
    const header = screen.getByText('Carrito (1)').closest('div');
    fireEvent.click(header);
    
    expect(screen.getByText('Continuar al checkout')).toBeInTheDocument();
  });

  test('shows savings note for 3+ days', () => {
    renderWithProviders(<StickyCart />);
    
    // Click to expand
    const header = screen.getByText('Carrito (1)').closest('div');
    fireEvent.click(header);
    
    expect(screen.getByText(/¡Ahorras \$22.5 por alquilar 3\+ días!/)).toBeInTheDocument();
  });

  test('does not render when no items', () => {
    const emptyCartContext = {
      ...mockCartContext,
      items: [],
      getItemsCount: () => 0
    };

    jest.doMock('../../../contexts/RentalCartContext', () => ({
      ...jest.requireActual('../../../contexts/RentalCartContext'),
      useRentalCart: () => emptyCartContext,
    }));

    const { container } = renderWithProviders(<StickyCart />);
    expect(container.firstChild).toBeNull();
  });
}); 