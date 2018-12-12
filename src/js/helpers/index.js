const getTimestamp = () => {
  const time = new Date()
  const months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec'
  ]
  const month = months[time.getMonth()]
  const date = time.getDate()
  let hour = time.getHours()
  hour = hour < 10 ? `0${hour}` : hour
  let min = time.getMinutes()
  min = min < 10 ? `0${min}` : min
  let sec = time.getSeconds()
  sec = sec < 10 ? `0${sec}` : sec

  return `${date + month}_${hour}${min}${sec}`
}

const getChromeVersion = () => {
  const match = window.navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9\.]+)/)
  return match ? match[1] : null
}

const formatJSONtoPlain = jsonData => {
  let plainTxt = ''

  for (const name in jsonData) {
    plainTxt = `${plainTxt + name}: ${jsonData[name]}\n`
  }

  return plainTxt
}

const base64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }
  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

const DOMtoString = document_root => {
  var html = '',
    node = document_root.firstChild
  while (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        html += node.outerHTML
        break
      case Node.TEXT_NODE:
        html += node.nodeValue
        break
      case Node.CDATA_SECTION_NODE:
        html += '<![CDATA[' + node.nodeValue + ']]>'
        break
      case Node.COMMENT_NODE:
        html += '<!--' + node.nodeValue + '-->'
        break
      case Node.DOCUMENT_TYPE_NODE:
        // (X)HTML documents are identified by public identifiers
        html +=
          '<!DOCTYPE ' +
          node.name +
          (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') +
          (!node.publicId && node.systemId ? ' SYSTEM' : '') +
          (node.systemId ? ' "' + node.systemId + '"' : '') +
          '>\n'
        break
    }
    node = node.nextSibling
  }
  return html
}

export {
  getTimestamp,
  getChromeVersion,
  formatJSONtoPlain,
  base64toBlob,
  DOMtoString
}
