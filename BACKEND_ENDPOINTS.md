# Endpoints del Backend para Completar Perfil

## Endpoint para completar perfil

### PUT /api/users/complete-profile

Este endpoint permite a los usuarios completar su información de perfil después del login con Google o Apple.

#### Request Body:
```json
{
  "firstName": "string",
  "lastName": "string", 
  "phone": "string (opcional)"
}
```

#### Response:
```json
{
  "success": true,
  "user": {
    "id": "number",
    "name": "string",
    "lastname": "string",
    "email": "string",
    "cellphone": "string",
    // ... otros campos del usuario
  }
}
```

## Endpoints existentes a modificar

### POST /api/auth/google/login

Modificar para aceptar los nuevos campos:

#### Request Body:
```json
{
  "idToken": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "displayName": "string"
}
```

### POST /api/auth/apple/login

Modificar para aceptar los nuevos campos:

#### Request Body:
```json
{
  "idToken": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string"
}
```

## Lógica del Backend

### Para Google Login:
1. Verificar el ID token con Google
2. Si el usuario no existe, crear uno nuevo con los datos proporcionados
3. Si el usuario existe, actualizar los datos faltantes
4. Si no se proporcionan firstName/lastName, intentar extraerlos del displayName
5. Retornar el usuario con token

### Para Apple Login:
1. Verificar el ID token con Apple
2. Si el usuario no existe, crear uno nuevo con los datos proporcionados
3. Si el usuario existe, actualizar los datos faltantes
4. Retornar el usuario con token

### Para Complete Profile:
1. Verificar que el usuario esté autenticado
2. Actualizar los campos name, lastname y cellphone
3. Retornar el usuario actualizado

## Validaciones

- firstName y lastName son obligatorios
- phone es opcional
- Los campos deben ser strings no vacíos
- Validar formato de email si se proporciona
- Validar formato de teléfono si se proporciona

## Manejo de Errores

```json
{
  "success": false,
  "error": "string",
  "messages": {
    "entry": [
      {
        "key": "fieldName",
        "value": "error message"
      }
    ]
  }
}
```

## Ejemplo de Implementación (Node.js/Express)

```javascript
// PUT /api/users/complete-profile
app.put('/api/users/complete-profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const userId = req.user.id;

    // Validaciones
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        messages: {
          entry: [
            { key: 'firstName', value: 'El nombre es obligatorio' },
            { key: 'lastName', value: 'El apellido es obligatorio' }
          ]
        }
      });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: firstName.trim(),
        lastname: lastName.trim(),
        cellphone: phone ? phone.trim() : undefined
      },
      { new: true }
    );

    res.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});
``` 