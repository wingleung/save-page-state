import JSZip from 'jszip'
import saveAs from 'file-saver'

import {
  getTimestamp,
  getBrowserData,
  formatJSONtoPlain,
  base64toBlob
} from './helpers'

window.browser = window.browser || window.chrome

let browserData = null
let pageTitle = null
let currentTab = null
let metaData = null

const getFileName = () =>
  `snapshot_${getTimestamp()}_${pageTitle.replace(
    /[<>:"\/\\|?*\x00-\x1F ]/g,
    '_'
  )}`

const getImageBlob = image =>
  base64toBlob(image.replace(/^data:image\/\w+;base64,/, ''), 'image/jpeg')

const captureVisibleTab = () =>
  browserData.isChrome
    ? new Promise(resolve => {
        browser.tabs.captureVisibleTab(null, {}, image => resolve(image))
      })
    : browser.tabs.captureVisibleTab()

const generateMHTML = () =>
  new Promise(resolve => {
    chrome.pageCapture.saveAsMHTML({ tabId: currentTab }, htmlData => {
      resolve(htmlData)
    })
  })

const downloadFile = (blob, fileName) => {
  if (browserData.isChrome) {
    saveAs(blob, fileName)
  } else {
    browser.tabs.sendMessage(currentTab, {
      action: 'saveFile',
      file: {
        content: blob,
        name: fileName
      }
    })
  }
}

const generatePageStateZip = async dom => {
  const file = new Blob([dom], { type: 'text/html' })
  const fileName = getFileName()

  const zipArchive = new JSZip()
  const zipRoot = zipArchive.folder(fileName)

  zipRoot.file('dom/snapshot.html', file)
  zipRoot.file('metadata.txt', formatJSONtoPlain(metaData))

  const image = await captureVisibleTab()
  zipRoot.file('screenshot.png', getImageBlob(image))

  if (browserData.isChrome) {
    const htmlData = await generateMHTML()
    zipRoot.file('layout/snapshot.mhtml', htmlData)
  }

  const blob = await zipArchive.generateAsync({ type: 'blob' })
  downloadFile(blob, `${fileName}.zip`)
}

const savePageState = tab => {
  browserData = getBrowserData()
  pageTitle = tab.title
  currentTab = tab.id
  metaData = {
    height: tab.height,
    width: tab.width,
    incognito: tab.incognito,
    status: tab.status,
    title: tab.title,
    url: tab.url,
    browser: browserData.name,
    browserVersion: browserData.version,
    os: browserData.os
  }

  browser.tabs.sendMessage(tab.id, { action: 'captureDOM' })
}

const handleBackgroundAction = ({ action, dom }) => {
  switch (action) {
    case 'captureDOM':
      generatePageStateZip(dom).then(() => console.log('downloaded page state'))
      break
    default:
      break
  }
}

browser.browserAction.onClicked.addListener(savePageState)

browser.runtime.onMessage.addListener(handleBackgroundAction)
