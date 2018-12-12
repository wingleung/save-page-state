import JSZip from 'jszip'
import saveAs from 'file-saver'

import {
  getTimestamp,
  getChromeVersion,
  formatJSONtoPlain,
  base64toBlob
} from './helpers'

let pageTitle = null
let currentTab = null
let metaData = null

const generatePageStateZip = dom => {
  const file = new Blob([dom], { type: 'text/html' })
  const fileName = `snapshot_${getTimestamp()}_${pageTitle.replace(
    /[<>:"\/\\|?*\x00-\x1F ]/g,
    '_'
  )}`

  const zipArchive = new JSZip()
  const zipRoot = zipArchive.folder(fileName)

  zipRoot.file('dom/snapshot.html', file)
  zipRoot.file('metadata.txt', formatJSONtoPlain(metaData))

  chrome.pageCapture.saveAsMHTML({ tabId: currentTab }, htmlData => {
    zipRoot.file('layout/snapshot.mhtml', htmlData)

    chrome.tabs.captureVisibleTab(null, {}, image => {
      const imageBlob = base64toBlob(
        image.replace(/^data:image\/\w+;base64,/, ''),
        'image/jpeg'
      )
      zipRoot.file('screenshot.png', imageBlob)

      zipArchive.generateAsync({ type: 'blob' }).then(content => {
        saveAs(content, `${fileName}.zip`)
      })
    })
  })
}

const savePageState = tab => {
  pageTitle = tab.title
  currentTab = tab.id
  metaData = {
    height: tab.height,
    width: tab.width,
    incognito: tab.incognito,
    status: tab.status,
    title: tab.title,
    url: tab.url,
    chromeVersion: getChromeVersion()
  }

  chrome.tabs.sendMessage(tab.id, { action: 'captureDOM' })
}

const handleBackgroundAction = ({ action, dom }) => {
  switch (action) {
    case 'captureDOM':
      generatePageStateZip(dom)
      break
    default:
      break
  }
}

chrome.browserAction.onClicked.addListener(savePageState)

chrome.runtime.onMessage.addListener(handleBackgroundAction)
