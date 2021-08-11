'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var utils = require('@parrotjs/utils');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

/**
 * 给节点设置值
 * @param ref 设置的节点
 * @param value 设置的值
 */
function setRef(ref, value) {
    if (typeof ref === 'function') {
        ref(value);
    }
    else if (!!ref) {
        ref.current = value;
    }
}

/**
 * 给多个节点设置值
 * @param refs
 * @returns
 */
function useForkRef(...refs) {
    return React__default['default'].useMemo(() => {
        if (refs.every(ref => !ref)) {
            return null;
        }
        return (refValue) => {
            for (let ref of refs) {
                if (ref) {
                    setRef(ref, refValue);
                }
            }
        };
    }, [...refs]);
}

let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout = null;
const inputTypesWhitelist = {
    text: true,
    search: true,
    url: true,
    tel: true,
    email: true,
    password: true,
    number: true,
    date: true,
    month: true,
    week: true,
    time: true,
    datetime: true,
    'datetime-local': true
};
/**
 * 计算给定元素是否应自动触发 添加'focus-visible'类,即它是否应该始终匹配':focus-visible'当聚焦时。
 * @param node
 */
function focusTriggersKeyboardModality(node) {
    const { type, tagName } = node;
    if (tagName === 'INPUT' && inputTypesWhitelist[type] && !node.readOnly) {
        return true;
    }
    if (tagName === 'TEXTAREA' && !node.readOnly) {
        return true;
    }
    if (node.isContentEditable) {
        return true;
    }
    return false;
}
/**
 * 用hadKeyboardEvent变量跟踪我们的键盘状态。onkeydown是键盘按键事件，如果按下元、alt/选项、控制键，则不是键盘，其余都是
 * @param event
 * @returns
 */
function handleKeyDown(event) {
    if (event.metaKey || event.altKey || event.ctrlKey) {
        return;
    }
    hadKeyboardEvent = true;
}
/**
 * 表示远离键盘模式
 */
function handlePointerDown() {
    hadKeyboardEvent = false;
}
function handleVisibilityChange() {
    //当浏览器隐藏时会调用这个方法
    if (this.visibilityState === 'hidden') {
        if (hadFocusVisibleRecently) {
            hadKeyboardEvent = true;
        }
    }
}
function prepare(doc) {
    doc.addEventListener('keydown', handleKeyDown, true);
    //鼠标点击
    doc.addEventListener('mousedown', handlePointerDown, true);
    //物理设备
    doc.addEventListener('pointerdown', handlePointerDown, true);
    //手指
    doc.addEventListener('touchstart', handlePointerDown, true);
    doc.addEventListener('visibilitychange', handleVisibilityChange, true);
}
function isFocusVisible(event) {
    const { target } = event;
    try {
        //:focus-visible 是为了区分聚焦是按键状态还是鼠标状态的 :focus表示聚焦 而:focus-visible仅在键盘聚焦时才会发生
        return target.matches(':focus-visible');
    }
    catch (error) {
        // 如果浏览器不支持:focus-visible则使用我们的启发式
    }
    return hadKeyboardEvent || focusTriggersKeyboardModality(event);
}
function useIsFocusVisible() {
    const ref = React.useCallback((node) => {
        if (node != null) {
            prepare(node.ownerDocument);
        }
    }, []);
    const isFocusVisibleRef = React__default['default'].useRef(false);
    /**
     * 如果一个blur失焦事件被触发，应该被调用
     */
    function handleBlurVisible() {
        if (isFocusVisibleRef.current) {
            hadFocusVisibleRecently = true;
            window.clearTimeout(hadFocusVisibleRecentlyTimeout);
            hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
                hadFocusVisibleRecently = false;
            }, 100);
            isFocusVisibleRef.current = false;
            return true;
        }
        return false;
    }
    /**
     * 如果一个focus聚焦事件被触发，应该被调用
     */
    function handleFocusVisible(event) {
        if (isFocusVisible(event)) {
            isFocusVisibleRef.current = true;
            return true;
        }
        return false;
    }
    return { isFocusVisibleRef, onFocus: handleFocusVisible, onBlur: handleBlurVisible, ref };
}

//更新完state以后的回调
//与setState({a:2},()=>{})等价
function useStateCallback(initial) {
    const [state, setState] = React.useState(initial);
    const asyncCallback = React.useRef();
    const setStateWrapper = (nextState, next, prev) => {
        if (typeof prev === 'function') {
            //prevState
            if (prev(state, nextState) === false) {
                return;
            }
        }
        asyncCallback.current = typeof next === 'function' ? next : null;
        setState(nextState);
    };
    React.useEffect(() => {
        if (asyncCallback.current)
            asyncCallback.current(state);
    }, [state]);
    return [state, setStateWrapper];
}

const MIN_DISTANCE = 10;
function getDirection(x, y) {
    if (x > y && x > MIN_DISTANCE) {
        return 'horizontal';
    }
    if (y > x && y > MIN_DISTANCE) {
        return 'vertical';
    }
    return '';
}
//判断方位的hooks
function useTouch() {
    //记录刚开始时的坐标
    const startX = React.useRef(0);
    const startY = React.useRef(0);
    //记录滑动距离
    const deltaX = React.useRef(0);
    const deltaY = React.useRef(0);
    //记录当前的坐标
    const offsetX = React.useRef(0);
    const offsetY = React.useRef(0);
    const direction = React.useRef('');
    const isVertical = () => direction.current === 'vertical';
    const isHorizontal = () => direction.current === 'horization';
    const reset = () => {
        deltaX.current = 0;
        deltaY.current = 0;
        offsetX.current = 0;
        offsetY.current = 0;
        direction.current = '';
    };
    const start = (event) => {
        reset();
        startX.current = event.touches[0].clientX;
        startY.current = event.touches[0].clientY;
    };
    const move = (event) => {
        const touch = event.touches[0];
        //Safari返回将设置clientX为负数
        deltaX.current = touch.clientX < 0 ? 0 : touch.clientX - startX.current;
        deltaY.current = touch.clientY - startY.current;
        offsetX.current = Math.abs(deltaX.current);
        offsetY.current = Math.abs(deltaY.current);
        if (!direction.current) {
            direction.current = getDirection(offsetX.current, offsetY.current);
        }
    };
    return {
        move,
        start,
        reset,
        startX,
        startY,
        deltaX,
        deltaY,
        offsetX,
        offsetY,
        direction,
        isVertical,
        isHorizontal
    };
}

function useEventListener(type, listener, options) {
    if (!utils.inBrowser)
        return;
    //passive 监听器能保证的只有一点，那就是调用 preventDefault() 无效
    const { target = window, passive = false, capture = false } = options || {};
    let attached = false;
    const add = React__default['default'].useCallback((target) => {
        if (target && !attached) {
            target.addEventListener(type, listener, capture);
        }
        attached = true;
    }, [type, listener, passive, capture]);
    const remove = React__default['default'].useCallback((target) => {
        if (target && attached) {
            target.removeEventListener(type, listener, capture);
            attached = false;
        }
    }, [type, listener, passive, capture]);
    React__default['default'].useEffect(() => {
        add(target);
        return () => {
            remove(target);
        };
    }, [target]);
}

function usePageVisibility() {
    const [visibility, setVisibility] = React__default['default'].useState('visible');
    const setVisible = React__default['default'].useCallback(() => {
        if (utils.inBrowser) {
            setVisibility(document.hidden ? 'hidden' : 'visible');
        }
    }, []);
    useEventListener('visibilitychange', setVisible);
    return visibility;
}

const useRect = (deps = []) => {
    const [size, setSize] = React.useState({
        width: 0, height: 0
    });
    const root = React.useRef(null);
    const changeSize = () => {
        var _a;
        const rect = (_a = root.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
        if (rect) {
            setSize({
                width: rect.width,
                height: rect.height
            });
        }
    };
    React.useEffect(() => {
        changeSize();
    }, deps);
    return {
        root,
        size,
        changeSize
    };
};

//销毁时的钩子
function useDestory(fn) {
    React__default['default'].useEffect(() => {
        return fn;
    }, []);
}

exports.setRef = setRef;
exports.useDestory = useDestory;
exports.useEventListener = useEventListener;
exports.useForkRef = useForkRef;
exports.useIsFocusVisible = useIsFocusVisible;
exports.usePageVisibility = usePageVisibility;
exports.useRect = useRect;
exports.useStateCallback = useStateCallback;
exports.useTouch = useTouch;
