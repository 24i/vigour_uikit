'use strict'
require('./style.less')

var Element = require('vigour-element/lib/app').ChildConstructor
var Base = require('vigour-js/lib/base')
var Observable = require('vigour-js/lib/observable')
var prefix = require('vigour-ua').prefix
var Property = require('vigour-element/lib/property')
var addNewProperty = Element.prototype.addNewProperty
var getPropertyValue = Element.prototype.getPropertyValue
var cnt = 0

module.exports = new Element({
  css: 'ui-page-switcher',
  properties: {
    __prevdata: true,
    __direction: true,
    config: new Base({
      properties: {
        opacity: true,
        keep: true,
        factor: {
          val: 1
        },
        axis: {
          val: 'x'
        }
      }
    }),
    history: Base,
    previous: new Observable({
      val: false,
      on: {
        data (d, event) {
          if (!this.val) {
            this.parent.history.clear()
          }
        }
      }
    }),
    current: new Observable(false),
    next: new Property({
      render (node, event, element) {
        var data = this.val
        if (typeof data === 'string' && data.indexOf('smurky') === 0) {
          return
        }
        let key = element.makeKey(data)
        if (!element[key]) {
          element.set({[key]: data})
        }
      }
    })
  },
  history: {},
  config: {},
  define: {
    getPropertyValue (val, event, parent, key, escape) {
      if (val) {
        if (val instanceof Element) {
          let axis = this.config.axis
          let delta = axis === 'x'
            ? this.getNode().clientWidth
            : this.getNode().clientHeight

          val.setKey(axis, delta * this.getDirection(val.val), event)
        } else if (!this.properties[key]) {
          let axis = this.config.axis
          let delta = axis === 'x'
            ? this.getNode().clientWidth
            : this.getNode().clientHeight

          if (val instanceof Observable) {
            val = { val: val }
          }
          val[axis] = delta * this.getDirection(val)
        }
      }
      return getPropertyValue.call(this, val, event, parent, key, escape)
    },
    addNewProperty (key, val, property, event, escape) {
      var ret = addNewProperty.apply(this, arguments)
      var elem = this[key]
      if (elem instanceof Element) {
        let switcherNode = this.getNode()
        if (switcherNode) {
          let direction = this.__direction
          let axis = this.config.axis
          let delta = axis === 'x'
            ? switcherNode.clientWidth
            : switcherNode.clientWidth

          this.each(function (child, key) {
            if (child !== elem) {
              let set = {}
              set[axis] = -delta * direction
              child = child.set(set, event) || child
              let node = child.getNode()
              let store = child.storeContext()
              let remove = function () {
                child.applyContext(store)
                child.remove()
              }
              node.addEventListener(`${prefix}TransitionEnd`, remove)
              node.addEventListener('transitionend', remove)
            }
          }, isElement)

          elem.setKey(axis, 0, event)

          this.set({
            previous: this.current && this.current.val,
            current: key
          })
        }
      }
      return ret
    },
    makeKey (data) {
      if (typeof data === 'string') {
        return data
      }
      let key = data.key || cnt++
      if (this.properties[key]) {
        return key
      } else {
        key = data.path.join('-')
        return key
      }
    },
    getDirection (val) {
      var data = val.origin || val.val && val.val.origin
      var direction
      if (data && data.number) {
        var previous = this.__prevdata
        if (previous && previous.number) {
          if (previous.number.val > data.number.val) {
            direction = -1
          }
        }
      }
      this.__prevdata = data
      return (this.__direction = direction || 1)
    }
  }
}).Constructor

function isElement (prop) {
  return prop instanceof Element
}