import React from 'react';
export interface Option {
    keepEmpty?: boolean;
}
/** 将children转为节点数组 */
export default function toChildrenArray(children: React.ReactNode, option?: Option): React.ReactElement[];
