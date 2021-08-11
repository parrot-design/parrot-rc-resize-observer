import React from 'react';

/** 将children转为节点数组 */
function toChildrenArray(children, option = {}) {
    let ret = [];
    React.Children.forEach(children, (child) => {
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

export { toChildrenArray };
