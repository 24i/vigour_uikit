'use strict'
require('./style.less')
var Element = require('element')
var Observable = require('vjs/lib/observable')

Element.prototype.inject(
  require('element/lib/property/text'),
  require('element/lib/property/transform'),
  require('element/lib/property/css')
)

exports.Input = new Element({
  label: {
    text: {
      // inject: require('vjs/lib/operator/add'),
      // $add: ':'
    }
  },
  css: 'ui-input',
  input: {
    node: 'textarea',
    on: {
      keyup: function () {
        this.text.origin.val = this.node.value
      }
    }
  },
  on: {
    parent: {
      label () {
        this.label.text.val = this.key
      }
    }
  }
}).Constructor

exports.Topbar = new Element({
  css: 'topbar'
}).Constructor

exports.Button = new Element({
  css: 'ui-button',
  text: 'this is a button'
}).Constructor

exports.Label = new Element({
  node: 'span',
  css: 'ui-label',
  text: 'this is a label'
}).Constructor

exports.Badge = new Element({
  node: 'span',
  css: 'ui-badge',
  label: { node: 'span' },
  message: { node: 'span' }
}).Constructor

exports.Stat = new Element({
  properties: {
    status: new Observable({
      on: {
        data () {
          this.parent.oval.inner.set({
            css: 'inner ' + this.val
          })
        }
      }
    })
  },
  css: 'ui-stat',
  counter: {},
  title: {
    text: 'Counter'
  },
  oval: {
    inner: {}
  }
}).Constructor

// this.title.text.val = this.key
