#!/usr/bin/env tsx

import { createRealisticJumiaData } from '../scraper/realistic-jumia-data';

async function main() {
  console.log('🎯 Starting realistic Jumia Ghana data population...');
  
  try {
    await createRealisticJumiaData();
    console.log('✅ Realistic data population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during realistic data population:', error);
    process.exit(1);
  }
}

// Run the script
main();