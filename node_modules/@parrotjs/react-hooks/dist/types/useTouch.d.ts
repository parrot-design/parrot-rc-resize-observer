import React from 'react';
export default function useTouch(): {
    move: (event: any) => void;
    start: (event: any) => void;
    reset: () => void;
    startX: React.MutableRefObject<number>;
    startY: React.MutableRefObject<number>;
    deltaX: React.MutableRefObject<number>;
    deltaY: React.MutableRefObject<number>;
    offsetX: React.MutableRefObject<number>;
    offsetY: React.MutableRefObject<number>;
    direction: React.MutableRefObject<string>;
    isVertical: () => boolean;
    isHorizontal: () => boolean;
};
