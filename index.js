const LineClamp = (() => {
  const _instaces = []

  class LineClamp {
    constructor(element) {
      if (!element || !(element instanceof HTMLElement))
        throw new TypeError('An element must be specified')

      this.el = element
      this.text = element.textContent
      this._width = 0
      this._height = 0
      this._test = null
    }

    prepare() {
      this._width = this.el.clientWidth
      this._height = this.el.clientHeight

      this._test = this.el.cloneNode()
      this._test.textContent = this.text.toString()
      this._test.style.height = 'auto'
      this._test.style.maxHeight = 'none'
      this._test.style.position = 'absolute'
      this._test.style.visibility = 'hidden'

      return this
    }

    render() {
      if (!this.el.parentNode) return this

      // Append test object
      this.el.parentNode.appendChild(this._test)

      if (this._test.clientHeight <= this._height) return this

      let min = 0, max = this.text.length-1, half = 0, limit = 10

      while (max - min > 1 && limit > 0) {
        half = ~~(min + (max - min)/2)
        this._test.textContent = this.text.substring(0, half) + '...'

        if (this._test.clientHeight > this._height)
          max = half
        else
          min = half

        limit--
      }

      // Set text
      this.el.textContent = this.text.substring(0, min) + '...'

      // Dispose test element
      this._test.parentNode.removeChild(this._test)

      return this
    }

    dispose() {
      return this
    }

    static instance(element) {
      return element._collapse
    }

    static get instances() {
      return _instaces
    }

    static create(element) {
      let instance = element._clamp || new LineClamp(element) 

      if (!element._clamp) {
        element._clamp = instance
        _instaces.push(instance)
      }

      return instance
    }

    static dispose() {
      _instaces.forEach(instance => {
        delete instance.el._clamp
        instance.dispose()
      })
      _instaces.splice(0, _instaces.length)
    }
  }

  const clamp = () => {
    let elements = Array.from(document.querySelectorAll('[data-line-clamp]'))
    let instances = []

    // Create Instances
    elements.forEach(el => instances.push(LineClamp.create(el).prepare()))

    instances.forEach(item => item.render())
  }

  (new Promise((resolve, reject) => {
    document.readyState == 'complete' && window.setTimeout(resolve, 0) || window.addEventListener('load', resolve)
  })).then(() => {
    clamp()
    window.addEventListener('resize', clamp)
  })

  // Click handler
  document.addEventListener('click', e => {
    Array.from(e.currentTarget.querySelectorAll('[data-toggle="collapse"]')).forEach(el => {
      // The target
      if (e.target == el || el.contains(e.target)) {
        let config = {}
        let selector = el.getAttribute('data-target') && '#' + el.getAttribute('data-target')
        let targets = []

        if (selector) {
          targets = Array.from(document.querySelectorAll(selector))
        } else if (el.nextElementSibling.classList.contains('collapse')) {
          targets = [el.nextElementSibling]
        }

        config.triggers = [el]

        // Kill anchor default behavior
        if (el.tagName === 'A' || el.tagName === 'AREA') {
          e.preventDefault()
        }

        // Create Collapse
        targets.forEach(el => Collapse.create(el, config))
      }
    })
  })

  return LineClamp 
})()

// Export it for webpack
if (typeof module === 'object' && module.exports) {
  module.exports = { LineClamp: LineClamp };
}
