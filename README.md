# Overview

This is a simple Readwise plugin to:

1. Pull in all your highlights from Readwise
2. For subsequent pulls, it only pulls in those not in the graph

# Samples

### Sample of a book highlight

![](/screenshots/sample-highlights.png)

### Sample of a tweet highlight

![](/screenshots/sample-tweet.png)

# Disclaimer

If you have multiple sources (e.g. books, tweets, instapaper) and thousands of highlights, the initial pull can take a while. You will have a progress bar to keep track on what's happening, and can terminate the pull process at any time.

Each source will have its own page in Logseq. If there has been an error, just remove the necessary pages and refresh your graph. Assuming that you do not have any filenames containing `(Readwise)`, you can use the following command in MacOS to remove all the pages added by the plugin. Be sure to refresh your graph in Logseq before attempting any new synchronisation.

`find . -name "*(Readwise)*"`

New highlights are found by comparing the date of the highlight against the date of the latest highlight in your last synchronisation. When using the plugin for the first time, the initial date is set to `1970-01-01T00:00:00Z`.

# Usage

### First Time

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
- [ ] Fix source of non-Kindle highlights.
- [ ] Will be incorporating the possibility of only pulling highlights for specific sources.

![GitHub all releases](https://img.shields.io/github/downloads/hkgnp/logseq-readwise-plugin/total)
