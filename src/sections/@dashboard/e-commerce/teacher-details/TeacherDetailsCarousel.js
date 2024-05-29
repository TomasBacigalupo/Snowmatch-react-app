import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useState, useRef, useEffect } from 'react';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import Image from '../../../../components/Image';
import LightboxModal from '../../../../components/LightboxModal';
import ShareButton from 'src/components/ShareButton';

// ----------------------------------------------------------------------

const THUMB_SIZE = 64;

const RootStyle = styled('div')(({ theme }) => ({
  '& .slick-slide': {
    float: theme.direction === 'rtl' ? 'right' : 'left',
    '&:focus': { outline: 'none' },
  },
  position: 'relative',
}));

// ----------------------------------------------------------------------

TeacherDetailsCarousel.propTypes = {
  teacher: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default function TeacherDetailsCarousel({ teacher }) {
  const [openLightbox, setOpenLightbox] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [source, setSource] = useState(teacher.images[0]);

  const [nav1, setNav1] = useState();

  const [nav2, setNav2] = useState();

  const slider1 = useRef(null);

  const slider2 = useRef(null);

  const imagesLightbox = teacher.images.map((_image) => _image);

  const handleOpenLightbox = (url) => {
    const selectedImage = imagesLightbox.findIndex((index) => index === url);
    setOpenLightbox(true);
    setSelectedImage(selectedImage);
  };

  const settings1 = {
    dots: false,
    arrows: false,
    slidesToShow: 1,
    draggable: false,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (current, next) => setCurrentIndex(next),
  };

  const settings2 = {
    dots: false,
    arrows: false,
    centerMode: true,
    swipeToSlide: true,
    focusOnSelect: true,
    variableWidth: true,
    centerPadding: '0px',
    slidesToShow: teacher.images.length > 3 ? 3 : teacher.images.length,
  };

  useEffect(() => {
    if (slider1.current) {
      setNav1(slider1.current);
    }
    if (slider2.current) {
      setNav2(slider2.current);
    }
  }, []);

  const handlePrevious = () => {
    slider2.current?.slickPrev();
  };

  const handleNext = () => {
    slider2.current?.slickNext();
  };

  return (
    <RootStyle>
      <Box sx={{ p: 1 }}>
        <Box sx={{ zIndex: 0, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
          {teacher.images.map((img) => (
            <Image
              onError={() => setSource('/assets/notFound.jpeg')}
              key={source}
              alt="large image"
              src={source}
              ratio="1/1"
              onClick={() => handleOpenLightbox(source)}
              sx={{ cursor: 'zoom-in' }}
            />
          ))}
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <ShareButton teacherName={teacher.name} />
          </Box>
        </Box>
      </Box>

      <LightboxModal
        images={imagesLightbox}
        mainSrc={imagesLightbox[selectedImage]}
        photoIndex={selectedImage}
        setPhotoIndex={setSelectedImage}
        isOpen={openLightbox}
        onCloseRequest={() => setOpenLightbox(false)}
      />
    </RootStyle>
  );
}
