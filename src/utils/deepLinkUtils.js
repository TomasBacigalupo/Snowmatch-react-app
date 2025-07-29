/**
 * Utility functions for generating and handling deep links
 */

// Base URL for universal links
const WEB_URL = 'https://snowmatch.pro';

/**
 * Generate a deep link URL for a specific route
 * @param {string} path - The path to navigate to
 * @param {Object} params - Query parameters
 * @returns {string} The deep link URL
 */
export const generateDeepLink = (path, params = {}) => {
  const url = new URL(path, WEB_URL);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  
  return url.toString();
};

/**
 * Generate deep link for teacher profile
 * @param {string} teacherId - Teacher ID
 * @returns {string} Deep link URL
 */
export const generateTeacherLink = (teacherId) => {
  return generateDeepLink(`/match/teacher/${teacherId}`);
};

/**
 * Generate deep link for user profile
 * @param {string} userId - User ID
 * @returns {string} Deep link URL
 */
export const generateProfileLink = (userId) => {
  return generateDeepLink('/profile', { id: userId });
};

/**
 * Generate deep link for booking details
 * @param {string} bookingId - Booking ID
 * @returns {string} Deep link URL
 */
export const generateBookingLink = (bookingId) => {
  return generateDeepLink('/booking', { id: bookingId });
};

/**
 * Generate deep link for resort details
 * @param {string} resortId - Resort ID
 * @returns {string} Deep link URL
 */
export const generateResortLink = (resortId) => {
  return generateDeepLink('/resort', { id: resortId });
};

/**
 * Generate deep link for lesson details
 * @param {string} lessonId - Lesson ID
 * @returns {string} Deep link URL
 */
export const generateLessonLink = (lessonId) => {
  return generateDeepLink('/lesson', { id: lessonId });
};

/**
 * Generate deep link for course details
 * @param {string} courseId - Course ID
 * @returns {string} Deep link URL
 */
export const generateCourseLink = (courseId) => {
  return generateDeepLink('/course', { id: courseId });
};

/**
 * Generate deep link for instructor profile
 * @param {string} instructorId - Instructor ID
 * @returns {string} Deep link URL
 */
export const generateInstructorLink = (instructorId) => {
  return generateDeepLink('/match/teacher', { id: instructorId });
};

/**
 * Share a deep link using the native share functionality
 * @param {string} url - The deep link URL to share
 * @param {string} title - Share title
 * @param {string} text - Share text
 */
export const shareDeepLink = async (url, title = 'SnowMatch', text = 'Check this out on SnowMatch!') => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
      console.log('URL copied to clipboard:', url);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }
};

/**
 * Parse a deep link URL and extract route information
 * @param {string} url - The deep link URL to parse
 * @returns {Object} Parsed route information
 */
export const parseDeepLink = (url) => {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const params = Object.fromEntries(urlObj.searchParams);
    
    // Special handling for teacher routes
    if (path.startsWith('/match/teacher/')) {
      const teacherId = path.split('/match/teacher/')[1];
      return {
        type: 'teacher',
        teacherId,
        path,
        params,
        fullUrl: url
      };
    }
    
    return {
      path,
      params,
      fullUrl: url
    };
  } catch (error) {
    console.error('Error parsing deep link:', error);
    return null;
  }
};

/**
 * Check if a URL is a valid SnowMatch deep link
 * @param {string} url - The URL to check
 * @returns {boolean} Whether it's a valid deep link
 */
export const isValidDeepLink = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === 'snowmatch.pro';
  } catch (error) {
    return false;
  }
}; 