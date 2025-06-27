import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Check,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const features = [
  {
    label: "Corrección de Videos",
    basic: true,
    pro: true,
    premium: true,
  },
  {
    label: "Match Clientes–Instructores",
    basic: true,
    pro: true,
    premium: true,
  },
  {
    label: "Contenido en Redes Sociales",
    basic: true,
    pro: true,
    premium: true,
  },
  {
    label: "Publicación de Productos",
    basic: true,
    pro: true,
    premium: true,
  },
  {
    label: "Calendario Autogestionado",
    basic: true,
    pro: true,
    premium: true,
  },
  {
    label: "Gestión de Clases Privadas",
    basic: false,
    pro: true,
    premium: true,
  },
  {
    label: "Gestión Integral de Escuela",
    basic: false,
    pro: false,
    premium: true,
  },
];

export default function SubscriptionComparisonTable() {
  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom fontWeight="bold" sx={{mb: 2}}>
        Comparativa de Planes
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Funcionalidad</TableCell>
              <TableCell align="center">Básico</TableCell>
              <TableCell align="center">Pro</TableCell>
              <TableCell align="center">Premium</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell>{feature.label}</TableCell>
                <TableCell align="center">
                  {feature.basic && <CheckIcon color="success" />}
                </TableCell>
                <TableCell align="center">
                  {feature.pro && <CheckIcon color="success" />}
                </TableCell>
                <TableCell align="center">
                  {feature.premium && <CheckIcon color="success" />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}