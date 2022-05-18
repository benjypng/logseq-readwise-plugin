import React, { useState } from "react";
import { getHighlightsForBook, sleep } from "../services/utilities";
import {
  returnKindleHighlights,
  returnOtherHighlights,
  returnPageMetaData,
  returnImage,
} from "../services/checkOrgOrMarkdown";
import ProgressBar from "./ProgressBar";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

const Sync = (props: {
  loaded: boolean;
  sync: boolean;
  terminate: Function;
  bookList: any[];
  token: string;
  setPluginSettings: Function;
}) => {
  const { sync, terminate, bookList, token, setPluginSettings } = props;

  const [progressPercentage, setProgressPercentage] = useState(0);
  const [coolingOff, setCoolingOff] = useState(false);

  const { customTitle, metaData, height, width, sectionHeader } =
    logseq.settings.template;

  const { preferredDateFormat, orgOrMarkdown } = logseq.settings;

  const getHighlightsForEachBook = async () => {
    if (customTitle === "" || sectionHeader === "") {
      logseq.App.showMsg("Your template is not set up yet!", "error");
      return;
    } else if (bookList.length === 0) {
      logseq.App.showMsg("There are no new sources to sync!", "success");
      return;
    }

    // Change sync status
    setPluginSettings((currSettings) => ({ ...currSettings, sync: true }));

    // Handle progress bar
    // If there are 200 books, each interval will be 0.5
    const interval: number = parseFloat((100 / bookList.length).toFixed(2));

    for (const b of bookList) {
      setProgressPercentage(
        (progressPercentage) => progressPercentage + interval
      );

      // Get highlights for book
      const bookHighlights = await getHighlightsForBook(
        b.id,
        token,
        setCoolingOff
      );

      sleep(2000);

      // Filter only the latest highlights
      const latestHighlights = bookHighlights.data.results.filter(
        (b) => new Date(b.updated) > new Date(logseq.settings.latestRetrieved)
      );

      if (latestHighlights.length === 0) {
        console.log(`No highlights found for '${b.title}'`);
        continue;
      }

      // Prepare latest highlights for logeq insertion
      let latestHighlightsArr: any[] = [];
      if (b.source === "kindle") {
        for (const h of latestHighlights) {
          latestHighlightsArr.push(
            returnKindleHighlights(
              orgOrMarkdown,
              h.location,
              h.asin,
              h.highlighted_at,
              preferredDateFormat,
              h.tags,
              h.text
            )
          );
        }
      } else {
        for (const h of latestHighlights) {
          latestHighlightsArr.push(
            returnOtherHighlights(
              orgOrMarkdown,
              h.url,
              h.highlighted_at,
              preferredDateFormat,
              h.tags,
              h.text,
              height,
              width
            )
          );
        }
      }

      // remove speccial characters
      const bookTitle = b.title
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
        .replace(
          /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
          ""
        )
        .replace(/\s+/g, " ")
        .trim();

      console.log(`Updating ${bookTitle}`);

      const pageName = customTitle
        .replace("%title%", bookTitle)
        .replace("%author%", b.author)
        .replace("%category%", b.category)
        .replace("%source%", b.source);

      await logseq.Editor.createPage(pageName);

      // Set Title
      logseq.App.pushState("page", {
        name: customTitle
          .replace("%title%", bookTitle)
          .replace("%author%", b.author)
          .replace("%category%", b.category)
          .replace("%source%", b.source),
      });

      sleep(1000);

      const currPage = await logseq.Editor.getCurrentPage();

      // Check if page is empty. If empty, create the basic template. If not empty, update only the Readwise Highlights section
      const pageBlocksTree = await logseq.Editor.getCurrentPageBlocksTree();

      // Create new page
      if (pageBlocksTree.length === 0 || pageBlocksTree[0].content === "") {
        // Set metaData
        await logseq.Editor.insertBlock(
          currPage.name,
          returnPageMetaData(
            orgOrMarkdown,
            preferredDateFormat,
            b.author,
            b.category,
            b.source,
            b.tags,
            metaData
          ),
          { isPageBlock: true }
        );

        // Set image
        await logseq.Editor.insertBlock(
          currPage.name,
          returnImage(orgOrMarkdown, b.cover_image_url, height, width),
          { sibling: true, isPageBlock: true }
        );

        // Set Section Header
        const highlightsBlock = await logseq.Editor.insertBlock(
          currPage.name,
          `${sectionHeader}`,
          { sibling: true, isPageBlock: true }
        );

        if (logseq.settings.sortRecentFirst) {
          await logseq.Editor.insertBatchBlock(
            highlightsBlock.uuid,
            latestHighlightsArr,
            {
              sibling: false,
            }
          );
        } else {
          await logseq.Editor.insertBatchBlock(
            highlightsBlock.uuid,
            latestHighlightsArr.reverse(),
            {
              sibling: false,
            }
          );
        }
        if (pageBlocksTree[0].content === "") {
          await logseq.Editor.removeBlock(pageBlocksTree[0].uuid);
        }
      } else {
        // Add to highlights section
        const highlightsBlock = pageBlocksTree.filter(
          (b) => b.content === sectionHeader
        );

        // Check if section header is on the page. If not, create it.
        if (!highlightsBlock[0]) {
          console.log(
            `${b.title} had changes made to its [[Readwise Highlights]] block.`
          );
          const highlightsBlock = await logseq.Editor.insertBlock(
            currPage.name,
            sectionHeader,
            {
              isPageBlock: true,
            }
          );

          await logseq.Editor.insertBatchBlock(
            highlightsBlock.uuid,
            latestHighlightsArr.reverse(),
            {
              sibling: false,
              before: false,
            }
          );
        }

        console.log(highlightsBlock[0]);
        const lastBlk = highlightsBlock[0].children[
          highlightsBlock[0].children.length - 1
        ] as BlockEntity;
        console.log(lastBlk);
        await logseq.Editor.insertBatchBlock(
          lastBlk.uuid,
          latestHighlightsArr.reverse(),
          {
            sibling: true,
            before: false,
          }
        );
      }
    }

    // Reset bootkList
    await setPluginSettings((currSettings) => ({
      ...currSettings,
      sync: false,
      noOfNewSources: 0,
    }));

    logseq.App.showMsg(
      "Highlights imported! If you made any changes to the [[Readwise Highlights]] block before you synced, you may need to revist those pages to remove duplicate higlights. Please refer to the console in Developer Tools for these pages.",
      "success"
    );

    // Reset progress bar
    setProgressPercentage(0);

    // Update settings with latest retrieved date
    logseq.updateSettings({
      latestRetrieved: bookList[0].last_highlight_at,
    });
  };

  return (
    <div className="flex flex-col py-2 bg-white">
      <p className="text-2xl font-bold">Step 3: Sync!</p>
      <p>
        Syncing more than 20 sources will take a longer time because of
        Readwise's API limits.
      </p>
      <div className="my-2">
        {/* Only show when setState has completed. */}
        {!sync && (
          <button
            // onClick={this.syncReadwise}
            className="border bg-blue-500 text-white px-2 py-1 rounded"
            onClick={getHighlightsForEachBook}
          >
            Sync New Sources
          </button>
        )}

        {/* Only show when Syncing */}
        {sync && (
          <button
            onClick={() => {
              terminate();
            }}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Stop Syncing (please reload plugin)
          </button>
        )}

        {/* Only show when cooling off */}
        {coolingOff && (
          <p className="text-red-400 font-bold text-sm">
            Please wait for Readwise's cooling off period to lapse.
          </p>
        )}

        {/* Start progress bar */}
        <div className="relative pt-1 mt-3">
          <ProgressBar progressPercentage={progressPercentage} />
        </div>
        {/* End progress bar */}
      </div>
    </div>
  );
};

export default Sync;
