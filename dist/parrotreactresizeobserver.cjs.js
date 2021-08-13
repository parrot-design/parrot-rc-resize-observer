'use strict';

var React = require('react');
var reactHooks = require('@parrotjs/react-hooks');
var ResizeObserverPolyfill = require('resize-observer-polyfill');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var ResizeObserverPolyfill__default = /*#__PURE__*/_interopDefaultLegacy(ResizeObserverPolyfill);

const ResizeObserver = (props) => {
    const { children, disabled, onResize } = props;
    const childNode = React.useRef(null);
    const resizeObserver = React.useRef(null);
    const [rect, setRect] = React.useState({ width: 0, height: 0 });
    const destroyObserver = React.useCallback(() => {
        //clear observer
        if (resizeObserver.current) {
            resizeObserver.current.disconnect();
            resizeObserver.current = null;
        }
    }, []);
    const handleRef = reactHooks.useForkRef(childNode, children.ref);
    const handleResize = React.useCallback((entries) => {
        const target = entries[0].target;
        const { width, height } = target.getBoundingClientRect();
        if (width !== rect.width ||
            height !== rect.height) {
            const size = { width, height };
            setRect(size);
            if (onResize) {
                Promise.resolve().then(() => {
                    onResize === null || onResize === void 0 ? void 0 : onResize({
                        width,
                        height
                    }, target);
                });
            }
        }
    }, [onResize]);
    const onComponentUpdated = React.useCallback(() => {
        if (disabled) {
            destroyObserver();
            return;
        }
        if (!resizeObserver.current && childNode.current) {
            resizeObserver.current = new ResizeObserverPolyfill__default['default'](handleResize);
            resizeObserver.current.observe(childNode.current);
        }
    }, [disabled, handleResize, destroyObserver]);
    React.useEffect(() => {
        onComponentUpdated();
    }, [onComponentUpdated]);
    reactHooks.useDestory(() => destroyObserver);
    return React__default['default'].cloneElement(children, {
        ref: handleRef
    });
};
var ResizeObserver$1 = React__default['default'].memo(ResizeObserver);

module.exports = ResizeObserver$1;
