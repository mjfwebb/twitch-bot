import { StatusCodes } from "http-status-codes";
import { Octokit } from "octokit";
import Config from "../../config";
import { logger } from "../../logger";

export const createIssue = async (
  issueTitle: string,
  issueDescription: string,
) => {
  if (Config.github.enabled) {
    try {
      const octokit = new Octokit({ auth: Config.github.access_token });

      const result = await octokit.rest.issues.create({
        owner: Config.github.owner,
        repo: Config.github.repo,
        title: issueTitle,
        body: issueDescription,
      });

      if (result.status === StatusCodes.CREATED) {
        return result.data;
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return null;
};
