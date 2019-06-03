import { makeApiCall } from "./UtilService";
import url from 'url';

const GITHUB_API_HOST = 'https://api.github.com/graphql';

const ACCESS_TOKEN = process.env.REACT_APP_GITHUB;

/**
 * This function is used to fetch issues for a  given 
 * repository url. It calls @makeApiCall to fetch the data
 * from api and passed callback function to it.
 * 
 * @param {String} repoUrl 
 * @param {Function} cb 
 */

// export function getIssuesForRepository(repoUrl, cb) {
//   let repoPath = url.parse(repoUrl).pathname,
//     requestOptions = {
//       protocol: 'https',
//       hostname: GITHUB_API_HOST,
//       // pathname: `repos${repoPath}/issues`,
//       // query: {
//       //   state: 'open',
//       //   per_page: 100   // Maximum allowed page size
//       // }
//     }

//   return makeApiCall(requestOptions, cb);
// };

export function getTotalIssues(repoPath, cb) {
  console.log(repoPath);
  
  let pathSplit = repoPath.split('/'),
    owner = pathSplit[1],
    repo = pathSplit[2],
    graphQuery = `query { 
      repository(owner:"${owner}", name:"${repo}") { 
        issues(states:OPEN) {
          totalCount
        }
      }
    }`,
    requestOptions = {
      method: 'post',
      baseURL: GITHUB_API_HOST,
      data: {
        query: graphQuery
      },
      headers: {
        Authorization: `token ${ACCESS_TOKEN}`
      }
    }

  return makeApiCall(requestOptions, cb);

}

export function getIssuesSince(repoPath, dateTime, cb) {
  console.log(repoPath);
  
  let pathSplit = repoPath.split('/'),
    owner = pathSplit[1],
    repo = pathSplit[2],
    graphQuery = `query { 
      repository(owner:"${owner}", name:"${repo}") { 
        issues(states:OPEN, filterBy: {since: "${dateTime}"}) {
          totalCount
        }
      }
    }`,
    requestOptions = {
      method: 'post',
      baseURL: GITHUB_API_HOST,
      data: {
        query: graphQuery
      },
      headers: {
        Authorization: `token ${ACCESS_TOKEN}`
      }
    }

  return makeApiCall(requestOptions, cb);

}
