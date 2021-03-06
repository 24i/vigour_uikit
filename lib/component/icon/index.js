'use strict'

// dependencies
var Element = require('vigour-element')
var Property = require('vigour-element/lib/property')
// properties
// Element.prototype.inject(
//   require('vigour-element/lib/property/css'),
//   require('../../property')
// )

// styles
require('vigour-scratch')
require('./style.less')

// module
module.exports = new Element({
  node: 'i',
  css: {
    name: 'icon',
    atomic: 'atom',
    $transform: function (val) {
      var icon = (this.parent.icon ? this.parent.icon.val : this.parent.val)
      if (typeof icon !== 'string') {
        return val
      }
      let iconcss = `icon-${icon}`
      if (typeof val !== 'string') {
        return iconcss
      }
      return val + ' ' + iconcss
    }
  },
  properties: {
    icon: new Property({
      render (node, event, element) {
        element._csscache = null
        element.css.render(node, event, element)
      }
    })
  },
  on: {
    data (data, event) {
      var node = this.getNode()
      if (node) {
        this.parent._csscache = null
        this.css.render(node, event, this)
      }
    }
  }
}).Constructor
