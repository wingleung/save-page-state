import { DOMtoString } from './helpers'

const handlePageAction = req => {
  switch (req.action) {
    case 'captureDOM':
      chrome.runtime.sendMessage({
        action: 'captureDOM',
        dom: DOMtoString(document)
      })
      break
    default:
      break
  }
}

chrome.runtime.onMessage.addListener(handlePageAction)
