# 🏔️ Resort Transformation Utility

## 📋 Descripción

Función utilitaria para transformar los valores de resorts de la API a formato amigable para mostrar en la UI, manteniendo los valores originales para el backend.

## 🚀 Uso

### Importación

```javascript
import { resortTransformation } from 'src/utils/resortTransformation';

// O importar funciones específicas
import { 
  resortTransformation, 
  getResortDisplayName, 
  getResortCategory,
  transformResortsForUI 
} from 'src/utils/resortTransformation';
```

### Ejemplos de Uso

#### 1. Transformar un solo resort para mostrar

```javascript
import { resortTransformation } from 'src/utils/resortTransformation';

// En un componente
const resortValue = "CERRO_CATEDRAL";
const displayName = resortTransformation(resortValue);
console.log(displayName); // "Cerro Catedral"

// En JSX
<Typography>{resortTransformation(filters.resort)}</Typography>
```

#### 2. Transformar datos de resorts para autocomplete

```javascript
import { transformResortsForUI } from 'src/utils/resortTransformation';

// Datos de la API
const apiResorts = [
  { "value": "CERRO_CATEDRAL" },
  { "value": "CHAPELCO" },
  { "value": "LAS_LEÑAS" }
];

// Transformar para UI
const uiResorts = transformResortsForUI(apiResorts);
console.log(uiResorts);
// [
//   { name: "Cerro Catedral", category: "Argentina", value: "CERRO_CATEDRAL" },
//   { name: "Chapelco", category: "Argentina", value: "CHAPELCO" },
//   { name: "Las Leñas", category: "Argentina", value: "LAS_LEÑAS" }
// ]

// Usar en autocomplete
<Autocomplete
  options={uiResorts}
  getOptionLabel={(option) => option.name}
  getOptionValue={(option) => option.value}
  groupBy={(option) => option.category}
/>
```

#### 3. Obtener solo el nombre de display

```javascript
import { getResortDisplayName } from 'src/utils/resortTransformation';

const displayName = getResortDisplayName("VALLE_NEVADO");
console.log(displayName); // "Valle Nevado"
```

#### 4. Obtener la categoría del resort

```javascript
import { getResortCategory } from 'src/utils/resortTransformation';

const category = getResortCategory("CERRO_CATEDRAL");
console.log(category); // "Argentina"

const category2 = getResortCategory("PORTILLO");
console.log(category2); // "Chile"
```

#### 5. Con fallback para valores inválidos

```javascript
import { getResortDisplayNameWithFallback } from 'src/utils/resortTransformation';

const displayName = getResortDisplayNameWithFallback("CERRO_CATEDRAL", "Resort no encontrado");
console.log(displayName); // "Cerro Catedral"

const fallbackName = getResortDisplayNameWithFallback("", "Resort no encontrado");
console.log(fallbackName); // "Resort no encontrado"
```

## 📊 Transformaciones

### Ejemplos de Transformación

| Valor API | Display Name | Categoría |
|-----------|--------------|-----------|
| `CERRO_CATEDRAL` | Cerro Catedral | Argentina |
| `LAS_LEÑAS` | Las Leñas | Argentina |
| `VALLE_NEVADO` | Valle Nevado | Chile |
| `PORTILLO` | Portillo | Chile |
| `TREBLE_CONE` | Treble Cone | Nueva Zelanda |
| `PERISHER` | Perisher | Australia |

### Categorías por País

- **Argentina**: CERRO, CHAPELCO, LA_HOYA, LAS_LEÑAS, BAYO, PENITENTES, LAGO_HERMOSO
- **Chile**: NEVADO, PARVA, COLORADO, PORTILLO, CHILLAN, CORRALCO, ANTUCO
- **Nueva Zelanda**: TREBLE, CARDRONA, REMARKABLES, CORONET, HUTT, TUKINO
- **Australia**: PERISHER, THREDBO, FALLS, BULLER, HOTHAM, SELWYN

## 🎯 Casos de Uso

### 1. Mostrar resort seleccionado en filtros
```javascript
// En lugar de mostrar "CERRO_CATEDRAL"
<Typography>{filters.resort}</Typography>

// Mostrar "Cerro Catedral"
<Typography>{resortTransformation(filters.resort)}</Typography>
```

### 2. Lista de resorts en autocomplete
```javascript
// Transformar datos de API para autocomplete
const resorts = transformResortsForUI(apiResorts);

<Autocomplete
  options={resorts}
  getOptionLabel={(option) => option.name}  // Muestra: "Cerro Catedral"
  getOptionValue={(option) => option.value} // Guarda: "CERRO_CATEDRAL"
/>
```

### 3. Botones de resorts rápidos
```javascript
// Botones con valores correctos
{[
  {title: "Catedral", value: "CERRO_CATEDRAL"},
  {title: "Chapelco", value: "CHAPELCO"}
].map((resort) => (
  <Button 
    key={resort.value}
    onClick={() => setValue("resort", resort.value)}
  >
    {resort.title}
  </Button>
))}
```

## 🔧 Funciones Disponibles

### `resortTransformation(resortValue)`
- **Parámetros**: `resortValue` (string) - Valor del resort de la API
- **Retorna**: string - Nombre de display transformado
- **Uso**: Función principal para transformar resorts

### `getResortDisplayName(resortValue)`
- **Parámetros**: `resortValue` (string) - Valor del resort de la API
- **Retorna**: string - Nombre de display
- **Uso**: Obtener solo el nombre de display

### `getResortCategory(resortValue)`
- **Parámetros**: `resortValue` (string) - Valor del resort de la API
- **Retorna**: string - Categoría/país del resort
- **Uso**: Obtener la categoría para agrupar

### `transformResortsForUI(resortsData)`
- **Parámetros**: `resortsData` (array) - Array de resorts de la API
- **Retorna**: array - Array transformado con name, category, value
- **Uso**: Transformar múltiples resorts para UI

### `getResortDisplayNameWithFallback(resortValue, fallback)`
- **Parámetros**: 
  - `resortValue` (string) - Valor del resort de la API
  - `fallback` (string) - Texto de fallback
- **Retorna**: string - Nombre de display o fallback
- **Uso**: Transformar con fallback para valores inválidos

## ✅ Beneficios

1. **Reutilizable**: Una sola función para toda la aplicación
2. **Consistente**: Misma transformación en todos los componentes
3. **Mantenible**: Cambios centralizados en un solo lugar
4. **Robusto**: Manejo de errores y fallbacks
5. **Flexible**: Múltiples funciones para diferentes casos de uso

## 🚀 ¡Listo para Usar!

La función `resortTransformation` está disponible para ser importada y usada en cualquier componente que necesite mostrar nombres de resorts de forma amigable.

```javascript
import { resortTransformation } from 'src/utils/resortTransformation';

// ¡Usa la función donde necesites mostrar resorts!
<Typography>{resortTransformation(resortValue)}</Typography>
```
