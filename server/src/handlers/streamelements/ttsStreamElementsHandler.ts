import fetch from 'node-fetch';
import { logger } from '../../logger';

export const ttsStreamElementsHandler = async (voice: string, text: string): Promise<ArrayBuffer | null> => {
  try {
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=${voice}&text=${encodeURI(text)}`;
    const result = await fetch(url, {
      method: 'GET',
    });

    const buffer = await result.arrayBuffer();
    return buffer;
  } catch (error) {
    logger.error(error);
  }
  return null;
};
