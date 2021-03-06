;(function() {
  var document = window.document
  var Symbol = window.Symbol

  var feedback = document.getElementById('feedback')
  var form = document.getElementById('detect-form')

  var propRe = /^([^.]+)$/
  var propNameRe = /^([^.]+)\.([^.]+)$/
  var propSymbolRe = /^([^.]+)\[@@([^.]+)\]$/
  var propProtoNameRe = /^([^.]+)\.prototype\.([^.]+)$/
  var propProtoSymbolRe = /^([^.]+)\.prototype\[@@([^.]+)\]$/

  function createXMLHttpRequest() {
    if (window.XMLHttpRequest) {
      return new window.XMLHttpRequest()
    } else {
      return new window.ActiveXObject('Microsoft.XMLHTTP')
    }
  }

  function detectProperty(name) {
    var property = { name: name }

    var match
    var parent

    var prop
    var propName
    var propSymbol
    var propProtoName
    var propProtoSymbol

    function detectParent() {
      if (window[parent] != null) {
        return true
      }

      property.parent = false

      return false
    }

    function detectParentProto() {
      if (window[parent].prototype != null) {
        return true
      }

      property.parentProto = false

      return false
    }

    function detectSymbol() {
      if (Symbol) {
        return true
      }

      property.symbol = false

      return false
    }

    try {
      if ((match = property.name.match(propProtoSymbolRe))) {
        parent = match[1]
        propProtoSymbol = match[2]

        if (detectParent() && detectParentProto() && detectSymbol()) {
          property['in'] = Symbol[propProtoSymbol] in window[parent].prototype
          property.own = window[parent].prototype.hasOwnProperty(
            Symbol[propProtoSymbol]
          )
        }
      } else if ((match = property.name.match(propProtoNameRe))) {
        parent = match[1]
        propProtoName = match[2]

        if (detectParent() && detectParentProto()) {
          property['in'] = propProtoName in window[parent].prototype
          property.own = window[parent].prototype.hasOwnProperty(propProtoName)
        }
      } else if ((match = property.name.match(propSymbolRe))) {
        parent = match[1]
        propSymbol = match[2]

        if (detectParent() && detectSymbol()) {
          property['in'] = Symbol[propSymbol] in window[parent]
          property.own = window[parent].hasOwnProperty(Symbol[propSymbol])
        }
      } else if ((match = property.name.match(propNameRe))) {
        parent = match[1]
        propName = match[2]

        if (detectParent()) {
          property['in'] = propName in window[parent]
          property.own = window[parent].hasOwnProperty(propName)
        }
      } else if ((match = property.name.match(propRe))) {
        prop = match[1]

        property['in'] = prop in window
        property.own = window.hasOwnProperty(prop)
      }
    } catch (e) {
      property.throws = true
    }

    return property
  }

  form.onsubmit = function() {
    var browser = document.getElementById('browser').value
    var version = document.getElementById('version').value
    var secret = document.getElementById('secret').value

    // Total detected properties so far
    var total = 0

    // Hide form to prevent submitting twice
    form.style.display = 'none'

    function batch() {
      var request = createXMLHttpRequest()
      request.open(
        'GET',
        '/api/' +
          browser +
          '/' +
          version +
          '/properties?' +
          new Date().getTime()
      )
      request.setRequestHeader('Content-Type', 'application/json')
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          var properties = eval(request.responseText)

          if (properties.length === 0) {
            window.location.reload()
            return
          }

          var detectedProperties = []

          for (var i = 0; i < properties.length; i++) {
            var property = detectProperty(properties[i])

            var entries = ['"name":"' + property.name + '"']
            if (typeof property.parent === 'boolean')
              entries.push('"parent":' + property.parent)
            if (typeof property.parentProto === 'boolean')
              entries.push('"parentProto":' + property.parentProto)
            if (typeof property.symbol === 'boolean')
              entries.push('"symbol":' + property.symbol)
            if (typeof property['in'] === 'boolean')
              entries.push('"in":' + property['in'])
            if (typeof property.own === 'boolean')
              entries.push('"own":' + property.own)

            detectedProperties.push('{' + entries.join(',') + '}')
          }

          var updateRequest = createXMLHttpRequest()
          updateRequest.open(
            'POST',
            '/api/' + browser + '/' + version + '/properties'
          )
          updateRequest.setRequestHeader('Content-Type', 'application/json')
          updateRequest.onreadystatechange = function() {
            if (updateRequest.readyState === 4) {
              if (updateRequest.status === 401) {
                feedback.innerHTML = 'Secret incorrect ;-('
                form.style.display = 'block'
                return
              }

              // Next batch
              feedback.innerHTML =
                'Detected ' + (total += properties.length) + ' properties'

              batch()
            }
          }
          updateRequest.send(
            '{"secret":"' +
              secret +
              '","properties":[' +
              detectedProperties.join(',') +
              ']}'
          )
        }
      }
      request.send(null)
    }

    // Initial batch
    batch()

    return false
  }
})()
