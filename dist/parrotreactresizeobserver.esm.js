import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useForkRef, useDestory } from '@parrotjs/react-hooks';
import ResizeObserverPolyfill from 'resize-observer-polyfill';

const ResizeObserver = (props) => {
    const { children, disabled, onResize } = props;
    const childNode = useRef(null);
    const resizeObserver = useRef(null);
    const [rect, setRect] = useState({ width: 0, height: 0 });
    const destroyObserver = useCallback(() => {
        //clear observer
        if (resizeObserver.current) {
            resizeObserver.current.disconnect();
            resizeObserver.current = null;
        }
    }, []);
    const handleRef = useForkRef(childNode, children.ref);
    const handleResize = useCallback((entries) => {
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
    const onComponentUpdated = useCallback(() => {
        if (disabled) {
            destroyObserver();
            return;
        }
        if (!resizeObserver.current && childNode.current) {
            resizeObserver.current = new ResizeObserverPolyfill(handleResize);
            resizeObserver.current.observe(childNode.current);
        }
    }, [disabled, handleResize, destroyObserver]);
    useEffect(() => {
        onComponentUpdated();
    }, [onComponentUpdated]);
    useDestory(() => destroyObserver);
    return React.cloneElement(children, {
        ref: handleRef
    });
};
var ResizeObserver$1 = React.memo(ResizeObserver);

export default ResizeObserver$1;
