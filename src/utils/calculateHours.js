/**
 * Calculate hours from an event
 * @param {Object} event - Event object with start and end properties
 * @returns {number} - Number of hours (max 6)
 */
export const calculateEventHours = (event) => {
  const start = new Date(event.start);
  const end = new Date(event.end);
  
  const diffInMs = end.getTime() - start.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);

  if (diffInHours === 4) {
    return 3;
  }
  
  // Return maximum of 6 hours per day
  return Math.min(diffInHours, 6);
};

/**
 * Calculate total hours from a list of events
 * @param {Array} eventList - Array of event objects
 * @returns {number} - Total number of hours
 */
export const calculateTotalEventHours = (eventList) => {
  return eventList.reduce((total, event) => {
    return total + calculateEventHours(event);
  }, 0);
}; 