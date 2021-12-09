![GitHub all releases](https://img.shields.io/github/downloads/hkgnp/logseq-readwise-plugin/total)

> Installing the plugin from the martketplace now works! If you are changing from manually loading the plugin to using the one from the marketplace, please read the [instructions here](https://github.com/hkgnp/logseq-readwise-plugin#migrating-from-manual-loading-to-marketplace) to prevent synchronising of duplicate data.

> If you have more than 100 sources, please update your plugin to the latest version (2.2). If you have tried to sync before, be sure to delete those files first before trying again. Thank you for your patience!

# Overview

This is a simple Readwise plugin to:

1. Pull in all your highlights from Readwise
2. For subsequent pulls, it only pulls in those not in the graph

# Samples

### Sample of a book highlight

![](/screenshots/sample-highlights.png)

### Sample of a tweet highlight

![](/screenshots/sample-tweet.png)

### Sample of a tweet thread

![](/screenshots/sample-tweetthread.png)

# Disclaimer

If you have multiple sources (e.g. books, tweets, instapaper) and thousands of highlights, the initial pull can take a while. You will have a progress bar to keep track on what's happening, and can terminate the pull process at any time.

Each source will have its own page in Logseq. If there has been an error, just remove the necessary pages and refresh your graph. Assuming that you do not have any filenames containing `(Readwise)`, you can use the following command in MacOS to remove all the pages added by the plugin. Be sure to refresh your graph in Logseq before attempting any new synchronisation.

`find . -name "*(Readwise)*"`

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

### First time

1. Go to your [Readwise Access Token](https://readwise.io/access_token) page and obtain a new token. Keep this token somewhere safe.
2. Download the latest release of the plugin [here](https://github.com/hkgnp/logseq-readwise-plugin/releases).
3. Unzip the file to where you normally store your unpacked plugins.
4. In Logseq, load the unpacked plugin.
5. Click on the icon in the plugins bar.
6. If you are using the plugin for the first time, do remember to click the button `Click here if you are using this plugin for the first time`.
7. Key in the token that you obtained in (1) and click `Save Token`.
8. Review the number of sources and highlights that you have.
9. Click button to sync highlights.

![](/screenshots/sync.png)

### Subsequent times

1. Click refresh to retrieve the recent number of changes.
2. Click button to sync highlights.

# Future

- [x] Change style of popup.
- [x] Fix issue of pulling new highlights removing old blocks from existing pages.
- [x] Fix source of non-Kindle highlights.
- [ ] Will be incorporating the possibility of only pulling highlights for specific sources.
