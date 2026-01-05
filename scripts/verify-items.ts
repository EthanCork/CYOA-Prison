/**
 * Verification script for items data
 * Displays item count breakdown by category
 */

import {
  getTotalItemCount,
  getItemCountByCategory,
  getAllCategories,
} from '../lib/itemLoader';

console.log('=== Item Data Verification ===\n');

const totalCount = getTotalItemCount();
console.log(`Total Items: ${totalCount}\n`);

console.log('Items by Category:');
const counts = getItemCountByCategory();
const categories = getAllCategories();

categories.forEach(category => {
  const count = counts[category];
  const percentage = ((count / totalCount) * 100).toFixed(1);
  console.log(`  ${category.padEnd(10)} : ${count.toString().padStart(2)} items (${percentage}%)`);
});

console.log('\n✓ Items data loaded successfully!');
