import { useMemo } from 'react';

export const useWhatsAppLink = ({ phone, destino, dates, pax, nivel, pageUrl }) => {
  const whatsappLink = useMemo(() => {
    const baseUrl = 'https://wa.me/';
    const phoneNumber = phone.replace(/\D/g, ''); // Remove non-digits
    
    const message = `Hola Snowmatch 👋 Quiero armar mi viaje a ${destino}.
Fechas: ${dates?.checkin || 'Por definir'} → ${dates?.checkout || 'Por definir'}
Personas: ${pax?.adultos || 0} adultos, ${pax?.menores || 0} menores
Nivel: ${nivel || 'Por definir'}
Servicios: alojamiento, rentals, traslados, clases
Link de la landing: ${pageUrl}`;

    const encodedMessage = encodeURIComponent(message);
    
    return `${baseUrl}${phoneNumber}?text=${encodedMessage}`;
  }, [phone, destino, dates, pax, nivel, pageUrl]);

  return whatsappLink;
}; 