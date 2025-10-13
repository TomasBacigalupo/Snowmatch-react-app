/**
 * A/B Testing Test Script
 * 
 * This script can be run in the browser console to test A/B testing functionality.
 * It simulates multiple users and shows variant distribution.
 */

import { 
  getHomeHeroCTAVariant, 
  trackHomeHeroCTAClick, 
  resetABTestAssignments,
  getAllABTestAssignments 
} from './abTesting';

/**
 * Test A/B testing functionality
 */
export function testABTesting() {
  console.log('🧪 Starting A/B Testing Test...');
  
  // Reset all tests first
  resetABTestAssignments();
  console.log('✅ Reset all A/B test assignments');
  
  // Test multiple "users" to see distribution
  const testUsers = 100;
  const variantCounts = {};
  
  for (let i = 0; i < testUsers; i++) {
    // Simulate different user IDs
    const originalUserId = localStorage.getItem('snowmatch_user_id');
    localStorage.setItem('snowmatch_user_id', `test_user_${i}`);
    
    const variant = getHomeHeroCTAVariant();
    variantCounts[variant] = (variantCounts[variant] || 0) + 1;
    
    // Restore original user ID
    if (originalUserId) {
      localStorage.setItem('snowmatch_user_id', originalUserId);
    } else {
      localStorage.removeItem('snowmatch_user_id');
    }
  }
  
  console.log('📊 Variant Distribution:');
  Object.entries(variantCounts).forEach(([variant, count]) => {
    const percentage = ((count / testUsers) * 100).toFixed(1);
    console.log(`  ${variant}: ${count} users (${percentage}%)`);
  });
  
  // Test current user assignment
  const currentVariant = getHomeHeroCTAVariant();
  console.log(`🎯 Current user assigned to: ${currentVariant}`);
  
  // Test click tracking
  console.log('🖱️ Simulating CTA click...');
  trackHomeHeroCTAClick(currentVariant);
  
  // Show all assignments
  const allAssignments = getAllABTestAssignments();
  console.log('📋 All current assignments:', allAssignments);
  
  console.log('✅ A/B Testing test completed!');
}

/**
 * Test variant consistency (same user should get same variant)
 */
export function testVariantConsistency() {
  console.log('🔄 Testing variant consistency...');
  
  const testUserId = 'consistency_test_user';
  localStorage.setItem('snowmatch_user_id', testUserId);
  
  // Get variant multiple times
  const variants = [];
  for (let i = 0; i < 10; i++) {
    variants.push(getHomeHeroCTAVariant());
  }
  
  const uniqueVariants = [...new Set(variants)];
  const isConsistent = uniqueVariants.length === 1;
  
  console.log(`📊 Variants received: ${variants.join(', ')}`);
  console.log(`✅ Consistency test: ${isConsistent ? 'PASSED' : 'FAILED'}`);
  
  if (!isConsistent) {
    console.error('❌ User should always get the same variant!');
  }
  
  // Clean up
  localStorage.removeItem('snowmatch_user_id');
}

/**
 * Test traffic allocation
 */
export function testTrafficAllocation() {
  console.log('📈 Testing traffic allocation...');
  
  const testUsers = 1000;
  const variantCounts = {};
  
  for (let i = 0; i < testUsers; i++) {
    localStorage.setItem('snowmatch_user_id', `traffic_test_user_${i}`);
    const variant = getHomeHeroCTAVariant();
    variantCounts[variant] = (variantCounts[variant] || 0) + 1;
  }
  
  console.log('📊 Traffic Allocation Results:');
  Object.entries(variantCounts).forEach(([variant, count]) => {
    const percentage = ((count / testUsers) * 100).toFixed(1);
    const expectedPercentage = 20; // Each variant should get ~20%
    const deviation = Math.abs(percentage - expectedPercentage);
    const status = deviation < 5 ? '✅' : '⚠️';
    console.log(`  ${status} ${variant}: ${count} users (${percentage}%) - Expected: ~20%`);
  });
  
  // Clean up
  localStorage.removeItem('snowmatch_user_id');
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testABTesting = testABTesting;
  window.testVariantConsistency = testVariantConsistency;
  window.testTrafficAllocation = testTrafficAllocation;
  
  console.log('🧪 A/B Testing test functions available:');
  console.log('  - testABTesting()');
  console.log('  - testVariantConsistency()');
  console.log('  - testTrafficAllocation()');
}
