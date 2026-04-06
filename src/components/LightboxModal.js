import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/counter.css';

// ----------------------------------------------------------------------

LightboxModal.propTypes = {
  images: PropTypes.array.isRequired,
  photoIndex: PropTypes.number,
  setPhotoIndex: PropTypes.func,
  isOpen: PropTypes.bool,
  onCloseRequest: PropTypes.func,
  mainSrc: PropTypes.string,
};

export default function LightboxModal({
  images,
  photoIndex = 0,
  setPhotoIndex,
  isOpen,
  onCloseRequest,
  mainSrc: _mainSrc,
}) {
  const slides = useMemo(
    () =>
      (images || [])
        .filter(Boolean)
        .map((item) => {
          if (typeof item === 'string') {
            return { src: item };
          }
          if (item && typeof item === 'object' && item.src) {
            return { src: item.src };
          }
          return { src: String(item) };
        }),
    [images]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const maxIndex = Math.max(0, slides.length - 1);
  const safeIndex = Math.min(Math.max(0, photoIndex ?? 0), maxIndex);

  return (
    <Lightbox
      open={Boolean(isOpen && slides.length > 0)}
      close={() => onCloseRequest?.()}
      slides={slides}
      index={safeIndex}
      on={{ view: ({ index: idx }) => setPhotoIndex?.(idx) }}
      plugins={[Counter]}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
