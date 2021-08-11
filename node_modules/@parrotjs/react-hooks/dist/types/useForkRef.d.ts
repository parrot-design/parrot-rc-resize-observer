import React from 'react';
export declare type IRefs<T> = React.Ref<T> | null | undefined;
/**
 * 给多个节点设置值
 * @param refs
 * @returns
 */
export default function useForkRef<Instance>(...refs: IRefs<Instance>[]): ((refValue: Instance | null) => void) | null;
