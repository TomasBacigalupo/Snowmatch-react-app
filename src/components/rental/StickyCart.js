import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Tooltip,
  Drawer,
} from '@mui/material';
import {
  ShoppingCart,
  ExpandMore,
  ExpandLess,
  Delete,
  Add,
  Remove,
  ArrowForward,
} from '@mui/icons-material';
import { useRentalCart } from '../../contexts/RentalCartContext';
import { PATH_GUEST } from '../../routes/paths';
import useAuth from '../../hooks/useAuth';
import Login from '../../pages/auth/Login';

// ----------------------------------------------------------------------

export default function StickyCart({ variant = 'bottom' }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    items,
    upsells,
    getTotal,
    getItemsCount,
    getDaysCount,
    removeItem,
    updateItemQuantity,
    removeUpsell,
    deliveryDate,
    pickupDate,
    location,
  } = useRentalCart();

  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Show cart when items are added
  React.useEffect(() => {
    if (items.length > 0) {
      setIsVisible(true);
    }
  }, [items.length]);

  // Close login modal when user successfully authenticates
  React.useEffect(() => {
    if (isAuthenticated && loginModalOpen) {
      setLoginModalOpen(false);
    }
  }, [isAuthenticated, loginModalOpen]);

  const total = getTotal();
  const itemsCount = getItemsCount();
  const daysCount = getDaysCount();
  const discount = daysCount >= 3 ? total * 0.1 : 0;
  const finalTotal = total - discount;

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(index);
    } else {
      updateItemQuantity(index, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
    } else {
      navigate(PATH_GUEST.rentalCheckout);
    }
  };

  if (!isVisible || items.length === 0) {
    return null;
  }

  const cartContent = (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: (theme) => theme.customShadows.z24,
        overflow: 'hidden',
        ...(variant === 'bottom' && {
          position: 'fixed',
          bottom: 'calc(56px + env(safe-area-inset-bottom) + 16px)',
          left: 16,
          right: 16,
          zIndex: 1000,
          maxWidth: 400,
          mx: 'auto',
        }),
        ...(variant === 'right' && {
          position: 'fixed',
          top: 100,
          right: 16,
          width: 320,
          zIndex: 1000,
        }),
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          color: 'text.primary',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Badge badgeContent={itemsCount} color="secondary">
              <ShoppingCart />
            </Badge>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Carrito ({itemsCount})
            </Typography>
          </Stack>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </Stack>
      </Box>

      {/* Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Items List */}
          <List dense sx={{ mb: 2 }}>
            {items.map((item, index) => (
              <ListItem
                key={`${item.id}-${item.size}-${item.bootSize}`}
                sx={{ px: 0 }}
                secondaryAction={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(index, item.quantity - 1)}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ minWidth: 20, textAlign: 'center' }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(index, item.quantity + 1)}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem(index)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={item.image}
                    variant="rounded"
                    sx={{ width: 40, height: 40 }}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {item.size}cm • Bota {item.bootSize} {item.bootSizeSystem}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ${item.price}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            ))}
          </List>

          {/* Upsells */}
          {upsells.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Extras:
              </Typography>
              <List dense>
                {upsells.map((upsell) => (
                  <ListItem
                    key={upsell.id}
                    sx={{ px: 0 }}
                    secondaryAction={
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeUpsell(upsell.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={upsell.title}
                      secondary={`$${upsell.price}${upsell.pricePerDay ? '/día' : ''}`}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Summary */}
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2">Subtotal:</Typography>
              <Typography variant="body2">${total}</Typography>
            </Stack>
            
            {discount > 0 && (
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="success.main">
                  Descuento ({daysCount}+ días):
                </Typography>
                <Typography variant="body2" color="success.main">
                  -${discount}
                </Typography>
              </Stack>
            )}
            
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ${finalTotal}
              </Typography>
            </Stack>
          </Stack>

          {/* Dates Info */}
          {deliveryDate && pickupDate && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Fechas:
              </Typography>
              <Chip
                label={`${new Date(deliveryDate).toLocaleDateString('es-ES')} - ${new Date(pickupDate).toLocaleDateString('es-ES')}`}
                size="small"
                variant="outlined"
              />
            </Box>
          )}

          {/* Checkout Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleCheckout}
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            Continuar al checkout
          </Button>

          {/* Savings Note */}
          {daysCount >= 3 && (
            <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
              ¡Ahorras ${discount} por alquilar {daysCount}+ días!
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );

  return (
    <>
      {cartContent}
      
      {/* Login Modal */}
      <Drawer
        anchor="bottom"
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            height: '90vh',
            maxHeight: '90vh',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: 40, height: 6, borderRadius: 3, bgcolor: 'grey.300' }} />
        </Box>
        <Login fromModal={true} />
      </Drawer>
    </>
  );
} 