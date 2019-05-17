<div align="center">
	<br>
	<br>
	<img width="126" src="media/header.png" alt="Save Page State">
  <h3>Save Page State</h3>
	<br>
	<br>
</div>

> A browser extension to save the state of a page for further analysis

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/aokllhajmkihfihciggkmpgdhgecgaic.svg)](https://chrome.google.com/webstore/detail/save-page-state/aokllhajmkihfihciggkmpgdhgecgaic) ![](https://img.shields.io/david/vrtdev/save-page-state.svg) ![](https://img.shields.io/david/dev/vrtdev/save-page-state.svg)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](LICENSE)

## Highlights

- [DOM Snapshot](#dom-snapshot)
- [MHTML file](#mhtml-file)
- [Screenshot](#screenshot)
- [Metadata](#metadata)

## Install

Install the extension from the [chrome web store](https://chrome.google.com/webstore/detail/save-page-state/aokllhajmkihfihciggkmpgdhgecgaic) or [firefox add-ons](https://addons.mozilla.org/nl/firefox/addon/save-page-state/).

Or create a custom extension with this repo with limited access permission

## Customize

### Restrict Access Permission

In manifest.json (`/src/manifest.json`), replace `<all_urls>` with your own project URL pattern you wish to save the page states from.

```javascript
{
	...
	"content_scripts": [
		{
			"matches": ["<all_urls>"], // <- change this to your url pattern
			"js": ["js/content.js"]
		}
	],
	"permissions": ["activeTab", "pageCapture", "<all_urls>"]  // <- change this to your url pattern
	...
}
```

### Install dependencies

```
npm i
```

### Build

```
npm run build
```

Builds to `/build/prod`

### Publish

#### Chrome

Create a zip file from `/build/prod/chrome`
[upload it to the chrome web store](https://developer.chrome.com/webstore/publish#upload-your-app).

#### Firefox

Create a zip file from `/build/prod/firefox`
[upload it to the firefox developer hub](https://addons.mozilla.org/nl/developers/).

### Development

```
npm run dev:chrome // builds to /build/dev/chrome
npm run dev:firefox // builds to /build/dev/firefox
```

## Features

### DOM Snapshot

An HTML file containing the state of the DOM.

### MHTML file (chrome only for now)

> **Note** Firefox doesn't support saving an MHTML file natively yet.

An MHTML page with encapsulated resources, so you could immediately check the layout by opening the MHTML file in Chrome.

### Screenshot

A PNG image of the viewport.

### Metadata

Text file with extra metadata useful for debugging with the exact same state.

- **height**: viewport height
- **width**: viewport width
- **incognito**: is page loaded in incognito mode
- **status**: page loading status
- **title**: page title
- **url**: page URL
- **browser**: browser
- **browserVersion**: browser version
- **os**: operating system

## Maintainer

[![Wing Leung](https://github.com/wingleung.png?size=100)](https://github.com/wingleung)
