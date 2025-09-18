/**
 * Haversine distance calculation utilities
 * Used for calculating distances between GPS coordinates
 */

/**
 * Calculate the distance between two points on Earth using the Haversine formula
 * @param lat1 Latitude of first point in degrees
 * @param lng1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lng2 Longitude of second point in degrees
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param radians Angle in radians
 * @returns Angle in degrees
 */
export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Calculate the bearing between two points
 * @param lat1 Latitude of first point in degrees
 * @param lng1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lng2 Longitude of second point in degrees
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLng = toRadians(lng2 - lng1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  
  const y = Math.sin(dLng) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
  
  let bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360; // Normalize to 0-360
}

/**
 * Calculate the grade (slope) between two points
 * @param lat1 Latitude of first point in degrees
 * @param lng1 Longitude of first point in degrees
 * @param alt1 Altitude of first point in meters
 * @param lat2 Latitude of second point in degrees
 * @param lng2 Longitude of second point in degrees
 * @param alt2 Altitude of second point in meters
 * @returns Grade as a decimal (positive = uphill, negative = downhill)
 */
export function calculateGrade(
  lat1: number,
  lng1: number,
  alt1: number,
  lat2: number,
  lng2: number,
  alt2: number
): number {
  const horizontalDistance = haversineDistance(lat1, lng1, lat2, lng2);
  
  // Avoid division by zero for very small distances
  if (horizontalDistance < 1) {
    return 0;
  }
  
  const verticalChange = alt2 - alt1;
  return verticalChange / horizontalDistance;
}

/**
 * Calculate speed from distance and time
 * @param distance Distance in meters
 * @param timeMs Time in milliseconds
 * @returns Speed in meters per second
 */
export function calculateSpeed(distance: number, timeMs: number): number {
  if (timeMs <= 0) {
    return 0;
  }
  
  const timeSeconds = timeMs / 1000;
  return distance / timeSeconds;
}

/**
 * Convert speed from m/s to km/h
 * @param speedMs Speed in meters per second
 * @returns Speed in kilometers per hour
 */
export function speedMsToKmh(speedMs: number): number {
  return speedMs * 3.6;
}

/**
 * Convert speed from km/h to m/s
 * @param speedKmh Speed in kilometers per hour
 * @returns Speed in meters per second
 */
export function speedKmhToMs(speedKmh: number): number {
  return speedKmh / 3.6;
}

/**
 * Calculate the midpoint between two coordinates
 * @param lat1 Latitude of first point in degrees
 * @param lng1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lng2 Longitude of second point in degrees
 * @returns Object with lat and lng of midpoint
 */
export function calculateMidpoint(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): { lat: number; lng: number } {
  const lat1Rad = toRadians(lat1);
  const lng1Rad = toRadians(lng1);
  const lat2Rad = toRadians(lat2);
  const lng2Rad = toRadians(lng2);
  
  const dLng = lng2Rad - lng1Rad;
  
  const x = Math.cos(lat2Rad) * Math.cos(dLng);
  const y = Math.cos(lat2Rad) * Math.sin(dLng);
  
  const lat3Rad = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt((Math.cos(lat1Rad) + x) * (Math.cos(lat1Rad) + x) + y * y)
  );
  
  const lng3Rad = lng1Rad + Math.atan2(y, Math.cos(lat1Rad) + x);
  
  return {
    lat: toDegrees(lat3Rad),
    lng: toDegrees(lng3Rad),
  };
}
