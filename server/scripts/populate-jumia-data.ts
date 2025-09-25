#!/usr/bin/env tsx

import { runJumiaScraper } from '../scraper/jumia-scraper';

async function main() {
  console.log('🎯 Starting Jumia Ghana data population...');
  
  try {
    await runJumiaScraper();
    console.log('✅ Data population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data population:', error);
    process.exit(1);
  }
}

// Run the script
main();