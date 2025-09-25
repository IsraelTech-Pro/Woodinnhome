#!/usr/bin/env tsx

import { runRealJumiaScraper } from '../scraper/real-jumia-scraper';

async function main() {
  console.log('🎯 Starting REAL Jumia Ghana data population...');
  
  try {
    await runRealJumiaScraper();
    console.log('✅ REAL data population completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during REAL data population:', error);
    process.exit(1);
  }
}

// Run the script
main();