import { importStoriesFromJSON } from './server/import-stories';

async function runImport() {
  console.log('Starting story import...');
  const result = await importStoriesFromJSON('./stories-import.json');
  
  if (result.success) {
    console.log(`Successfully imported ${result.imported} stories!`);
  } else {
    console.error('Import failed:', result.error);
  }
  
  process.exit(0);
}

runImport().catch(console.error);