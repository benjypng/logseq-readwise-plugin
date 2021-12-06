# Overview

This is a simple Readwise plugin to:

1. Creates a 'Table of Contents' from your sources
2. Pull in all your highlights from Readwise
3. For subsequent pulls, it only pulls in those not in the graph

# Disclaimer

If you have multiple sources (e.g. books, tweets, instapaper) and thousands of highlights, the initial pull can take a while. You will have a progress bar to keep track on what's happening, and can terminate the pull process at any time. You can then refer to the page that you will be brought to, and the Table of Contents to see what has and has not been synced.

# Usage

1. Go to your [Readwise Access Token](https://readwise.io/access_token) page and obtain a new token. Keep this token somewhere safe.
2. Download the latest release of the plugin [here](https://github.com/hkgnp/logseq-readwise-plugin/releases).
3. Unzip the file to where you normally store your unpacked plugins.
4. In Logseq, load the unpacked plugin.
5. Click on the icon in the plugins bar.
6. Key in the token that you obtained in (1) and click `Save Token`.
7. Review the number of sources and highlights that you have.
8. Choose to either sync highlights or sync only the 'Table of Contents'.

# Future

- Redesign the popup.
- Will be incorporating the possibility of only pulling highlights for specific sources.
