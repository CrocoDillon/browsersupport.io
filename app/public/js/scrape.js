(function () {
  'use strict';

  var getPropertyNames = function (object) {
        var names = [],
            name;
        if (Object.getOwnPropertyNames) {
          names = Object.getOwnPropertyNames(object)
        } else {
          for (name in object) {
            if (!object.hasOwnProperty || object.hasOwnProperty(name)) {
              names.push(name);
            }
          }
        }
        return names;
      },
      getPropertySymbols = function (object) {
        var symbols = [];
        if (Object.getOwnPropertySymbols) {
          symbols = Object.getOwnPropertySymbols(object);
        }
        return symbols;
      },
      symbolToString = function (symbol) {
        return symbol.toString().replace(/^Symbol\(Symbol\.|\)$/g, '');
      },
      forEach = function (array, fn) {
        for (var i = 0; i < array.length; i++) {
          fn(array[i]);
        }
      },
      map = function (array, fn) {
        var mappedArray = [];
        forEach(array, function (element) {
          mappedArray.push(fn(element));
        });
        return mappedArray;
      },
      scrapedProperties = [];

  // Scrape global properties
  forEach(getPropertyNames(window), function (globalProperty) {
    scrapedProperties.push(globalProperty);

    if (window[globalProperty] === undefined ||
        window[globalProperty] === null ||
        // `window['sessionStorage|localStorage'] === window` throws in IE8 (Class doesn't support Automation)
        (globalProperty !== 'sessionStorage' && globalProperty !== 'localStorage' && window[globalProperty] === window)) {
      return;
    }

    try {
      // Sub-property names
      forEach(getPropertyNames(window[globalProperty]), function (subProperty) {
        scrapedProperties.push(globalProperty + '.' + subProperty);
      });
      // Sub-property symbols
      getPropertySymbols(window[globalProperty]).forEach(function (subProperty) {
        subProperty = symbolToString(subProperty);
        scrapedProperties.push(globalProperty + '[@@' + subProperty + ']');
      });
    } catch (e) {
      window.console && window.console.log(globalProperty, e);
    }

    if (window[globalProperty].prototype) {
      // Prototype names
      forEach(getPropertyNames(window[globalProperty].prototype), function (subProperty) {
        scrapedProperties.push(globalProperty + '.prototype.' + subProperty);
      });

      // Prototype symbols
      forEach(getPropertySymbols(window[globalProperty].prototype), function (subProperty) {
        subProperty = symbolToString(subProperty);
        scrapedProperties.push(globalProperty + '.prototype[@@' + subProperty + ']');
      });
    }
  });

  var pre = document.createElement('pre');
  pre.innerHTML += 'Scraped ' + scrapedProperties.length + ' properties:\n\n';
  pre.innerHTML += scrapedProperties.join('\n');
  document.body.appendChild(pre);

  // Can't use JSON.stringify because it isn't supported by all browsers
  var scrapedPropertiesJSON =
    '{"names":[' +
    map(scrapedProperties, function (name) {
      return '"' + name + '"';
    }).join(',') +
    ']}';
  // jQuery is  included after this script so it doesn't add globals, this function is called after that
  window.sendDataToServer = function () {
    jQuery.ajax(window.location.href, {
      method: 'POST',
      data: scrapedPropertiesJSON,
      contentType: 'application/json',
      success: function (response) {
        pre.innerHTML = response + '\n\n' + pre.innerHTML;
      },
      error: function () {
        pre.innerHTML = 'Error sending data to server :(\n\n' + pre.innerHTML;
      }
    });
  };
}());
