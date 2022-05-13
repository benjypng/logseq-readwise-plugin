import axios from "axios";

interface PluginSettings {
  pageSize: number;
  noOfBooks: number;
  noOfHighlights: number;
  noOfNewSources: number;
  bookList: any[];
  sync: boolean;
  loaded: boolean;
  isRefreshing: boolean;
  errorLoading: boolean;
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getTotalNumberOfHighlightsAndBooks = async (
  token: string,
  setPluginSettings: Function
) => {
  const response = await axios({
    method: "get",
    url: "https://readwise.io/api/v2/highlights/",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  const response2 = await axios({
    method: "get",
    url: "https://readwise.io/api/v2/books/",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  setPluginSettings((currSettings: PluginSettings) => ({
    ...currSettings,
    noOfHighlights: response.data.count,
    noOfBooks: response2.data.count,
  }));
};

export const loadFromReadwise = async (
  token: string,
  pageSize: number,
  setPluginSettings: Function
) => {
  console.log("Loading from Readwise...");
  // Log when is the latest retrieved
  console.log(`Latest retrieved date: ${logseq.settings.latestRetrieved}`);

  const promiseGetBooks = async (i: number) => {
    const response = await axios({
      method: "get",
      url: `https://readwise.io/api/v2/books/?page=${i}`,
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        page_size: pageSize,
        last_highlight_at__gt: logseq.settings.latestRetrieved,
      },
    });

    return response;
  };

  try {
    let i = 1;
    while (true) {
      try {
        const response = await promiseGetBooks(i);

        setPluginSettings((currSettings: PluginSettings) => ({
          ...currSettings,
          noOfNewSources: response.data.count,
          bookList: response.data.results,
        }));

        if (i * pageSize < response.data.count) {
          i++;
        } else {
          return;
        }
      } catch (e) {
        if (e.response.status === 404) {
          return;
        } else {
          const retryAfter =
            parseInt(e.response.headers["retry-after"]) * 1000 + 5000;

          await sleep(retryAfter);

          console.log("Trying a second time...");

          const response = await promiseGetBooks(i);

          if (response.data.detail === "Invalid page.") {
            break;
          } else {
            setPluginSettings((currSettings: PluginSettings) => ({
              ...currSettings,
              bookList: response.data.results,
            }));

            if (i * pageSize < response.data.count) {
              i++;
            } else {
              return;
            }

            i++;
          }
        }
      }
    }
  } catch (e) {
    setPluginSettings((currSettings: PluginSettings) => ({
      ...currSettings,
      errorLoading: true,
    }));
  }
};

export const getHighlightsForBook = async (
  id: number,
  token: string,
  setCoolingOff: Function
) => {
  let response: any;
  try {
    response = await axios({
      method: "get",
      url: "https://readwise.io/api/v2/highlights/",
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        book_id: id,
      },
    });
  } catch (e) {
    console.log(e);

    if (e.response.status === 429) {
      setCoolingOff(true);
    }

    const retryAfter =
      parseInt(e.response.headers["retry-after"]) * 1000 + 5000;

    await sleep(retryAfter);

    console.log("Trying a second time...");

    response = await axios({
      method: "get",
      url: "https://readwise.io/api/v2/highlights/",
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        book_id: id,
      },
    });

    setCoolingOff(false);
  }

  return response;
};
