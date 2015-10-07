(function () {
  'use strict';

  var getProperty = function (fullName, context, name) {
        var o = { name: fullName },
            parseDescriptor = function (value) {
              switch (typeof value) {
              case 'function':
                return value.name + '/' + value.length;
              case 'boolean':
              case 'number':
              case 'string':
              case 'undefined':
                return value;
              case 'symbol':
                return '[object Symbol]';
              default:
                if (value === null) return null;
                try {
                  return Object.prototype.toString.call(value);
                } catch (e) {
                  return '[object Object]';
                }
              }
            };
        // Add superclass or parent, if any
        try {
          o.superclass = context[name].prototype.__proto__.constructor.name;
        } catch (e) {}
        // Add property descriptor
        if (Object.getOwnPropertyDescriptor) {
          var descriptor = Object.getOwnPropertyDescriptor(context, name),
              parsed = {};
          if ('value' in descriptor) { parsed.value = parseDescriptor(descriptor.value); }
          if ('writable' in descriptor) { parsed.writable = descriptor.writable; }
          if ('get' in descriptor) { parsed.get = parseDescriptor(descriptor.get); }
          if ('set' in descriptor) { parsed.set = parseDescriptor(descriptor.set); }
          parsed.configurable = descriptor.configurable;
          parsed.enumerable = descriptor.enumerable;
          o.descriptor = parsed;
        }
        return o;
      },
      getPropertyNames = function (object) {
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
  forEach(getPropertyNames(window), function (globalPropertyName) {
    var globalProperty = window[globalPropertyName],
        prototype;

    scrapedProperties.push(getProperty(globalPropertyName, window, globalPropertyName));

    if (globalProperty === undefined ||
        globalProperty === null ||
        // `window['sessionStorage|localStorage'] === window` throws in IE8 (Class doesn't support Automation)
        (globalPropertyName !== 'sessionStorage' && globalPropertyName !== 'localStorage' && globalProperty == window)) {
      return;
    }

    try {
      // Sub-property names
      forEach(getPropertyNames(globalProperty), function (subProperty) {
        scrapedProperties.push(getProperty(globalPropertyName + '.' + subProperty, globalProperty, subProperty));
      });
      // Sub-property symbols
      getPropertySymbols(globalProperty).forEach(function (subProperty) {
        var subPropertyString = symbolToString(subProperty);
        scrapedProperties.push(getProperty(globalPropertyName + '[@@' + subPropertyString + ']', globalProperty, subProperty));
      });
    } catch (e) {
      window.console && window.console.log(globalPropertyName, e);
    }

    if (prototype = globalProperty.prototype) {
      // Prototype names
      forEach(getPropertyNames(prototype), function (subProperty) {
        scrapedProperties.push(getProperty(globalPropertyName + '.prototype.' + subProperty, prototype, subProperty));
      });

      // Prototype symbols
      forEach(getPropertySymbols(prototype), function (subProperty) {
        var subPropertyString = symbolToString(subProperty);
        scrapedProperties.push(getProperty(globalPropertyName + '.prototype[@@' + subPropertyString + ']', prototype, subProperty));
      });
    }
  });

  var pre = document.createElement('pre');
  pre.innerHTML += 'Scraped ' + scrapedProperties.length + ' properties:\n\n';
  pre.innerHTML += map(scrapedProperties, function (p) { return p.name; }).join('\n');
  document.body.appendChild(pre);

  // jQuery is  included after this script so it doesn't add globals, this function is called after that
  window.sendDataToServer = function () {
    jQuery.ajax(window.location.href, {
      method: 'POST',
      data: JSON.stringify(scrapedProperties),
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
