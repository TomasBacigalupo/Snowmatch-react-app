/**
 * Reusable stat card component for displaying metrics
 */

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const StatCard = ({
  title,
  value,
  unit,
  color = 'primary',
  size = 'medium',
  icon,
  subtitle,
}) => {
  const getColorValue = (color) => {
    const colors = {
      primary: '#1976d2',
      secondary: '#dc004e',
      success: '#2e7d32',
      warning: '#ed6c02',
      error: '#d32f2f',
      info: '#0288d1',
    };
    return colors[color] || colors.primary;
  };

  const getSizeStyles = (size) => {
    const sizes = {
      small: {
        padding: '12px',
        titleFontSize: '0.75rem',
        valueFontSize: '1.25rem',
        unitFontSize: '0.75rem',
      },
      medium: {
        padding: '16px',
        titleFontSize: '0.875rem',
        valueFontSize: '1.5rem',
        unitFontSize: '0.875rem',
      },
      large: {
        padding: '20px',
        titleFontSize: '1rem',
        valueFontSize: '2rem',
        unitFontSize: '1rem',
      },
    };
    return sizes[size] || sizes.medium;
  };

  const sizeStyles = getSizeStyles(size);
  const colorValue = getColorValue(color);

  return (
    <Paper
      elevation={0}
      sx={{
        padding: sizeStyles.padding,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${colorValue}08 0%, ${colorValue}15 100%)`,
        border: `1px solid ${colorValue}30`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${colorValue} 0%, ${colorValue}80 100%)`,
        },
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: `0 12px 40px ${colorValue}20`,
          border: `1px solid ${colorValue}50`,
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box flex={1}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: sizeStyles.titleFontSize,
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 0.5,
            }}
          >
            {title}
          </Typography>
          
          <Box display="flex" alignItems="baseline" gap={0.5}>
            <Typography
              variant="h4"
              component="span"
              sx={{
                fontSize: sizeStyles.valueFontSize,
                fontWeight: 700,
                color: colorValue,
                lineHeight: 1,
              }}
            >
              {typeof value === 'number' ? value.toFixed(1) : value}
            </Typography>
            
            {unit && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: sizeStyles.unitFontSize,
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                {unit}
              </Typography>
            )}
          </Box>
          
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.75rem',
                marginTop: 0.5,
                display: 'block',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {icon && (
          <Box
            sx={{
              color: colorValue,
              opacity: 0.7,
              marginLeft: 1,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

// Specialized stat cards for common ski metrics
export const SpeedCard = ({ speed, maxSpeed }) => (
  <StatCard
    title="Current Speed"
    value={speed}
    unit="km/h"
    color="primary"
    subtitle={maxSpeed ? `Max: ${maxSpeed.toFixed(1)} km/h` : undefined}
  />
);

export const DistanceCard = ({ distance }) => (
  <StatCard
    title="Distance"
    value={distance / 1000}
    unit="km"
    color="success"
  />
);

export const DurationCard = ({ duration }) => {
  const formatDuration = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <StatCard
      title="Duration"
      value={formatDuration(duration)}
      color="info"
    />
  );
};

export const VerticalCard = ({ ascent, descent }) => (
  <StatCard
    title="Vertical"
    value={descent}
    unit="m"
    color="warning"
    subtitle={`+${ascent.toFixed(0)}m / -${descent.toFixed(0)}m`}
  />
);

export const SegmentCard = ({ kind, confidence }) => {
  const getSegmentColor = (kind) => {
    switch (kind) {
      case 'DOWNHILL': return 'error';
      case 'UPHILL': return 'success';
      default: return 'info';
    }
  };

  const getSegmentText = (kind) => {
    switch (kind) {
      case 'DOWNHILL': return 'Downhill';
      case 'UPHILL': return 'Uphill/Lift';
      default: return 'Unknown';
    }
  };

  return (
    <StatCard
      title="Current Segment"
      value={getSegmentText(kind)}
      color={getSegmentColor(kind)}
      subtitle={confidence ? `Confidence: ${(confidence * 100).toFixed(0)}%` : undefined}
    />
  );
};

export const CurveCountCard = ({ curveCount, isTurning }) => (
  <StatCard
    title="Curves"
    value={curveCount}
    color={isTurning ? 'secondary' : 'primary'}
    subtitle={isTurning ? 'Turning...' : undefined}
  />
);

export const AverageSpeedCard = ({ avgSpeed, maxSpeed }) => (
  <StatCard
    title="Avg Speed"
    value={avgSpeed}
    unit="km/h"
    color="success"
    subtitle={maxSpeed ? `Max: ${maxSpeed.toFixed(1)} km/h` : undefined}
  />
);
