import { Octokit } from 'octokit';
import Config from '../../config';
import { getRandomNumberInRange } from '../../utils/getRandomNumberInRange';

export const fetchRandomIssue = async () => {
  if (Config.github.enabled) {
    try {
      const octokit = new Octokit({ auth: Config.github.access_token });

      const issues = await octokit.rest.issues.listForRepo({
        owner: Config.github.owner,
        repo: Config.github.repo,
      });

      if (issues.data.length > 0) {
        const randomIssueNumber = getRandomNumberInRange(0, issues.data.length);
        return issues.data[randomIssueNumber];
      }
    } catch (error) {
      console.error(error);
    }
  }

  return null;
};
