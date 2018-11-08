export const DOM = (() => {
  class DOM {
    ready () {
      return new Promise((resolve, reject) => {
        if (document.readyState != 'loading')
          window.setTimeout(resolve, 0)
        else
          window.addEventListener('DOMContentLoaded', resolve)
      })
    }
  
    load () {
      return new Promise((resolve, reject) => {
        if (document.readyState == 'complete')
          window.setTimeout(resolve, 0)
        else
          window.addEventListener('load', resolve)
      })
    }
  }
  
  return new DOM
})()
