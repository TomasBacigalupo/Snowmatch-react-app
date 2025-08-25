# Rental Management API Endpoints

## Overview

El formulario de creación de productos de rental ahora hace llamadas reales a la API. Aquí están todos los endpoints que se utilizan:

## Endpoints Configurados

### 1. Obtener Lista de Productos
```javascript
GET /api/rental/items
```
**Parámetros de query:**
- `page` - Número de página (default: 0)
- `size` - Tamaño de página (default: 20)
- `name` - Filtro por nombre (opcional)
- `category` - Filtro por categoría (opcional)
- `status` - Filtro por estado (opcional)
- `resortId` - Filtro por resort (opcional)
- `sortBy` - Campo para ordenar (opcional)
- `sortOrder` - Orden (asc/desc) (opcional)

**Ejemplo:**
```
GET /api/rental/items?page=0&size=20&category=SKI&status=ACTIVE
```

### 2. Crear Nuevo Producto ⭐
```javascript
POST /api/admin/rental/items
```
**Body:**
```json
{
  "resortId": "cerro-catedral",
  "category": "SKI",
  "name": "Ski Atomic Redster",
  "description": "Ski de alto rendimiento para esquiadores avanzados",
  "imageUrl": "https://example.com/image.jpg",
  "pricePerDay": 45.00,
  "variants": [
    {
      "size": "160cm",
      "skillLevel": "ADVANCED",
      "gender": "UNISEX",
      "unitsTotal": 5
    }
  ]
}
```

### 3. Obtener Producto Individual
```javascript
GET /api/rental/items/{id}
```

### 4. Actualizar Producto
```javascript
PUT /api/admin/rental/items/{id}
```
**Body:** Mismo formato que crear, pero solo se actualizan los campos enviados

### 5. Eliminar Producto
```javascript
DELETE /api/admin/rental/items/{id}
```

### 6. Agregar Variante a Producto
```javascript
POST /api/admin/rental/items/{id}/variants
```
**Body:**
```json
{
  "size": "170cm",
  "skillLevel": "INTERMEDIATE",
  "gender": "MEN",
  "unitsTotal": 3
}
```

### 7. Actualizar Variante
```javascript
PUT /api/admin/rental/variants/{variantId}
```
**Body:** Mismo formato que agregar variante

### 8. Eliminar Variante
```javascript
DELETE /api/admin/rental/variants/{variantId}
```

## Validaciones del Frontend

### Producto
- `resortId`: Requerido
- `category`: Requerido (SKI, SNOWBOARD, POLES, BOOTS, COMBO)
- `name`: Opcional, máximo 255 caracteres
- `description`: Requerido, máximo 1000 caracteres
- `imageUrl`: Requerido, URL válida, máximo 1024 caracteres
- `pricePerDay`: Requerido, número >= 0
- `variants`: Requerido, array con al menos una variante

### Variante
- `size`: Requerido
- `skillLevel`: Requerido (BEGINNER, INTERMEDIATE, ADVANCED)
- `gender`: Requerido (UNISEX, MEN, WOMEN, KIDS)
- `unitsTotal`: Requerido, número >= 0

## Flujo de Creación de Producto

1. **Usuario llena el formulario** en `/dashboard/admin/rental`
2. **Validación frontend** - Se validan todos los campos
3. **POST a API** - Se envía `POST /api/admin/rental/items` con los datos
4. **Respuesta exitosa** - Se muestra mensaje "Producto creado exitosamente"
5. **Actualización de lista** - Se recarga la lista de productos
6. **Cierre de modal** - Se cierra el formulario

## Manejo de Errores

### Errores de Validación
- Se muestran debajo de cada campo con error
- Los errores se limpian cuando el usuario empieza a escribir

### Errores de API
- Se muestran como notificaciones toast
- Se capturan en el Redux slice
- Se muestran mensajes específicos del servidor

## Headers Requeridos

Todas las llamadas incluyen:
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Si es requerido
}
```

## Autenticación

Los endpoints de admin (`/api/admin/rental/*`) requieren:
- Rol: `ROLE_ADMIN`
- Token de autenticación válido

## Testing

Para probar sin backend, puedes:
1. Comentar las llamadas reales en `src/redux/slices/rental.js`
2. Descomentar el código de mock data
3. Los datos mock se usarán en lugar de la API

## Logs de Desarrollo

Para ver las llamadas a la API en la consola del navegador:
1. Abre DevTools (F12)
2. Ve a la pestaña Network
3. Filtra por "api/rental"
4. Crea/edita/elimina productos
5. Verás todas las llamadas HTTP en tiempo real 