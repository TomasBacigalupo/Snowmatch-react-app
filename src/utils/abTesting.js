/**
 * A/B Testing Utility for Snowmatch
 * 
 * This utility provides functions to manage A/B tests with:
 * - Consistent user assignment to variants
 * - Local storage persistence
 * - Analytics tracking
 * - Easy variant selection
 */

// A/B Test Configuration
const AB_TEST_CONFIG = {
  homeHeroCTA: {
    testId: 'home_hero_cta_v1',
    variants: ['variant1', 'variant2', 'variant3', 'variant4', 'variant5'],
    defaultVariant: 'variant1',
    trafficAllocation: {
      variant1: 0.2, // 20%
      variant2: 0.2, // 20%
      variant3: 0.2, // 20%
      variant4: 0.2, // 20%
      variant5: 0.2, // 20%
    }
  }
};

/**
 * Generate a consistent hash from a string
 * @param {string} str - Input string
 * @returns {number} - Hash value between 0 and 1
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) / 2147483647; // Normalize to 0-1
}

/**
 * Get or create a unique user identifier
 * @returns {string} - User ID
 */
function getUserId() {
  let userId = localStorage.getItem('snowmatch_user_id');
  if (!userId) {
    // Generate a unique ID based on timestamp and random number
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('snowmatch_user_id', userId);
  }
  return userId;
}

/**
 * Get the assigned variant for a specific A/B test
 * @param {string} testId - The test identifier
 * @returns {string} - The assigned variant
 */
export function getABTestVariant(testId) {
  const testConfig = AB_TEST_CONFIG[testId];
  if (!testConfig) {
    console.warn(`A/B test configuration not found for: ${testId}`);
    return testConfig?.defaultVariant || 'variant1';
  }

  const storageKey = `ab_test_${testId}`;
  let assignedVariant = localStorage.getItem(storageKey);

  if (!assignedVariant) {
    // Assign variant based on user ID hash for consistency
    const userId = getUserId();
    const userHash = hashString(`${userId}_${testId}`);
    
    // Determine variant based on traffic allocation
    let cumulativeWeight = 0;
    for (const [variant, weight] of Object.entries(testConfig.trafficAllocation)) {
      cumulativeWeight += weight;
      if (userHash <= cumulativeWeight) {
        assignedVariant = variant;
        break;
      }
    }

    // Fallback to default variant
    if (!assignedVariant) {
      assignedVariant = testConfig.defaultVariant;
    }

    // Store the assignment
    localStorage.setItem(storageKey, assignedVariant);
    
    // Track the assignment
    trackABTestAssignment(testId, assignedVariant);
  }

  return assignedVariant;
}

/**
 * Track A/B test assignment for analytics
 * @param {string} testId - The test identifier
 * @param {string} variant - The assigned variant
 */
function trackABTestAssignment(testId, variant) {
  // Track with Google Analytics if available
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'ab_test_assignment', {
      test_id: testId,
      variant: variant,
      event_category: 'A/B Testing',
      event_label: `${testId}_${variant}`
    });
  }

  // Track with custom analytics if available
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track('AB Test Assignment', {
      testId,
      variant,
      timestamp: new Date().toISOString()
    });
  }

  // Console log for development
  console.log(`A/B Test Assignment: ${testId} -> ${variant}`);
}

/**
 * Track A/B test conversion/click
 * @param {string} testId - The test identifier
 * @param {string} variant - The variant that was clicked
 * @param {string} action - The action taken (e.g., 'cta_click')
 */
export function trackABTestConversion(testId, variant, action = 'cta_click') {
  // Track with Google Analytics if available
  if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
    window.gtag('event', 'ab_test_conversion', {
      test_id: testId,
      variant: variant,
      action: action,
      event_category: 'A/B Testing',
      event_label: `${testId}_${variant}_${action}`
    });
  }

  // Track with custom analytics if available
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track('AB Test Conversion', {
      testId,
      variant,
      action,
      timestamp: new Date().toISOString()
    });
  }

  // Console log for development
  console.log(`A/B Test Conversion: ${testId} -> ${variant} -> ${action}`);
}

/**
 * Get A/B test variant for Home Hero CTA
 * @returns {string} - The assigned CTA variant
 */
export function getHomeHeroCTAVariant() {
  return getABTestVariant('homeHeroCTA');
}

/**
 * Track Home Hero CTA click
 * @param {string} variant - The variant that was clicked
 */
export function trackHomeHeroCTAClick(variant) {
  trackABTestConversion('homeHeroCTA', variant, 'cta_click');
}

/**
 * Reset A/B test assignments (useful for testing)
 * @param {string} testId - Optional test ID to reset specific test
 */
export function resetABTestAssignments(testId = null) {
  if (testId) {
    localStorage.removeItem(`ab_test_${testId}`);
  } else {
    // Reset all A/B test assignments
    Object.keys(AB_TEST_CONFIG).forEach(test => {
      localStorage.removeItem(`ab_test_${test}`);
    });
  }
}

/**
 * Get all current A/B test assignments
 * @returns {Object} - Object with test IDs as keys and variants as values
 */
export function getAllABTestAssignments() {
  const assignments = {};
  Object.keys(AB_TEST_CONFIG).forEach(testId => {
    assignments[testId] = localStorage.getItem(`ab_test_${testId}`);
  });
  return assignments;
}

export default {
  getABTestVariant,
  trackABTestConversion,
  getHomeHeroCTAVariant,
  trackHomeHeroCTAClick,
  resetABTestAssignments,
  getAllABTestAssignments
};
