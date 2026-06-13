import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { getRentalProviders } from '../../../../redux/slices/rental';

// ----------------------------------------------------------------------

const SKILL_LEVEL_OPTIONS = [
  { value: 'BEGINNER', label: 'Principiante' },
  { value: 'INTERMEDIATE', label: 'Intermedio' },
  { value: 'ADVANCED', label: 'Avanzado' },
];

const GENDER_OPTIONS = [
  { value: 'UNISEX', label: 'Unisex' },
  { value: 'MEN', label: 'Hombre' },
  { value: 'WOMEN', label: 'Mujer' },
  { value: 'KIDS', label: 'Niños' },
];

const RESORT_OPTIONS = [
  { value: 'CERRO_CATEDRAL', label: 'Cerro Catedral' },
  { value: 'CERRO_CASTOR', label: 'Cerro Castor' },
  { value: 'CHAPELCO', label: 'Chapelco' },
  { value: 'LA_HOYA', label: 'La Hoya' },
  { value: 'LAS_LEÑAS', label: 'Las Leñas' },
  { value: 'CERRO_BAYO', label: 'Cerro Bayo' },
];

// Validation functions
const validateProduct = (values) => {
  const errors = {};
  
  if (!values.resortId) errors.resortId = 'Resort es requerido';
  if (!values.category) errors.category = 'Categoría es requerida';
  if (values.name && values.name.length > 255) errors.name = 'Máximo 255 caracteres';
  if (!values.description) errors.description = 'Descripción es requerida';
  else if (values.description.length > 1000) errors.description = 'Máximo 1000 caracteres';
  if (!values.imageUrl) errors.imageUrl = 'URL de imagen es requerida';
  else if (!isValidUrl(values.imageUrl)) errors.imageUrl = 'URL inválida';
  else if (values.imageUrl.length > 1024) errors.imageUrl = 'Máximo 1024 caracteres';
  if (!values.pricePerDay || values.pricePerDay < 0) errors.pricePerDay = 'Precio debe ser mayor o igual a 0';
  if (!values.variants || values.variants.length === 0) errors.variants = 'Al menos una variante es requerida';
  
  return errors;
};

const validateVariant = (values) => {
  const errors = {};
  
  if (!values.size) errors.size = 'Talle es requerido';
  if (!values.skillLevel) errors.skillLevel = 'Nivel es requerido';
  if (!values.gender) errors.gender = 'Género es requerido';
  if (!values.unitsTotal || values.unitsTotal < 0) errors.unitsTotal = 'Unidades debe ser mayor o igual a 0';
  
  return errors;
};

const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

function itemToFormValues(item, lockResort) {
  if (!item) {
    return {
      resortId: lockResort || 'CERRO_CATEDRAL',
      category: '',
      name: '',
      description: '',
      imageUrl: '',
      pricePerDay: 0,
      rentalProviderId: '',
      variants: [],
    };
  }
  return {
    resortId: item.resortId != null && item.resortId !== '' ? String(item.resortId) : '',
    category: item.category != null ? String(item.category) : '',
    name: item.name ?? '',
    description: item.description ?? '',
    imageUrl: item.imageUrl ?? '',
    pricePerDay: item.pricePerDay != null ? Number(item.pricePerDay) : 0,
    rentalProviderId:
      item.rentalProviderId != null && item.rentalProviderId !== ''
        ? String(item.rentalProviderId)
        : item.rentalProvider?.id != null
          ? String(item.rentalProvider.id)
          : '',
    variants: Array.isArray(item.variants)
      ? item.variants.map((v) => ({
          id: v.id,
          size: v.size ?? '',
          skillLevel: v.skillLevel != null ? String(v.skillLevel) : '',
          gender: v.gender != null ? String(v.gender) : '',
          unitsTotal: v.unitsTotal != null ? Number(v.unitsTotal) : 0,
          unitsAvailable: v.unitsAvailable,
        }))
      : [],
  };
}

// ----------------------------------------------------------------------

export default function RentalProductForm({ item, onSave, onCancel, categoryOptions = [], lockResort = null }) {
  const dispatch = useDispatch();
  const rentalProviders = useSelector((state) => state.rental.providers);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
  const [editingVariantIndex, setEditingVariantIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(() => (item?.imageUrl ? String(item.imageUrl) : ''));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState(() => itemToFormValues(item, lockResort));

  const itemSyncKey = item?.id != null ? String(item.id) : 'create';

  useEffect(() => {
    setFormData(itemToFormValues(item, lockResort));
    setErrors({});
    setTouched({});
    setImagePreview(item?.imageUrl ? String(item.imageUrl) : '');
    setOpenVariantDialog(false);
    setEditingVariantIndex(null);
  }, [itemSyncKey]);

  // Update image preview when imageUrl changes
  useEffect(() => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl);
    }
  }, [formData.imageUrl]);

  useEffect(() => {
    if (formData.resortId) {
      dispatch(getRentalProviders({ resortId: formData.resortId }));
    }
  }, [dispatch, formData.resortId]);

  const handleChange = (field, value) => {
    if (field === 'resortId') {
      setFormData((prev) => ({ ...prev, resortId: value, rentalProviderId: '' }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    if (field !== 'resortId' && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (field === 'resortId' && errors.resortId) {
      setErrors((prev) => ({ ...prev, resortId: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateProduct(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSave(formData);
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
    
    setIsSubmitting(false);
  };

  const handleAddVariant = () => {
    setEditingVariantIndex(null);
    setOpenVariantDialog(true);
  };

  const handleEditVariant = (index) => {
    setEditingVariantIndex(index);
    setOpenVariantDialog(true);
  };

  const handleDeleteVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSaveVariant = (variantData) => {
    const newVariants = [...formData.variants];
    
    if (editingVariantIndex !== null) {
      const prevId = formData.variants[editingVariantIndex]?.id;
      newVariants[editingVariantIndex] = prevId != null ? { ...variantData, id: prevId } : variantData;
    } else {
      // Add new variant
      newVariants.push(variantData);
    }
    
    setFormData(prev => ({ ...prev, variants: newVariants }));
    setOpenVariantDialog(false);
    setEditingVariantIndex(null);
  };

  const isVariantDuplicate = (variantData, excludeIndex = null) => {
    return formData.variants.some((variant, index) => {
      if (excludeIndex !== null && index === excludeIndex) return false;
      return (
        variant.size === variantData.size &&
        variant.skillLevel === variantData.skillLevel &&
        variant.gender === variantData.gender
      );
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Información Básica
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={touched.resortId && Boolean(errors.resortId)}>
              <InputLabel>Resort *</InputLabel>
              <Select
                name="resortId"
                value={formData.resortId}
                onChange={(e) => handleChange('resortId', e.target.value)}
                onBlur={() => handleBlur('resortId')}
                label="Resort *"
                disabled={Boolean(lockResort)}
              >
                {(lockResort
                  ? RESORT_OPTIONS.filter((option) => option.value === lockResort)
                  : RESORT_OPTIONS
                ).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {touched.resortId && errors.resortId && (
                <FormHelperText>{errors.resortId}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="rental-product-provider-label">Proveedor (opcional)</InputLabel>
              <Select
                labelId="rental-product-provider-label"
                label="Proveedor (opcional)"
                value={formData.rentalProviderId || ''}
                onChange={(e) => handleChange('rentalProviderId', e.target.value)}
              >
                <MenuItem value="">
                  <em>Sin proveedor</em>
                </MenuItem>
                {(Array.isArray(rentalProviders) ? rentalProviders : []).map((p) => (
                  <MenuItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Proveedores del resort seleccionado</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={touched.category && Boolean(errors.category)}>
              <InputLabel>Categoría *</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                label="Categoría *"
              >
                {categoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {touched.category && errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="name"
              label="Nombre (opcional)"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
              inputProps={{ maxLength: 255 }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              label="Descripción *"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              error={touched.description && Boolean(errors.description)}
              helperText={
                (touched.description && errors.description) ||
                `${formData.description.length}/1000`
              }
              inputProps={{ maxLength: 1000 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="pricePerDay"
              label="Precio por día *"
              type="number"
              value={formData.pricePerDay}
              onChange={(e) => handleChange('pricePerDay', parseFloat(e.target.value) || 0)}
              onBlur={() => handleBlur('pricePerDay')}
              error={touched.pricePerDay && Boolean(errors.pricePerDay)}
              helperText={touched.pricePerDay && errors.pricePerDay}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              name="imageUrl"
              label="URL de imagen *"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              onBlur={() => handleBlur('imageUrl')}
              error={touched.imageUrl && Boolean(errors.imageUrl)}
              helperText={touched.imageUrl && errors.imageUrl}
              inputProps={{ maxLength: 1024 }}
            />
          </Grid>

          {/* Image Preview */}
          {imagePreview && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={imagePreview}
                  variant="rounded"
                  sx={{ width: 80, height: 80 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Vista previa de la imagen
                </Typography>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
              Variantes ({formData.variants.length})
            </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddVariant}
                variant="outlined"
                size="small"
              >
                Agregar Variante
              </Button>
            </Box>

            {touched.variants && errors.variants && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.variants}
              </Alert>
            )}

            {/* Variants List */}
            <Stack spacing={2}>
              {formData.variants.map((variant, index) => (
                <Card key={variant.id != null ? String(variant.id) : `new-${index}`} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={`Talle: ${variant.size}`} size="small" />
                        <Chip 
                          label={SKILL_LEVEL_OPTIONS.find(opt => opt.value === variant.skillLevel)?.label || variant.skillLevel} 
                          size="small" 
                          color="primary" 
                        />
                        <Chip 
                          label={GENDER_OPTIONS.find(opt => opt.value === variant.gender)?.label || variant.gender} 
                          size="small" 
                          color="secondary" 
                        />
                        <Chip label={`${variant.unitsTotal} unidades`} size="small" variant="outlined" />
                      </Box>
                      <Box>
                        <Tooltip title="Editar">
                          <IconButton size="small" onClick={() => handleEditVariant(index)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteVariant(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 2 }}>
              <Button onClick={onCancel} variant="outlined">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : (item ? 'Actualizar' : 'Crear')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Variant Dialog */}
      <VariantDialog
        open={openVariantDialog}
        onClose={() => setOpenVariantDialog(false)}
        onSave={handleSaveVariant}
        variant={editingVariantIndex !== null ? formData.variants[editingVariantIndex] : null}
        isDuplicate={isVariantDuplicate}
        excludeIndex={editingVariantIndex}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function VariantDialog({ open, onClose, onSave, variant, isDuplicate, excludeIndex }) {
  const [formData, setFormData] = useState({
    size: '',
    skillLevel: '',
    gender: '',
    unitsTotal: 0,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open && variant) {
      setFormData({
        size: variant.size,
        skillLevel: variant.skillLevel,
        gender: variant.gender,
        unitsTotal: variant.unitsTotal,
      });
    } else if (open) {
      setFormData({
        size: '',
        skillLevel: '',
        gender: '',
        unitsTotal: 0,
      });
    }
    setErrors({});
    setTouched({});
  }, [open, variant]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateVariant(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      if (isDuplicate(formData, excludeIndex)) {
        alert('Ya existe una variante con esta combinación de talle, nivel y género');
        return;
      }
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {variant ? 'Editar Variante' : 'Nueva Variante'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="size"
                label="Talle *"
                value={formData.size}
                onChange={(e) => handleChange('size', e.target.value)}
                onBlur={() => handleBlur('size')}
                error={touched.size && Boolean(errors.size)}
                helperText={touched.size && errors.size}
                placeholder="ej: 160cm, M, 36"
              />
            </Grid>

            <Grid item xs={12} md={6}>
                          <FormControl fullWidth error={touched.skillLevel && Boolean(errors.skillLevel)}>
              <InputLabel>Nivel *</InputLabel>
              <Select
                name="skillLevel"
                value={formData.skillLevel}
                onChange={(e) => handleChange('skillLevel', e.target.value)}
                onBlur={() => handleBlur('skillLevel')}
                label="Nivel *"
              >
                  {SKILL_LEVEL_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {touched.skillLevel && errors.skillLevel && (
                  <FormHelperText>{errors.skillLevel}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
                          <FormControl fullWidth error={touched.gender && Boolean(errors.gender)}>
              <InputLabel>Género *</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                onBlur={() => handleBlur('gender')}
                label="Género *"
              >
                  {GENDER_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {touched.gender && errors.gender && (
                  <FormHelperText>{errors.gender}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="unitsTotal"
                label="Unidades totales *"
                type="number"
                value={formData.unitsTotal}
                onChange={(e) => handleChange('unitsTotal', parseInt(e.target.value) || 0)}
                onBlur={() => handleBlur('unitsTotal')}
                error={touched.unitsTotal && Boolean(errors.unitsTotal)}
                helperText={touched.unitsTotal && errors.unitsTotal}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {variant ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 