import { existsSync, readFileSync, writeFileSync } from 'fs';

const optionalExampleFiles = [
  'example.betterTTVConfig.json',
  'example.discordWebhookConfig.json',
  'example.githubConfig.json',
  'example.sevenTVConfig.json',
  'example.frankerFaceZConfig.json',
]

const requiredExampleFiles = [
  'example.mongoDBConfig.json',
  'example.twitchConfig.json',
  'example.tokens.json',
]

function createFileFromExample(source, destination) {
  const content = readFileSync(source);
  console.log(`Creating ${destination}`);
  writeFileSync(destination, content);
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
    const nonExampleFilename = exampleFile.slice("example.".length);
    if (!existsSync(nonExampleFilename) || forceRecreate) {
      createFileFromExample(exampleFile, nonExampleFilename);
    } else {
      console.log(`${nonExampleFilename} already exists. Skipping.`);
    }
  }

  console.log('------------');
  console.warn('NOTE: The values in these configuration files need to be updated with your own unique data. Please follow the instructions in the documentation.')
}

main();