[:gift_heart: Sponsor this project on Github](https://github.com/sponsors/hkgnp) or [:coffee: Get me a coffee](https://www.buymeacoffee.com/hkgnp.dev) if you like this plugin!

> README below is outdated since the major change on 14/2/2022. Pending a rewrite.

# Overview

This is a simple Readwise plugin to:

1. Pull in all your highlights from Readwise
2. For subsequent pulls, it only pulls in those not in the graph

There is now a [FAQ](https://github.com/hkgnp/logseq-readwise-plugin#detailed-instructions) that you may find helpful to read before you use this plugin.

# Samples

### Sample of a book highlight

![](/screenshots/sample-highlights.png)

### Sample of a tweet highlight

![](/screenshots/sample-tweet.png)

### Sample of a tweet thread

![](/screenshots/sample-tweetthread.png)

# Random Highlights

![](/screenshots/demo.gif)

![](/screenshots/inline-random.gif)

# Book View

If you would like to view all your imported books as cards, you can use the Book Renderer function. Simply go to any block and trigger it by typing `/Book Renderer`.

![](/screenshots/renderer.gif)

# Disclaimer

If you have multiple sources (e.g. books, tweets, instapaper) and thousands of highlights, the initial pull can take a while. You will have a progress bar to keep track on what's happening, and can terminate the pull process at any time.

Each source will have its own page in Logseq. If there has been an error, just remove the necessary pages and refresh your graph. Assuming that you do not have any filenames containing `(Readwise)`, you can use the following command in MacOS to remove all the pages added by the plugin. Be sure to refresh your graph in Logseq before attempting any new synchronisation.

`find . -name "*(Readwise)*" -delete`

New highlights are found by comparing the date of the highlight against the date of the latest highlight in your last synchronisation. When using the plugin for the first time, the initial date is set to `1970-01-01T00:00:00Z`.

# Usage

### Migrating from manual loading to marketplace

**BEFORE YOU INSTALL FROM THE MARKETPLACE**, please follow the instructions below to avoid synchronising duplicate highlights:

1. Go to the settings folder of the manually loaded plugin (Windows: `C:\Users\Peter\.logseq\settings` or MacOS: `~/.logseq/settings).
2. Open the file `logseq-readwise-plugin.json` and copy the contents of the file somewhere.
3. Uninstall the manually loaded plugin.
4. Install the plugin from the marketplace.
5. Click on the settings icon in the plugins page and click `Open settings`.
   ![](/screenshots/settings.png).
6. Copy the contents in Step 2 and paste it in the file that opens up. Save and close the file.
7. Restart Logseq.
8. You can start to use the plugin after!

### First time (from the marketplace - preferred)

1. Go to your [Readwise Access Token](https://readwise.io/access_token) page and obtain a new token. Keep this token somewhere safe.
2. Download the logseq-readwise-plugin from the Logseq marketplace.
3. Click on the icon (📖) in the plugins bar.
4. If you are using the plugin for the first time, do remember to click the button `Click here if you are using this plugin for the first time`.
5. Key in the token that you obtained in (1) and click `Save Token`.
6. Review the number of sources and highlights that you have.
7. Click button to sync highlights.

![](/screenshots/sync.png)

### Subsequent times

1. Click refresh to retrieve the recent number of changes.
2. Click button to sync highlights.

# Detailed Instructions

## How do I reset the export of my whole library, e.g. to start afresh?

As this plugin is still new, you may encounter situations where you want to reset your export. Firstly, thank you so much for trying this plugin out and reporting the bugs that I've missed! Secondly, you can reset by one of 2 approaches:

**Please backup your graph before attempting any of the below**

1. Using a script to find all files ending with `(Readwise)` and deleting them. Naturally, this \*\*assumes that you do not have any other pages whose name includes `(Readwise)` if not they will be deleted as well. After deleting the files, please restart Logseq and refresh your graph. A MacOS script example would be:

`find . -name "*(Readwise)*" -delete`

2. Using File Explorer (Windows) or Finder (MacOS) to find these files and delete them manually. Files created by this plugin have `(Readwise)` added to the end of their filenames.

## What happens when I take new highlights? Do they sync automatically with Logseq?

Not really. When you open Logseq and click on the plugin button (📖), you will see the new number of sources that you took highlights from since your last sync. If you would like to sync those sources, you can proceed to click on the `Sync New Sources` button.

## What is a source?

A source is basically a book, a twitter account, etc that contains highlights.

## Why are new pages being created?

If the new highlight(s) is from a new source, a new page in Logseq will be created. If it is from an _existing_ source, the highlight(s) will be appended to the top of your current highlights list, right under the `Readwise Highlights` block.

Certain services such as Amazon Kindle, Instapaper do not provide automatic synchronisation with Readwise. In these cases, you can either wait for it to appear as a new source in the plugin, or proceed to your Readwise dashboard to manually sync them, and then initiate the sync from the plugin button (📖).

## How do I trigger a new sync from Logseq?

By default, the plugin will automatically sync when you open the Logseq app and look for new highlights. You can then click the `Sync New Sources` button to initiate the sync.

Without clicking `Sync New Sources` button, the plugin will not automatically create pages or pull highlights in for you.

## What happens when I update highlights in Readwise? Will those changes automatically sync with Logseq (or vice versa)?

Unfortunately not. It will be technically challenging to look for that specific highlight within a page, and make changes to it without the possibility to accidentally removing edits made by the user.

## Can I rename the page in Logseq?

Unfortunately not as well. The plugin uses the original name given to the source to find and add subsequent highlights. If you rename it, when there are new highlights, a new page will be created for the source (with the old name). Hence, you should only rename when you do not expect any more highlights from that source, e.g. a book that you know you will not make any more highlights for it.

## Can I edit the page that the plugin created for a source?

Yes and no. As long as you **do not** change any of the below, you may edit the page, e.g. add in your own thoughts as child blocks under the highlights.

- Rename the block `[[Readwise Highlights]]`.
- Convert the block `[[Readwise Highlights]]` to a child block.

The above is because `[[Readwise Highlights]]` is used when syncing new highlights to that source. If you have done any of the above, a new block called `[[Readwise Highlights]]` will be created and the highlights added under it. You will then need to clean it up after.

## Where does the Location link in each Kindle highlight take me?

If you have the Kindle app installed on your desktop, you will be brought directly to the highlight in the Kindle app when you click on the link.

## What do I do if I have other Feature Requests to suggest or bugs to report?

Feel free to look for me on Discord, or just opening an issue in this repository.

Thanks for trying out the plugin!

_Adapted from [Readwise's help article for Obsidian](https://help.readwise.io/article/125-how-does-the-readwise-to-obsidian-export-integration-work)_

# Future

- [x] Change style of popup.
- [x] Fix issue of pulling new highlights removing old blocks from existing pages.
- [x] Fix source of non-Kindle highlights.
- [x] Account for cases that have more than 1000 cases.
- [ ] Refactor code.
- [ ] Will be incorporating the possibility of only pulling highlights for specific sources.

# Credits

Big thanks to [@MattHulse](https://github.com/MattHulse) for helping to contributing to the code (duplicate source with same name, but has no highlights)!
