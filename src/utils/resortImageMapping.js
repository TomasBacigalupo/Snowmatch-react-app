/**
 * Utility functions for mapping resorts to their corresponding images
 */

/**
 * Maps resort slugs to their corresponding hero images
 * @param {string} resortSlug - The resort slug (e.g., "cerro-catedral")
 * @returns {string} - The image path for the resort
 */
export const getResortHeroImage = (resortSlug) => {
  if (!resortSlug || typeof resortSlug !== 'string') {
    return '/assets/bariloche.webp'; // Default fallback
  }

  const slug = resortSlug.toLowerCase().trim();
  
  const imageMapping = {
    // Argentina resorts
    'cerro-catedral': '/assets/catedral.png',
    'cerro-bayo': '/assets/bayo.png',
    'cerro-chapelco': '/assets/chapelco.png',
    'cerro-perito-moreno': '/assets/perito-moreno.png',
    'bariloche': '/assets/bariloche.webp',
    'lago-hermoso': '/assets/bariloche.webp', // Using bariloche as fallback
    
    // International resorts (if any)
    'aspen': '/assets/resorts/aspen-hero.jpg',
    'vail': '/assets/resorts/vail-hero.jpg',
    'jackson-hole': '/assets/resorts/jackson-hole-hero.jpg',
  };

  return imageMapping[slug] || '/assets/bariloche.webp';
};

/**
 * Maps resort slugs to their corresponding mobile logo images
 * @param {string} resortSlug - The resort slug
 * @returns {string} - The logo image path for the resort
 */
export const getResortLogoImage = (resortSlug) => {
  if (!resortSlug || typeof resortSlug !== 'string') {
    return '/logo/snowmatch.webp'; // Default fallback
  }

  const slug = resortSlug.toLowerCase().trim();
  
  const logoMapping = {
    'cerro-catedral': '/assets/resorts/icon-catedral.png',
    'cerro-bayo': '/assets/resorts/icon-bayo.png',
    'cerro-chapelco': '/assets/resorts/icon-chapelco.png',
    'cerro-perito-moreno': '/assets/resorts/icon-castor.png', // Using castor as fallback
    'bariloche': '/logo/snowmatch.webp',
    'lago-hermoso': '/logo/snowmatch.webp',
  };

  return logoMapping[slug] || '/logo/snowmatch.webp';
};

/**
 * Gets the appropriate alt text for resort images
 * @param {string} resortSlug - The resort slug
 * @param {string} discipline - The discipline (ski, snowboard, etc.)
 * @param {string} type - The lesson type (private, group, children)
 * @returns {string} - Descriptive alt text for SEO
 */
export const getResortImageAltText = (resortSlug, discipline = '', type = '') => {
  const resortName = resortSlug 
    ? resortSlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : 'Resort';
  
  const disciplineText = discipline ? ` de ${discipline}` : '';
  const typeText = type ? ` - Clases ${type}` : '';
  
  return `${resortName}${disciplineText}${typeText} en SnowMatch - Encuentra instructores profesionales`;
};

/**
 * Gets the appropriate alt text for mobile logo images
 * @param {string} resortSlug - The resort slug
 * @param {string} discipline - The discipline
 * @returns {string} - Descriptive alt text for SEO
 */
export const getResortLogoAltText = (resortSlug, discipline = '') => {
  const resortName = resortSlug 
    ? resortSlug.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    : 'SnowMatch';
  
  const disciplineText = discipline ? ` - Clases de ${discipline}` : '';
  
  return `${resortName}${disciplineText} - SnowMatch`;
};

/**
 * Generates responsive srcSet for resort images
 * @param {string} baseImagePath - The base image path
 * @param {Array} sizes - Array of sizes in pixels [320, 640, 1024, 1200]
 * @returns {string} - srcSet string for responsive images
 */
export const generateResponsiveSrcSet = (baseImagePath, sizes = [320, 640, 1024, 1200]) => {
  if (!baseImagePath) return '';
  
  return sizes
    .map(size => `${baseImagePath}?w=${size} ${size}w`)
    .join(', ');
};

/**
 * Gets responsive image configuration for resort hero images
 * @param {string} resortSlug - The resort slug
 * @returns {Object} - Object with src, srcSet, and sizes
 */
export const getResponsiveResortHeroImage = (resortSlug) => {
  const baseImage = getResortHeroImage(resortSlug);
  
  return {
    src: baseImage,
    srcSet: generateResponsiveSrcSet(baseImage, [640, 1024, 1200, 1600]),
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw'
  };
};

/**
 * Gets responsive image configuration for resort logo images
 * @param {string} resortSlug - The resort slug
 * @returns {Object} - Object with src, srcSet, and sizes
 */
export const getResponsiveResortLogoImage = (resortSlug) => {
  const baseImage = getResortLogoImage(resortSlug);
  
  return {
    src: baseImage,
    srcSet: generateResponsiveSrcSet(baseImage, [320, 640, 1024]),
    sizes: '(max-width: 768px) 100vw, 50vw'
  };
};

export default {
  getResortHeroImage,
  getResortLogoImage,
  getResortImageAltText,
  getResortLogoAltText,
};
