import { makeApiCall } from "./UtilService";

const GITHUB_API_HOST = 'https://api.github.com/graphql';

const ACCESS_TOKEN = process.env.REACT_APP_GITHUB;

/**
 * This function is used to fetch total open issue count for a  given 
 * repository. It calls @makeApiCall to fetch the data
 * from api and passed callback function to it.
 * 
 * @param {String} repoUrl 
 * @param {Function} cb 
 */

export function getTotalIssues(repoPath, cb) {
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

/**
 * This function is used to fetch issues count for a  given 
 * repository since a given time. It calls @makeApiCall to fetch the data
 * from api and passed callback function to it.
 * 
 * @param {String} repoUrl 
 * @param {DateTime} dateTime
 * @param {Function} cb 
 */

export function getIssuesSince(repoPath, dateTime, cb) {  
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
