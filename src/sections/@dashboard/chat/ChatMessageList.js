import PropTypes from 'prop-types';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
//
import Scrollbar from '../../../components/Scrollbar';
import LightboxModal from '../../../components/LightboxModal';
import ChatMessageItem from './ChatMessageItem';

// ----------------------------------------------------------------------

ChatMessageList.propTypes = {
  conversation: PropTypes.object.isRequired,
};

export default function ChatMessageList({ conversation }) {
  const scrollRef = useRef(null);
  const simpleBarRef = useRef(null);
  const bottomRef = useRef(null);

  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  useLayoutEffect(() => {
    const scrollMessagesToBottom = () => {
      // Método 1: Usar scrollIntoView en el elemento de referencia
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        return;
      }
      
      // Método 2: Intentar con SimpleBar
      if (simpleBarRef.current && simpleBarRef.current.getScrollElement) {
        const scrollElement = simpleBarRef.current.getScrollElement();
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
          return;
        }
      }
      
      // Método 3: Buscar el elemento scrollable manualmente
      const scrollableElement = document.querySelector('.simplebar-content-wrapper');
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
        return;
      }
      
      // Último fallback
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    };
    
    // Ejecutar inmediatamente y también con un pequeño delay
    scrollMessagesToBottom();
    setTimeout(scrollMessagesToBottom, 50);
  }, [conversation.messages]);

  const imagesLightbox = conversation.messages
    .filter((messages) => messages.contentType === 'image')
    .map((messages) => messages.body);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  return (
    <>
      <Scrollbar 
        scrollableNodeProps={{ ref: scrollRef }} 
        sx={{ p: 3, height: 1 }}
        ref={simpleBarRef}
      >
        {conversation?.messages?.map((message) => (
          <ChatMessageItem
            key={message.id}
            message={message}
            conversation={conversation}
            onOpenLightbox={handleOpenLightbox}
          />
        ))}
        <div ref={bottomRef} style={{ height: '1px' }} />
      </Scrollbar>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </>
  );
}
