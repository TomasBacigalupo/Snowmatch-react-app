# Rental Management Admin Interface

## Overview

The Rental Management Admin Interface is a comprehensive tool for administrators to manage rental products (ski/snowboard equipment) in the SnowMatch platform. It provides full CRUD operations with an intuitive user interface.

## Features

### 🔍 Product Management
- **List Products**: View all rental products with pagination and filtering
- **Create Products**: Add new rental products with detailed information
- **Edit Products**: Modify existing product details and variants
- **Delete Products**: Remove products with confirmation dialog
- **Bulk Operations**: Select multiple products for batch actions

### 📊 Advanced Filtering
- **Search by Name**: Real-time search through product names
- **Filter by Category**: SKI, SNOWBOARD, POLES, BOOTS, COMBO
- **Filter by Status**: ACTIVE, INACTIVE, OUT_OF_STOCK
- **Filter by Resort**: Cerro Catedral, Chapelco, Las Leñas, etc.
- **Sort Options**: Sort by name, price, date created

### 🎯 Variant Management
- **Add Variants**: Create size/skill level/gender combinations
- **Edit Variants**: Modify existing variant details
- **Delete Variants**: Remove individual variants
- **Duplicate Prevention**: Automatic validation to prevent duplicate variants
- **Stock Tracking**: Manage total units and availability

### ✅ Form Validation
- **Required Fields**: Resort, category, description, image URL, price
- **Field Limits**: Name (255 chars), description (1000 chars), image URL (1024 chars)
- **Price Validation**: Must be positive number
- **URL Validation**: Valid image URL format
- **Variant Validation**: At least one variant required

## File Structure

```
src/
├── pages/dashboard/
│   └── AdminRental.js                    # Main admin page
├── sections/@dashboard/admin/rental/
│   ├── RentalFiltersBar.js              # Filter controls
│   └── RentalProductForm.js             # Product form with variants
├── redux/slices/
│   └── rental.js                        # Redux actions & state
├── _mock/rental/
│   └── rentalItems.js                   # Mock data for testing
└── routes/
    ├── paths.js                         # Route definitions
    └── index.js                         # Route configuration
```

## Components

### AdminRental
Main page component that includes:
- Product listing table with pagination
- Filter bar with search and advanced filters
- Create/Edit/Delete modals
- Success/Error notifications
- Bulk selection actions

### RentalFiltersBar
Filter component with:
- Search input with real-time filtering
- Category dropdown (SKI, SNOWBOARD, etc.)
- Status dropdown (ACTIVE, INACTIVE, OUT_OF_STOCK)
- Resort dropdown
- Clear filters button
- Collapsible advanced filters

### RentalProductForm
Comprehensive form for creating/editing products:
- Basic information fields (resort, category, name, description)
- Price and image URL inputs
- Image preview functionality
- Variant management with add/edit/delete
- Form validation with error messages
- Responsive design for mobile/desktop

## Data Model

### Rental Product
```javascript
{
  id: string,
  resortId: string,           // Required
  category: string,           // Required: SKI, SNOWBOARD, POLES, BOOTS, COMBO
  name: string,               // Optional, max 255 chars
  description: string,        // Required, max 1000 chars
  imageUrl: string,           // Required, max 1024 chars, valid URL
  pricePerDay: number,        // Required, >= 0
  status: string,             // ACTIVE, INACTIVE, OUT_OF_STOCK
  variants: Variant[]         // Required, at least one
}
```

### Variant
```javascript
{
  id: string,
  size: string,               // Required (e.g., "160cm", "M", "36")
  skillLevel: string,         // Required: BEGINNER, INTERMEDIATE, ADVANCED
  gender: string,             // Required: UNISEX, MEN, WOMEN, KIDS
  unitsTotal: number,         // Required, >= 0
  unitsAvailable: number      // Calculated field
}
```

## API Endpoints

The interface is designed to work with these REST endpoints:

- `GET /api/rental/items` - List products with filters
- `GET /api/rental/items/{id}` - Get single product
- `POST /api/admin/rental/items` - Create product
- `PUT /api/admin/rental/items/{id}` - Update product
- `DELETE /api/admin/rental/items/{id}` - Delete product
- `POST /api/admin/rental/items/{id}/variants` - Add variant
- `PUT /api/admin/rental/variants/{variantId}` - Update variant
- `DELETE /api/admin/rental/variants/{variantId}` - Delete variant

## Usage

### Accessing the Interface
1. Navigate to `/dashboard/admin/rental`
2. Must have ADMIN role to access
3. Available in the admin navigation menu

### Creating a New Product
1. Click "Nuevo Producto" button
2. Fill in required fields (resort, category, description, image URL, price)
3. Add at least one variant with size, skill level, gender, and units
4. Click "Crear" to save

### Editing a Product
1. Click the edit icon on any product row
2. Modify fields as needed
3. Add, edit, or remove variants
4. Click "Actualizar" to save changes

### Filtering Products
1. Use the search bar for quick name search
2. Click the filter icon to show advanced filters
3. Select category, status, or resort filters
4. Use "Limpiar filtros" to reset all filters

### Deleting Products
1. Click the delete icon on any product row
2. Confirm deletion in the dialog
3. Product will be removed from the list

## Mock Data

For testing purposes, the interface includes mock data with:
- 5 sample products across different categories
- Multiple variants per product
- Different resorts and statuses
- Realistic pricing and descriptions

## Future Enhancements

- **Image Upload**: Direct image upload instead of URL input
- **Bulk Import**: CSV import for multiple products
- **Advanced Analytics**: Product performance metrics
- **Inventory Alerts**: Low stock notifications
- **Export Functionality**: Export product data to CSV/Excel
- **Audit Trail**: Track changes and modifications
- **Multi-language Support**: Internationalization

## Technical Notes

- Built with React and Material-UI
- Uses Redux for state management
- Form validation without external libraries (no Formik)
- Responsive design for mobile and desktop
- Mock data for development/testing
- Ready for backend API integration 