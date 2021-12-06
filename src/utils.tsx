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

export default { getDateForPage, blockTitle, pageName, clearPage, sleep };
