;(function(window, document) {
  var results = document.getElementById('results')
  var currentList = document.createElement('ul')

  results.appendChild(currentList)

  function describe(description, callback) {
    var item = document.createElement('li')
    var heading = document.createElement('h1')
    var list = document.createElement('ul')

    item.className = 'suite'
    item.appendChild(heading)
    item.appendChild(list)
    heading.appendChild(document.createTextNode(description))

    currentList.appendChild(item)

    try {
      currentList = list
      callback()
      currentList = item.parentNode
    } catch (e) {}
  }

  function it(description, callback) {
    var item = document.createElement('li')
    var heading = document.createElement('h2')

    item.className = 'test'
    item.appendChild(heading)
    heading.appendChild(document.createTextNode(description))

    currentList.appendChild(item)

    try {
      callback()
      item.className += ' pass'
    } catch (e) {
      item.className += ' fail'
      var pre = document.createElement('pre')
      pre.appendChild(document.createTextNode(e.toString()))
      item.appendChild(pre)
    }
  }

  function Expect(value) {
    this.value = value
  }

  Expect.prototype.toBe = function toBe(value) {
    if (this.value !== value) {
      throw new Error()
    }
  }

  function expect(value) {
    return new Expect(value)
  }

  window.describe = describe
  window.it = it
  window.expect = expect
})(window, document)
