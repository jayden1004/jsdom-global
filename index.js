/*
 * enables jsdom globally.
 */

var KEYS = require('./keys')

var defaultHtml = '<!doctype html><html><head><meta charset="utf-8">' +
  '</head><body></body></html>'

module.exports = function globalJsdom (html, options) {
  if (html === undefined) {
    html = defaultHtml
  }

  if (options === undefined) {
    options = {}
  }

  // Idempotency
  if (global.navigator &&
    global.navigator.userAgent &&
    global.navigator.userAgent.indexOf('Node.js') > -1 &&
    global.document &&
    typeof global.document.destroy === 'function') {
    return global.document.destroy
  }

  var jsdom = require('jsdom')
  const resourceLoader = new jsdom.ResourceLoader({
    appCodeName: "Mozilla",
    appName: "Netscape",
    cookieEnabled: true,
    product: "Gecko",
    language: "en-GB",
    maxTouchPoints: 0,
    vendorSub: "",
    pdfViewerEnabled: true,
    productSub: "20030107",
    vendor: "Google Inc.",
    onLine: true,
    webdriver: false,
    languages: ["en-GB", "en-US", "en"],
    platform: "Win32",
    userAgent: options.customUserAgent,
  });
  console.log(resourceLoader);
  options.resources = resourceLoader;
  var document = new jsdom.JSDOM(html, options)
  var window = document.window

  KEYS.forEach(function (key) {
    global[key] = window[key]
  })

  global.document = window.document
  global.window = window
  window.console = global.console
  document.destroy = cleanup

  function cleanup () {
    KEYS.forEach(function (key) { delete global[key] })
  }

  return cleanup
}
