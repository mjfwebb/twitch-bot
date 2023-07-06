import { existsSync, readFileSync, writeFileSync } from 'fs';
import pc from 'picocolors';
import { hasOwnProperty } from '../utils/hasOwnProperty';

const tokensfileName = 'tokens.json';

export const assertTokenFileExists = () => {
  if (!existsSync(tokensfileName)) {
    if (existsSync(`example.${tokensfileName}`)) {
      console.log(`${pc.blue('Startup:')} ${tokensfileName} does not exist. Creating it now.`);
      const exampleFileContents = readFileSync(`example.${tokensfileName}`);
      writeFileSync(tokensfileName, exampleFileContents);
    }
  }
};

/**
 * Sets a token in the tokens file by its name and value.
 * @param tokenName - The name of the token to set.
 * @param tokenValue - The value of the token to set.
 */
export const setTokenInFile = (tokenName: string, tokenValue: string) => {
  const file = readFileSync(tokensfileName);
  const currentTokenData: unknown = JSON.parse(file.toString());

  if (typeof currentTokenData === 'object') {
    const updatedData = {
      ...currentTokenData,
      [tokenName]: tokenValue,
    };
    writeFileSync(tokensfileName, JSON.stringify(updatedData));
  }
};

/**
 * Retrieves a token from the tokens file by its name.
 * @param tokenName - The name of the token to retrieve.
 * @returns The token value as a string.
 * @throws Error if the token cannot be found in the file.
 */
export const getTokenFromFile = (tokenName: string): string => {
  const file = readFileSync(tokensfileName);
  const json: unknown = JSON.parse(file.toString());
  if (typeof json === 'object' && hasOwnProperty(json, tokenName)) {
    return json[tokenName] as string;
  } else {
    throw new Error(`Unable to load token ${tokenName}`);
  }
};
