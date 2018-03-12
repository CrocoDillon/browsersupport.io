;(function() {
  'use strict'

  var scrapedProperties = []
  var feedback = document.getElementById('feedback')

  feedback.innerHTML = 'Scraping started'

  function symbolToString(symbol) {
    return symbol.toString().replace(/^Symbol\(Symbol\.|\)$/g, '')
  }

  // Scrape global properties
  Object.getOwnPropertyNames(window).forEach(function(globalPropertyName) {
    var globalProperty = window[globalPropertyName]

    scrapedProperties.push(globalPropertyName)

    if (
      globalProperty === undefined ||
      globalProperty === null ||
      globalProperty === window
    ) {
      return
    }

    try {
      // Sub-property names
      Object.getOwnPropertyNames(globalProperty).forEach(function(subProperty) {
        scrapedProperties.push(globalPropertyName + '.' + subProperty)
      })
      // Sub-property symbols
      if (Object.getOwnPropertySymbols) {
        Object.getOwnPropertySymbols(globalProperty).forEach(function(
          subProperty
        ) {
          var subPropertyString = symbolToString(subProperty)
          scrapedProperties.push(
            globalPropertyName + '[@@' + subPropertyString + ']'
          )
        })
      }

      if (globalProperty.prototype) {
        var prototype = globalProperty.prototype

        // Prototype names
        Object.getOwnPropertyNames(prototype).forEach(function(subProperty) {
          scrapedProperties.push(
            globalPropertyName + '.prototype.' + subProperty
          )
        })

        // Prototype symbols
        if (Object.getOwnPropertySymbols) {
          Object.getOwnPropertySymbols(prototype).forEach(function(
            subProperty
          ) {
            var subPropertyString = symbolToString(subProperty)
            scrapedProperties.push(
              globalPropertyName + '.prototype[@@' + subPropertyString + ']'
            )
          })
        }
      }
    } catch (e) {}

    feedback.innerHTML = 'Scraping... [' + scrapedProperties.length + ']'
  })

  feedback.innerHTML = 'Sending... [' + scrapedProperties.length + ']'

  var request = new XMLHttpRequest()
  request.addEventListener('load', function onLoad() {
    console.log(this.responseText)
    feedback.innerHTML = 'Done! [' + scrapedProperties.length + ']'
  })
  request.open('POST', '/')
  request.setRequestHeader('Content-Type', 'application/json')
  request.send(JSON.stringify(scrapedProperties))
})()
