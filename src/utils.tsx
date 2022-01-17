import axios from 'axios';

const getOrdinalNum = (n) => {
  return (
    n +
    (n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '')
  );
};

const getDateForPage = (d, preferredDateFormat: string) => {
  const getYear = d.getFullYear();
  const getMonth = d.toString().substring(4, 7);
  const getMonthNumber = d.getMonth() + 1;
  const getDate = d.getDate();

  if (preferredDateFormat === 'MMM do yyyy') {
    return `${getMonth} ${getOrdinalNum(getDate)}, ${getYear}`;
  } else if (
    preferredDateFormat.includes('yyyy') &&
    preferredDateFormat.includes('MM') &&
    preferredDateFormat.includes('dd') &&
    ('-' || '_' || '/')
  ) {
    var mapObj = {
      yyyy: getYear,
      dd: ('0' + getDate).slice(-2),
      MM: ('0' + getMonthNumber).slice(-2),
    };
    let dateStr = preferredDateFormat;
    dateStr = dateStr.replace(/yyyy|dd|MM/gi, function (matched) {
      return mapObj[matched];
    });
    return dateStr;
  } else {
    return `${getMonth} ${getOrdinalNum(getDate)}, ${getYear}`;
  }
};

const blockTitle = (preferredDateFormat) => {
  const currDate = new Date();
  if (logseq.settings.retrievedTime) {
    return `[[${getDateForPage(
      currDate,
      preferredDateFormat
    )}]], ${currDate.toLocaleTimeString()}`;
  } else {
    return `[[${getDateForPage(currDate, preferredDateFormat)}]]`;
  }
};

const pageName = 'Readwise TOC';

const clearPage = async (arr) => {
  for (let i of arr) {
    console.log(`Deleting ${i.content}`);
    await logseq.Editor.removeBlock(i.uuid);
  }
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getHighlightsForBook = async (b, token) => {
  const response = await axios({
    method: 'get',
    url: 'https://readwise.io/api/v2/highlights/',
    headers: {
      Authorization: `Token ${token}`,
    },
    params: {
      book_id: b.id,
    },
  });

  return response;
};

const subsequentSyncs = async (i, booklist, token, pageSize) => {
  const response = await axios({
    method: 'get',
    url: `https://readwise.io/api/v2/books/?page=${i}`,
    headers: {
      Authorization: `Token ${token}`,
    },
    params: {
      page_size: pageSize,
    },
  });

  Array.prototype.push.apply(booklist, response.data.results);
};

export default {
  getDateForPage,
  blockTitle,
  pageName,
  clearPage,
  sleep,
  getHighlightsForBook,
  subsequentSyncs,
};
