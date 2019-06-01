import { makeApiCall } from "./UtilService";
import url from 'url';

const GITHUB_API_HOST = 'api.github.com';

/**
 * This function is used to fetch issues for a  given 
 * repository url. It calls @makeApiCall to fetch the data
 * from api and passed callback function to it.
 * 
 * @param {String} repoUrl 
 * @param {Function} cb 
 */

export function getIssuesForRepository(repoUrl, cb) {
  let repoPath = url.parse(repoUrl).pathname,
    requestOptions = {
      protocol: 'https',
      hostname: GITHUB_API_HOST,
      pathname: `repos${repoPath}/issues`,
      query: {
        state: 'open',
        per_page: 100   // Maximum allowed page size
      }
    }

  return makeApiCall(requestOptions, cb);
};
