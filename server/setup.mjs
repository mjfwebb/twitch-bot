import { existsSync, readFileSync, writeFileSync } from 'fs';

const optionalExampleFiles = [
  'example.betterTTVConfig.json',
  'example.discordWebhookConfig.json',
  'example.githubConfig.json',
  'example.sevenTVConfig.json',
]

const requiredExampleFiles = [
  'example.mongoDBConfig.json',
  'example.twitchConfig.json',
  'example.tokens.json',
]

function createFileFromExample(filename) {
  const content = readFileSync(filename);
  const nonExampleFilename = filename.slice("example.".length);
  console.log(`Creating ${nonExampleFilename}`);
  writeFileSync(nonExampleFilename, content);
}

function main() {
  const args = process.argv.slice(2);
  let generateAll = false;
  let forceRecreate = false;


  if (args.length > 0) {
    if (args.includes('--all') || args.includes('-a')) {
      generateAll = true;
    }

    if (args.includes('--force') || args.includes('-f')) {
      forceRecreate = true;
    }
  }

  console.log('Running setup...')
  
  const exampleFiles = generateAll ? [...optionalExampleFiles, ...requiredExampleFiles] : requiredExampleFiles;

  for (const exampleFile of exampleFiles) {
    if (!existsSync(exampleFile) || forceRecreate) {
      createFileFromExample(exampleFile);
    } else {
      console.log(`${exampleFile} already exists. Skipping.`);
    }
  }

  console.log('------------');
  console.warn('NOTE: The values in these configuration files need to be updated with your own unique data. Please follow the instructions in the documentation.')
}

main();