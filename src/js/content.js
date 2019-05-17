import { DOMtoString } from './helpers'

window.browser = window.browser || window.chrome

const click = node => {
  try {
    node.dispatchEvent(new MouseEvent('click'))
  } catch (e) {
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null
    )
    node.dispatchEvent(evt)
  }
}

const saveAs = (blob, name, opts) => {
  var URL = window.URL || window.webkitURL
  var a = document.createElement('a')
  name = name || blob.name || 'download'

  a.download = name
  a.rel = 'noopener' // tabnabbing

  // Support blobs
  a.href = URL.createObjectURL(blob)
  setTimeout(function() {
    URL.revokeObjectURL(a.href)
  }, 4e4) // 40s
  setTimeout(function() {
    click(a)
  }, 0)
}

const handlePageAction = req => {
  switch (req.action) {
    case 'captureDOM':
      browser.runtime.sendMessage({
        action: 'captureDOM',
        dom: DOMtoString(document)
      })
      break
    case 'saveFile':
      console.log('saving file...', req)
      saveAs(req.file.content, req.file.name)
      break
    default:
      break
  }
}

browser.runtime.onMessage.addListener(handlePageAction)
