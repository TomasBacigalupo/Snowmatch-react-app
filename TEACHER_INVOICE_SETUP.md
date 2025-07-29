# Configuración de Facturas para Instructores

## Variables de Entorno Requeridas

Agrega las siguientes variables a tu archivo `.env`:

```env
# Tarifas por hora según nivel del instructor
REACT_APP_LEVEL_ONE_HOURLY_RATE=1000
REACT_APP_LEVEL_TWO_HOURLY_RATE=1200
REACT_APP_LEVEL_THREE_HOURLY_RATE=1400
REACT_APP_LEVEL_FOUR_HOURLY_RATE=1600
REACT_APP_LEVEL_FIVE_HOURLY_RATE=1800
```

## Funcionalidad Implementada

### 1. Cálculo de Horas (`src/utils/calculateHours.js`)
- `calculateEventHours(event)`: Calcula las horas de un evento individual (máximo 6 horas por día)
- `calculateTotalEventHours(eventList)`: Calcula el total de horas de una lista de eventos

### 2. Cálculo de Pago (`src/utils/calculateTeacherPay.js`)
- `calculateTeacherPay(level, eventList)`: Calcula el total a cobrar basado en el nivel del instructor y las horas
- `getHourlyRateByLevel(level)`: Obtiene la tarifa por hora según el nivel del instructor

### 3. Componente de Subida de Facturas (`src/components/InvoiceUpload.js`)
- Interfaz para seleccionar y subir archivos (PDF, JPEG, PNG)
- Validación de tipo y tamaño de archivo (máximo 5MB)
- Muestra el total a cobrar calculado
- Simulación de subida (necesita integración con API)

### 4. Integración en BookingCard
- Botón "Subir Factura" aparece solo para:
  - Instructores (role: TEACHER)
  - Reservas en resort Catedral
  - Reservas aceptadas y completadas
- Drawer dedicado para la subida de facturas

## Uso

1. El instructor ve el botón "Subir Factura" en sus reservas de Catedral completadas
2. Al hacer clic, se abre un drawer con el formulario de subida
3. Se muestra el total a cobrar calculado automáticamente
4. El instructor puede seleccionar un archivo y subirlo
5. El sistema valida el archivo y procesa la subida

## Próximos Pasos

1. Implementar la API para subir facturas
2. Agregar validaciones adicionales según requerimientos del negocio
3. Implementar notificaciones de estado de factura
4. Agregar historial de facturas subidas 