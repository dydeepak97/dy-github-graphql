import url from 'url';
import axios from 'axios';
import parseLinkHeader from 'parse-link-header';

/**
 * This function builds the request url from the options.
 * It calls the callback function passed to it when the
 * promise is resolved.
 * 
 * @param {Object} requestOptions 
 * @param {Function} cb 
 */

export function makeApiCall(requestOptions, cb) {
  let requestUrl = url.format(requestOptions);

  fetchDataRecursively(requestUrl).catch(err => {
    return cb(err, null)
  })
    .then(response => {
      return cb(null, response)
    });

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