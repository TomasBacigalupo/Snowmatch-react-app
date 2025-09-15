# Travel Agency Landing Page

## Descripción

Landing page enfocada en agencias de viajes que quieran vender clases y equipos de esquí a través de Snowmatch. Diseñada con un enfoque profesional y orientado a conversión.

## Características

### 🎯 Secciones Principales

1. **Hero Section**
   - Título: "Ofrecé clases y equipos de esquí con Snowmatch"
   - Subtítulo: "La forma más simple para que tu agencia venda experiencias de nieve con soporte 24/7"
   - CTAs principales: "Cotizar ahora" y "Ver beneficios"

2. **Stepper de Cotización**
   - **Paso 1**: Selección de tipo de clases (grupales o particulares)
   - **Paso 2**: Cantidad de personas
   - **Paso 3**: Fechas y equipos (incluye o no equipos)
   - **Paso 4**: Información de contacto de la agencia
   - Al completar, envía mensaje prellenado por WhatsApp

3. **Beneficios para Agencias**
   - Soporte 24/7 de Snowmatch
   - Ayuda en cotización y reservas
   - Confianza en instructores y equipos verificados

4. **Cómo Funciona**
   - Paso 1: Cotizá
   - Paso 2: Compartí con tu cliente
   - Paso 3: Snowmatch coordina y da soporte

5. **Testimonios**
   - Testimonios de agencias partners existentes
   - Social proof para generar confianza

6. **CTA Final**
   - Botón principal: "Empezá a vender experiencias con Snowmatch"
   - Botón secundario: "Contactar por WhatsApp"

### 🎨 Diseño

- **Look profesional y limpio**: Diseño moderno con gradientes y animaciones sutiles
- **Orientado a conversión**: CTAs claros y flujo de usuario optimizado
- **Responsive**: Adaptado para desktop, tablet y móvil
- **SEO optimizado**: Meta tags, structured data y optimización para motores de búsqueda

### 🔧 Funcionalidades Técnicas

- **Stepper interactivo**: Formulario paso a paso con validación
- **Integración WhatsApp**: Envío automático de cotizaciones por WhatsApp
- **Multiidioma**: Soporte para español, inglés, portugués y francés
- **Animaciones**: Transiciones suaves con Framer Motion
- **Formularios inteligentes**: Validación en tiempo real
- **SEO Avanzado**: Meta tags, JSON-LD estructurado y optimización completa

## Rutas

La landing page está disponible en las siguientes rutas con prefijo de idioma:

- `/es/agencias` (español)
- `/en/travel-agency` (inglés)
- `/pt/agencias` (portugués)
- `/fr/agencias` (francés)

También se puede acceder desde las rutas sin prefijo:
- `/agencias` (ruta base)

## Integración WhatsApp

El formulario genera automáticamente un mensaje estructurado con toda la información de la cotización y lo envía por WhatsApp al número de Snowmatch (+54 9 2944703443).

### Formato del mensaje:
```
🏔️ *Cotización para Agencia de Viajes - Snowmatch*

👤 *Información de la agencia:*
• Agencia: [Nombre]
• Contacto: [Contacto]
• Email: [Email]
• Teléfono: [Teléfono]

🎿 *Detalles del servicio:*
• Tipo de clase: [Grupales/Particulares]
• Cantidad de personas: [Número]
• Fecha inicio: [Fecha]
• Fecha fin: [Fecha]
• Incluye equipos: [Sí/No]

💬 *Mensaje adicional:*
[Comentarios]

📅 *Fecha de solicitud:* [Fecha actual]
🌐 *Página:* [URL actual]
```

## Archivos Modificados

1. **`src/pages/TravelAgencyLanding.jsx`** - Componente principal
2. **`src/routes/paths.js`** - Agregada ruta `travelAgency: '/agencias'` y objeto `PATH_TRAVEL_AGENCY` con rutas por idioma
3. **`src/routes/index.js`** - Agregadas rutas para todos los idiomas con prefijo correspondiente

## Uso

Para acceder a la landing page:

1. Navegar a `/agencias` desde la aplicación
2. Completar el stepper de cotización
3. La información se enviará automáticamente por WhatsApp

## Personalización

El componente está diseñado para ser fácilmente personalizable:

- **Textos**: Todos los textos están hardcodeados en español, pero pueden ser movidos a archivos de traducción
- **Estilos**: Los estilos están definidos inline pero pueden ser extraídos a archivos CSS
- **Colores**: La paleta de colores puede ser modificada en las propiedades `sx`
- **Contenido**: Los testimonios, beneficios y pasos pueden ser actualizados desde las constantes del componente

## SEO Implementado

### 📊 Meta Tags Completos
- **Título dinámico**: Cambia según el idioma
- **Descripción optimizada**: Usa las traducciones
- **Keywords**: Palabras clave en múltiples idiomas
- **Canonical URL**: URL canónica con prefijo de idioma
- **Robots**: index, follow para mejor indexación

### 🌐 Open Graph & Twitter Cards
- **Open Graph completo**: title, description, image, locale
- **Twitter Cards**: summary_large_image
- **Imágenes optimizadas**: 1200x630px para redes sociales
- **Locale dinámico**: Según el idioma (es_ES, en_US, pt_BR)

### 🏷️ JSON-LD Structured Data
- **Service Schema**: Información del servicio para agencias
- **Organization Schema**: Datos de la empresa Snowmatch
- **Breadcrumb Schema**: Navegación estructurada
- **WebPage Schema**: Información de la página
- **Contact Information**: Teléfono, email, redes sociales

### 🗺️ Geo Tags
- **Ubicación geográfica**: Argentina, Río Negro
- **Coordenadas**: Bariloche/San Martín de los Andes
- **Región**: AR-R (Argentina - Río Negro)

### ⚡ Performance
- **Preconnect**: Google Fonts y recursos externos
- **DNS Prefetch**: WhatsApp para mejor carga
- **Theme Color**: Color de marca para móviles
- **Apple Meta Tags**: Optimización para iOS

## Próximas Mejoras

- [x] ~~Integrar con sistema de traducciones (i18n)~~
- [ ] Agregar más testimonios y casos de éxito
- [ ] Implementar tracking de conversiones
- [ ] Agregar formulario de contacto adicional
- [ ] Integrar con CRM para seguimiento de leads
- [ ] Crear imágenes OG específicas para cada idioma
- [ ] Implementar sitemap dinámico
