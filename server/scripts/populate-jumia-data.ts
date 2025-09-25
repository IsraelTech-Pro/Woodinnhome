#!/usr/bin/env tsx

import { runSimpleJumiaScraper } from '../scraper/jumia-scraper-simple';

async function main() {
  console.log('🎯 Starting Jumia Ghana data population...');
  
  try {
    await runSimpleJumiaScraper();
    console.log('✅ Data population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data population:', error);
    process.exit(1);
  }
}

// Run the script
main();