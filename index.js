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
      this._style = window.getComputedStyle(this.el, null)
      
      this._width = this._style.width.replace('px', '')
      this._height = isNaN(this._normalizeUnit(this._style['max-height'])) ? this._normalizeUnit(this._style.height) : this._normalizeUnit(this._style['max-height'])
      
      if (!this._test)
        this._test = this.el.cloneNode()
      
      this._test.textContent = this.text
      this._test.style.width = this._width + 'px'
      this._test.style.height = 'auto'
      this._test.style.maxHeight = 'none'
      this._test.style.position = 'fixed'
      this._test.style.left = 0
      this._test.style.top = 0
      this._test.style.display = 'flex'
      this._test.style.visibility = 'hidden'
      this._test.removeAttribute('data-line-clamp')

      return this
    }

    render() {
      if (!this.el.parentNode) return this
      
      // Predicts text length
      let fs = this._normalizeUnit(this._style['font-size']),
          lh = this._normalizeUnit(this._style['line-height']),
          len = (~~(this._width/fs)) * (~~(this._height/lh))
      
      if (this.text.length <= len) {
        this.el.textContent = this.text
        return this
      }

      // Append test object
      this.el.parentNode.appendChild(this._test)

      let min = len-2, max = this.text.length-1, half = 0, limit = 30

      while (max - min > 1 && limit > 0) {
        half = ~~(min + (max - min)/2)
        this._test.textContent = this.text.substring(0, half) + '...'
        
        let s = window.getComputedStyle(this._test, null)

        if (this._normalizeUnit(s.height) > this._height)
          max = half
        else
          min = half

        limit--
      }

      // Set text
      this.el.textContent = this.text.substring(0, min) + '...'
      
      // Remove test element from dom tree
      this._test.parentNode.removeChild(this._test)

      return this
    }
    
    _normalizeUnit(val) {
      return Number(val.replace('px',''))
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
    let t = (new Date).getTime()
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

  return LineClamp 
})()

export default LineClamp 
