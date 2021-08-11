//取合法的边界值
function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

const inBrowser = typeof window !== 'undefined';

const root = inBrowser ? window : global;
let prev = Date.now();
function rafPolyfill(fn) {
    const curr = Date.now();
    const ms = Math.max(0, 16 - (curr - prev));
    const id = setTimeout(fn, ms);
    prev = curr + ms;
    return id;
}
function raf(fn) {
    const requestAnimationFrame = root.requestAnimationFrame || rafPolyfill;
    return requestAnimationFrame.call(root, fn);
}
function cancelRaf(id) {
    const cancelAnimationFrame = root.cancelAnimationFrame || root.clearTimeout;
    cancelAnimationFrame.call(root, id);
}
// double raf for animation
function doubleRaf(fn) {
    raf(() => raf(fn));
}

export { cancelRaf, clamp, doubleRaf, inBrowser, raf };
