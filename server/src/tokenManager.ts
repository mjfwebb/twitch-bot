import { readFileSync, writeFileSync } from 'fs';
import { hasOwnProperty } from './utils/hasOwnProperty';

const tokensfileName = 'tokens.json';

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

export const getTokenFromFile = (tokenName: string): string => {
  const file = readFileSync(tokensfileName);
  const json: unknown = JSON.parse(file.toString());
  if (typeof json === 'object' && hasOwnProperty(json, tokenName)) {
    return json[tokenName] as string;
  } else {
    throw new Error(`Unable to load token ${tokenName}`);
  }
};
