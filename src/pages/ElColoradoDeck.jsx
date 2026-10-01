import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import { PATH_EL_COLORADO_DECK } from '../routes/paths';

const DECK_SRC = '/decks/el-colorado-2027/index.html';

// The deck is a fixed 16:9 document. An iframe keeps its type, scroll, and print styles
// outside the app theme.
const DeckFrame = styled('iframe')({
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  border: 0,
  backgroundColor: '#0c0e0d',
  zIndex: 1400,
});

export default function ElColoradoDeck() {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Snowmatch × El Colorado — Temporada 2027</title>
        <meta
          name="description"
          content="Propuesta de partnership para digitalizar la escuela y el rental de El Colorado en la temporada 2027."
        />
        <link rel="canonical" href={`https://snowmatch.com${PATH_EL_COLORADO_DECK}`} />
      </Helmet>
      <DeckFrame title="Snowmatch × El Colorado — Temporada 2027" src={DECK_SRC} />
    </>
  );
}
