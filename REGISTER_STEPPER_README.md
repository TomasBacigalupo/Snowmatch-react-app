# Registro con Stepper - SnowMatch

## Descripción

Se ha rediseñado el proceso de registro de instructores para utilizar un enfoque de stepper (pasos) que guía al usuario a través de todo el proceso de creación de perfil de manera más intuitiva y organizada.

## Características Principales

### 🎯 **Proceso por Pasos**
- **5 pasos organizados** que dividen el registro en secciones lógicas
- **Validación por paso** para asegurar que cada sección esté completa antes de continuar
- **Navegación flexible** que permite volver a pasos anteriores

### 📋 **Pasos del Registro**

1. **Información Básica**
   - Nombre y apellido
   - Email
   - Teléfono y código de país
   - Contraseña

2. **Certificación**
   - Entidad certificadora (AADIDESS, PSIA, ENISSCHAG)
   - Subida de certificado

3. **Perfil Personal**
   - Foto de perfil
   - Género
   - País

4. **Especialidades**
   - Disciplinas (Ski, SnowBoard)
   - Idiomas que habla
   - Deportes
   - Resorts donde trabaja

5. **Información Adicional**
   - Escuela
   - Habilidades adicionales
   - Información rápida
   - Descripción detallada

### ✨ **Características de UX**

- **Indicador de progreso** que muestra el porcentaje completado
- **Iconos personalizados** para cada paso
- **Validación en tiempo real** con mensajes de error claros
- **Persistencia de datos** - la información se guarda paso a paso
- **Diseño responsivo** que funciona en móviles y desktop
- **Navegación por clic** en los pasos completados

### 🔄 **Flujo de Datos**

1. **Registro inicial** con información básica y certificación
2. **Actualización del perfil** con datos adicionales
3. **Subida de foto de perfil** (opcional)
4. **Persistencia completa** de todos los datos del usuario

## Archivos Modificados

### Nuevos Archivos
- `src/sections/auth/register/RegisterStepperForm.js` - Componente principal del stepper
- `REGISTER_STEPPER_README.md` - Esta documentación

### Archivos Actualizados
- `src/sections/auth/register/index.js` - Exporta el nuevo componente
- `src/pages/auth/Register.js` - Usa el nuevo formulario con stepper

## Uso

El nuevo formulario se activa automáticamente en la página de registro de instructores (`/auth/register`). Los usuarios verán:

1. Un stepper visual con 5 pasos
2. Indicador de progreso
3. Formularios organizados por categorías
4. Validación paso a paso
5. Mensaje de confirmación al completar

## Beneficios

### Para el Usuario
- **Experiencia más clara** y organizada
- **Menos abrumador** que un formulario largo
- **Feedback visual** del progreso
- **Posibilidad de guardar** y continuar después

### Para el Sistema
- **Datos más completos** desde el registro inicial
- **Mejor calidad** de perfiles de instructores
- **Reducción de abandono** en el proceso de registro
- **Datos estructurados** más fáciles de procesar

## Tecnologías Utilizadas

- **Material-UI Stepper** para la navegación por pasos
- **React Hook Form** para manejo de formularios
- **Yup** para validación
- **Redux** para persistencia de datos
- **Iconify** para iconos personalizados

## Próximas Mejoras

- [ ] Guardado automático de borradores
- [ ] Previsualización del perfil antes de completar
- [ ] Animaciones entre pasos
- [ ] Integración con análisis de comportamiento
- [ ] Personalización de pasos según el tipo de instructor 