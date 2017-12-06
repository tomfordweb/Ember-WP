/*jshint esversion: 6 */

'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function tick() {
  var element = _react2['default'].createElement(
    'div',
    null,
    _react2['default'].createElement(
      'h1',
      null,
      'Hello, world!'
    ),
    _react2['default'].createElement(
      'h2',
      null,
      'It is ',
      new Date().toLocaleTimeString(),
      '.'
    )
  );
  _reactDom2['default'].render(element, document.getElementById('root'));
}

setInterval(tick, 1000);