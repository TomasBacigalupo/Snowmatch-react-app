import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BlogEmbed() {
  const iframeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleIframeLoad = () => {
      // Listen for messages from the iframe
      const handleMessage = (event) => {
        // Verify the origin of the message
        if (event.origin === 'https://blog.snowmatch.pro') {
          const { path } = event.data;
          if (path) {
            navigate(`/blog${path}`, { replace: true });
          }
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [navigate]);

  // Extract the path from the current location
  const currentPath = location.pathname.replace('/blog', '') || '/';

  return (
    <Box sx={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <iframe
        ref={iframeRef}
        src={`https://blog.snowmatch.pro${currentPath}`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          overflow: 'auto'
        }}
        title="Snowmatch Blog"
      />
    </Box>
  );
} 