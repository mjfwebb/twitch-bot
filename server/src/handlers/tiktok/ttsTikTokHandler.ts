import fetch from "node-fetch";
import Config from "../../config";
import { logger } from "../../logger";
import { hasOwnProperty } from "../../utils/hasOwnProperty";

export const ttsTikTokHandler = async (
  voice: string,
  text: string,
): Promise<ArrayBuffer | null> => {
  if (Config.tiktok.enabled && Config.tiktok.session_id) {
    try {
      const url = `https://api22-normal-c-useast1a.tiktokv.com/media/api/text/speech/invoke/?text_speaker=${voice}&req_text=${encodeURI(
        text,
      )}&speaker_map_type=0&aid=1233`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "User-Agent":
            "com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)",
          Cookie: `sessionid=${Config.tiktok.session_id}`,
        },
      });

      const json: unknown = await response.json();

      if (
        hasOwnProperty(json, "data") &&
        hasOwnProperty(json.data, "v_str") &&
        typeof json.data.v_str === "string"
      ) {
        // base64 decode data.v_str
        const buffer = Buffer.from(json.data.v_str, "base64");
        return buffer;
      }
    } catch (error) {
      logger.error(error);
    }
  } else {
    logger.error("TikTok is not enabled or session_id is not set");
  }
  return null;
};
