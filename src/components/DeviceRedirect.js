import { useEffect } from 'react';

export default function DeviceRedirect() {
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = 'https://snowmatch.app';
    }
  }, []);

  return null;
} 