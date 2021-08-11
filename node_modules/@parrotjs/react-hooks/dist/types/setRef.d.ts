import React from "react";
/**
 * 给节点设置值
 * @param ref 设置的节点
 * @param value 设置的值
 */
export default function setRef<T>(ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined, value: T | null): void;
