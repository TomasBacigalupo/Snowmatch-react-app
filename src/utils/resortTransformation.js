/**
 * Utility functions for resort data transformation
 */

/**
 * Transforms a resort value from API format to display format
 * @param {string} resortValue - The resort value from API (e.g., "CERRO_CATEDRAL")
 * @returns {string} - The display name (e.g., "Cerro Catedral")
 */
export const getResortDisplayName = (resortValue) => {
  if (!resortValue || typeof resortValue !== 'string') {
    return '';
  }
  
  return resortValue
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Determines the category (country) for a resort based on its value
 * @param {string} resortValue - The resort value from API (e.g., "CERRO_CATEDRAL")
 * @returns {string} - The category/country (e.g., "Argentina")
 */
export const getResortCategory = (resortValue) => {
  if (!resortValue || typeof resortValue !== 'string') {
    return 'Other';
  }
  
  const upperValue = resortValue.toUpperCase();
  
  // Argentina resorts
  if (upperValue.includes('CERRO') || 
      upperValue.includes('CHAPELCO') || 
      upperValue.includes('LA_HOYA') || 
      upperValue.includes('LAS_LEÑAS') || 
      upperValue.includes('BAYO') || 
      upperValue.includes('PENITENTES') || 
      upperValue.includes('LAGO_HERMOSO')) {
    return 'Argentina';
  }
  
  // Chile resorts
  if (upperValue.includes('NEVADO') || 
      upperValue.includes('PARVA') || 
      upperValue.includes('COLORADO') || 
      upperValue.includes('PORTILLO') || 
      upperValue.includes('CHILLAN') || 
      upperValue.includes('CORRALCO') || 
      upperValue.includes('ANTUCO')) {
    return 'Chile';
  }
  
  // New Zealand resorts
  if (upperValue.includes('TREBLE') || 
      upperValue.includes('CARDRONA') || 
      upperValue.includes('REMARKABLES') || 
      upperValue.includes('CORONET') || 
      upperValue.includes('HUTT') || 
      upperValue.includes('TUKINO')) {
    return 'Nueva Zelanda';
  }
  
  // Australia resorts
  if (upperValue.includes('PERISHER') || 
      upperValue.includes('THREDBO') || 
      upperValue.includes('FALLS') || 
      upperValue.includes('BULLER') || 
      upperValue.includes('HOTHAM') || 
      upperValue.includes('SELWYN')) {
    return 'Australia';
  }
  
  return 'Other';
};

/**
 * Transforms API resort data to the format expected by UI components
 * @param {Array} resortsData - Array of resort objects from API
 * @returns {Array} - Transformed array with name, category, and value properties
 */
export const transformResortsForUI = (resortsData) => {
  if (!Array.isArray(resortsData) || resortsData.length === 0) {
    return [];
  }
  
  return resortsData
    .map((resort) => {
      const resortValue = resort.value;
      const displayName = getResortDisplayName(resortValue);
      const category = getResortCategory(resortValue);
      
      return {
        name: displayName,      // Display name: "Cerro Catedral"
        category: category,     // Category: "Argentina"
        value: resortValue      // Original value: "CERRO_CATEDRAL"
      };
    })
    .filter(resort => resort.name && resort.name.trim() !== '')
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Transforms a single resort value to display format for showing in UI
 * @param {string} resortValue - The resort value to transform
 * @returns {string} - The display name
 */
export const resortTransformation = (resortValue) => {
  return getResortDisplayName(resortValue);
};

/**
 * Gets resort display name with fallback
 * @param {string} resortValue - The resort value to transform
 * @param {string} fallback - Fallback text if transformation fails
 * @returns {string} - The display name or fallback
 */
export const getResortDisplayNameWithFallback = (resortValue, fallback = 'Resort') => {
  const displayName = getResortDisplayName(resortValue);
  return displayName || fallback;
};

// Default export for backward compatibility
export default resortTransformation;
