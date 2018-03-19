;(function() {
  var document = window.document
  var Symbol = window.Symbol
  var XMLHttpRequest = window.XMLHttpRequest

  var feedback = document.getElementById('feedback')
  var total = 0
  var form = document.getElementById('detect-form')

  var propRe = /^([^.]+)$/
  var propNameRe = /^([^.]+)\.([^.]+)$/
  var propSymbolRe = /^([^.]+)\[@@([^.]+)\]$/
  var propProtoNameRe = /^([^.]+)\.prototype\.([^.]+)$/
  var propProtoSymbolRe = /^([^.]+)\.prototype\[@@([^.]+)\]$/

  form.onsubmit = function(e) {
    e.preventDefault()

    var browser = document.getElementById('browser').value
    var version = document.getElementById('version').value
    var secret = document.getElementById('secret').value

    // Hide form to prevent submitting twice
    form.style.display = 'none'

    function batch() {
      var request = new XMLHttpRequest()
      request.open('GET', '/api/' + browser + '/' + version + '/properties')
      request.setRequestHeader('Content-Type', 'application/json')
      request.onreadystatechange = function() {
        if (request.readyState == XMLHttpRequest.DONE) {
          var properties = JSON.parse(request.responseText)

          if (properties.length === 0) {
            window.location.reload()
            return
          }

          for (var i = 0; i < properties.length; i++) {
            var match
            var property = {
              name: properties[i],
            }

            try {
              if ((match = property.name.match(propProtoSymbolRe))) {
                var parent = match[1]
                var symbol = match[2]

                if (!window.Symbol) {
                  property.symbol = false
                }

                if (!window[parent]) {
                  property.parent = false
                } else if (!window[parent].prototype) {
                  property.parent = true
                  property.parentPrototype = false
                }

                if (
                  window.Symbol &&
                  window[parent] &&
                  window[parent].prototype
                ) {
                  property.in = Symbol[symbol] in window[parent].prototype
                  property.own = window[parent].prototype.hasOwnProperty(
                    Symbol[symbol]
                  )
                }
              } else if ((match = property.name.match(propProtoNameRe))) {
                var parent = match[1]
                var prop = match[2]

                if (!window[parent]) {
                  property.parent = false
                } else if (!window[parent].prototype) {
                  property.parent = true
                  property.parentPrototype = false
                }

                if (window[parent] && window[parent].prototype) {
                  property.in = prop in window[parent].prototype
                  property.own = window[parent].prototype.hasOwnProperty(prop)
                }
              } else if ((match = property.name.match(propSymbolRe))) {
                var parent = match[1]
                var symbol = match[2]

                if (!window.Symbol) {
                  property.symbol = false
                }

                if (!window[parent]) {
                  property.parent = false
                }

                if (window.Symbol && window[parent]) {
                  property.in = Symbol[symbol] in window[parent]
                  property.own = window[parent].hasOwnProperty(Symbol[symbol])
                }
              } else if ((match = property.name.match(propNameRe))) {
                var parent = match[1]
                var prop = match[2]

                if (!window[parent]) {
                  property.parent = false
                }

                if (window[parent]) {
                  property.in = prop in window[parent]
                  property.own = window[parent].hasOwnProperty(prop)
                }
              } else if ((match = property.name.match(propRe))) {
                var prop = match[1]

                property.in = prop in window
                property.own = window.hasOwnProperty(prop)
              }
            } catch (e) {
              property.throws = true
            }

            properties[i] = property
          }

          var updateRequest = new XMLHttpRequest()
          updateRequest.open(
            'POST',
            '/api/' + browser + '/' + version + '/properties'
          )
          updateRequest.setRequestHeader('Content-Type', 'application/json')
          updateRequest.onreadystatechange = function() {
            if (updateRequest.readyState == XMLHttpRequest.DONE) {
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
            JSON.stringify({
              secret: secret,
              properties: properties,
            })
          )
        }
      }
      request.send(null)
    }

    // Initial batch
    batch()
  }
})()
