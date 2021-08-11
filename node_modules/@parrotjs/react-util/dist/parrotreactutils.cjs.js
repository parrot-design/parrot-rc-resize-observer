'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/** 将children转为节点数组 */
function toChildrenArray(children, option = {}) {
    let ret = [];
    React__default['default'].Children.forEach(children, (child) => {
        if ((child === undefined || child === null) && !option.keepEmpty) {
            return;
        }
        if (Array.isArray(child)) {
            ret = ret.concat(toChildrenArray(child));
        }
        else {
            ret.push(child);
        }
    });
    return ret;
}

exports.toChildrenArray = toChildrenArray;
