import axios from 'axios';

/**
 * This function makes API request using the options 
 * passed in as requestOptions.
 * It calls the callback function passed to it when the
 * promise is resolved.
 * 
 * @param {Object} requestOptions 
 * @param {Function} cb 
 */

export function makeApiCall(requestOptions, cb) {
  axios(requestOptions).then(res => {
      return cb(null, res.data)
    })
    .catch(err => {
      return cb(err, null);
    });
};
