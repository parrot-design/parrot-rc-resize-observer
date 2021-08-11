import React from 'react';
export declare function teardown(doc: any): void;
export default function useIsFocusVisible(): {
    isFocusVisibleRef: React.MutableRefObject<boolean>;
    onFocus: (event: any) => boolean;
    onBlur: () => boolean;
    ref: (node: any) => void;
};
