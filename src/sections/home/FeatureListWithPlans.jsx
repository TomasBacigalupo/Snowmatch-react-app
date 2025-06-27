import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
} from "@mui/material";

const features = [
  {
    title: "🎥 Corrección de Videos",
    description:
      "Los alumnos pueden subir videos para recibir correcciones personalizadas por instructores o inteligencia artificial.",
    plans: ["Básico", "Pro", "Premium"],
  },
  {
    title: "🤝 Match Clientes–Instructores",
    description:
      "Los visitantes pueden ver qué instructores están disponibles en el cerro y contactarlos directamente por WhatsApp.",
    plans: ["Básico", "Pro", "Premium"],
  },
  {
    title: "📱 Contenido en Redes Sociales",
    description:
      "Creamos y publicamos contenido del centro en nuestras redes sociales, aumentando la visibilidad de la escuela.",
    plans: ["Básico", "Pro", "Premium"],
  },
  {
    title: "🛍️ Publicación de Productos",
    description:
      "Permitimos que la escuela publique productos o servicios directamente en la app (como clases grupales o promociones).",
    plans: ["Básico", "Pro", "Premium"],
  },
  {
    title: "📅 Calendario Autogestionado",
    description:
      "Cada instructor puede configurar y manejar su disponibilidad desde la app de forma simple y rápida.",
    plans: ["Básico", "Pro", "Premium"],
  },
  {
    title: "🎿 Gestión de Clases Privadas",
    description:
      "Los instructores pueden gestionar sus clases privadas de manera independiente: disponibilidad, contacto y pagos.",
    plans: ["Pro", "Premium"],
  },
  {
    title: "🏔️ Gestión Integral de Escuela",
    description:
      "Una plataforma completa para administrar toda tu escuela de esquí: ventas online, walk-in, reportes y más.",
    plans: ["Premium"],
  },
];

export default function FeatureListWithPlans() {
  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{mb: 2}}>
        Cómo funciona Snowmatch
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}