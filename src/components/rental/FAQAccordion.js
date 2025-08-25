import { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

// ----------------------------------------------------------------------

const faqs = [
  {
    question: '¿Cómo funciona el alquiler de equipos?',
    answer: 'Simplemente selecciona tu destino, fechas y equipos. Nosotros te llevamos todo al hotel, departamento o al pie del cerro. Incluye ajuste profesional y retiro al finalizar.',
  },
  {
    question: '¿Qué incluye el alquiler?',
    answer: 'Cada paquete incluye esquí/snowboard, botas, bastones (para esquí) y ajuste profesional. También puedes agregar extras como casco, guantes, protección y seguro.',
  },
  {
    question: '¿Puedo cambiar el equipo si no me queda bien?',
    answer: '¡Absolutamente! Incluimos cambios sin costo durante tu estadía. Nuestro equipo está disponible en pista para ajustes y cambios.',
  },
  {
    question: '¿Cuál es la política de cancelación?',
    answer: 'Puedes cancelar hasta 24 horas antes de la entrega sin cargo. Cancelaciones con menos de 24 horas tienen un cargo del 50%.',
  },
  {
    question: '¿Qué pasa si hay mal tiempo?',
    answer: 'Si el cerro está cerrado por mal tiempo, reprogramamos tu entrega sin cargo o te damos un crédito para usar en otra fecha.',
  },
  {
    question: '¿Necesito reservar con anticipación?',
    answer: 'Recomendamos reservar con al menos 48 horas de anticipación, especialmente en temporada alta. También ofrecemos entrega express con 2 horas de anticipación.',
  },
  {
    question: '¿Qué talles tienen disponibles?',
    answer: 'Tenemos una amplia gama de talles para adultos y niños. Si no estás seguro de tu talle, lo ajustamos al entregar. También puedes especificar tus medidas en el checkout.',
  },
  {
    question: '¿Incluyen seguro?',
    answer: 'El alquiler básico no incluye seguro, pero puedes agregarlo por $8 por día. Cubre daños accidentales y pérdida del equipo.',
  },
];

// ----------------------------------------------------------------------

export default function FAQAccordion() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
        Preguntas frecuentes
      </Typography>
      
      <Stack spacing={2}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            sx={{
              borderRadius: 2,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              sx={{
                '&.Mui-expanded': {
                  minHeight: 56,
                },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
} 