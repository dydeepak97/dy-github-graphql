import url from 'url';
import axios from 'axios';
import parseLinkHeader from 'parse-link-header';
import graphql from 'graphql.js';

const ACCESS_TOKEN = '4de5c04c5500ffcbcf693ac488ef352ba47eee7a';

/**
 * This function builds the request url from the options.
 * It calls the callback function passed to it when the
 * promise is resolved.
 * 
 * @param {Object} requestOptions 
 * @param {Function} cb 
 */

export function makeApiCall(requestOptions, cb) {
  // let requestUrl = url.format(requestOptions);

  console.log('API helper called');


  // let graph = graphql(requestUrl);

  // let query = graph(`{
  //   repository(owner:"isaacs", name:"github") { 
  //     issues(states:OPEN) {
  //       totalCount
  //     }
  //   }
  // }`);

  let gQ = `query {
    repository(owner:"octocat", name:"Hello-World") {
    pullRequests(last: 10) {
      edges {
        node {
          number
          mergeable
        }
      }
    }
  }
}`

  // let requestObject = {
  //   method: 'post',
  //   baseURL: requestUrl,
  //   data: {
  //     query: gQ
  //   },
  //   headers: {
  //     Authorization: `token ${ACCESS_TOKEN}`
  //   }
  // }

  // axio().then(
  //   res => console.log(JSON.stringify(res, null, 2)),
  //   err => console.error(err)
  // );

  // axios.get(requestUrl,
  //   // JSON.stringify({query: gQ}),
  //   { method: 'post',
  //     data: {
  //       query: gQ
  //     },
  //     headers: {
  //       Authorization: `token ${ACCESS_TOKEN}`
  //     }
  //   }).then(res => {
  //     console.log(res.data);
  //     // return res.json();

  //   })
  //   .catch(err => {
  //     console.log('EEEEE', err);

  //   })

  axios(requestOptions).then(res => {
      console.log(res.data);
      // return res.json();
      return cb(null, res.data)
    })
    .catch(err => {
      console.log('EEEEE', err);
      return cb(err, null);
    })

  // fetchDataRecursively(requestUrl).catch(err => {
  //   return cb(err, null)
  // })
  //   .then(response => {
  //     return cb(null, response)
  //   });

};

/**
 * The Github v3 API return the data with pagination. Maximum allowed results per page is 100.
 * To fetch issues from repositories with more than 100 open issue,
 * we need to call the API multiple times.
 * This function recursively calls the API until there is no more 'next page' left.
 * 
 * @param {String} url 
 * @param {Array} data 
 */

function fetchDataRecursively(url, data = []) {

  return axios.get(url)
    .then(response => {
      let linkHeader = parseLinkHeader(response.headers.link);

      if (!linkHeader || !linkHeader.next) {
        return data.concat(response.data);
      }

      return fetchDataRecursively(linkHeader.next.url, data.concat(response.data));
    })
    .catch(err => {
      throw err;
    });

}