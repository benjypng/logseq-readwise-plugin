import axios from 'axios';

const BASE_URL = "https://readwise.io/api/v2/";

const getOrdinalNum = (n) => {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
};

const getDateForPage = (d) => {
  const getYear = d.getFullYear();
  const getMonth = d.toString().substring(4, 7);
  const getDate = d.getDate();

  return `${getMonth} ${getOrdinalNum(getDate)}, ${getYear}`;
};

const blockTitle = () => {
  const currDate = new Date();
  return `[[${getDateForPage(currDate)}]], ${currDate
    .toLocaleString()
    .substring(12, 17)}`;
};

const pageName = () => {return 'Readwise TOC'};

const clearPage = async (arr) => {
  for (let i of arr) {
    console.log(`Deleting ${i.content}`);
    await logseq.Editor.removeBlock(i.uuid);
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * General purpose readwise request method.
 * Make a readwise request of type 'method' at the specified url with the provided data
 * 
 * @param {String} method http method: GET, POST, PUT, PATCH, DELETE
 * @param {String} url request url
 * @param {Object} params data parameters
 * @return {Object} response
 */
 const readwiseRequest = async (method, url, token, params) => {
  const response = await axios({
    method: method,
    url: url,
    headers: {
      Authorization: `Token ${token}`,
    },
    params: params,
  });  

  return response.data;
}

/**
* Retrieve all of the available results of type 'resource'.
* 
* @param {String} resource [Readwise resource to retrieve. ie. books, highlights]
* @param {String} token [Readwise API token]
* @param {Object} params [Data object containing request parameters]
* @return {Array} Collection of results where the type 'resource'
*/
const getAllResults = async (resource, token, params) => {
  let results = [];
  let url = BASE_URL + resource + "/";
  let complete = false;
  let num_tries = 0;
  let max_tries = 10;

  while(!complete && num_tries < max_tries) {
      num_tries += 1;

      try {
          let response = await readwiseRequest('GET', url, token, params);
          console.debug('Response:', response);

          if (response.results != null) {
              results.push(...response.results);
          }

          if (response.next == null) { 
              console.debug("All done.");
              complete = true;
          } else {
              console.debug("More to get...");
              url = response.next;
              params = null; // Params are already in the next url;
          }

      } catch (error) {
          console.log('Error:', error);
      }
  }

  return results;
}

export default {
  getDateForPage,
  blockTitle,
  pageName,
  clearPage,
  sleep,
  readwiseRequest,
  getAllResults,
};
