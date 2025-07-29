import { calculateTotalEventHours } from './calculateHours';

/**
 * Calculate teacher pay based on level and total hours
 * @param {number} level - Teacher level (1-5)
 * @param {Array} eventList - Array of event objects
 * @returns {number} - Total amount to be paid
 */
export const calculateTeacherPay = (level, eventList) => {
  const totalHours = calculateTotalEventHours(eventList);
  
  // Get hourly rate based on teacher level
  const hourlyRate = getHourlyRateByLevel(level);
  
  return totalHours * hourlyRate;
};

/**
 * Get hourly rate based on teacher level
 * @param {number} level - Teacher level (1-5)
 * @returns {number} - Hourly rate
 */
export const getHourlyRateByLevel = (level, type) => {
  switch (level) {
    case 1:
      return type === 'REFERRED' ? parseFloat(process.env.REACT_APP_LEVEL_ONE_REFERRED_HOURLY_RATE_REFERRED) : parseFloat(process.env.REACT_APP_LEVEL_ONE_HOURLY_RATE_ASSIGNED) || 0;
    case 2:
      return type === 'REFERRED' ? parseFloat(process.env.REACT_APP_LEVEL_TWO_REFERRED_HOURLY_RATE_REFERRED) : parseFloat(process.env.REACT_APP_LEVEL_TWO_HOURLY_RATE_ASSIGNED) || 0;
    case 3:
      return type === 'REFERRED' ? parseFloat(process.env.REACT_APP_LEVEL_THREE_REFERRED_HOURLY_RATE_REFERRED) : parseFloat(process.env.REACT_APP_LEVEL_THREE_HOURLY_RATE_ASSIGNED) || 0;
    case 4:
      return type === 'REFERRED' ? parseFloat(process.env.REACT_APP_LEVEL_FOUR_REFERRED_HOURLY_RATE_REFERRED) : parseFloat(process.env.REACT_APP_LEVEL_FOUR_HOURLY_RATE_ASSIGNED) || 0;
    case 5:
      return type === 'REFERRED' ? parseFloat(process.env.REACT_APP_LEVEL_FIVE_REFERRED_HOURLY_RATE_REFERRED) : parseFloat(process.env.REACT_APP_LEVEL_FIVE_HOURLY_RATE_ASSIGNED) || 0;
    default:
      return 0;
  }
}; 