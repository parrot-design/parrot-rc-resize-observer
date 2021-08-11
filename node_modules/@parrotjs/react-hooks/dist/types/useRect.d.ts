/// <reference types="react" />
declare const useRect: <T extends HTMLElement>(deps?: import("react").DependencyList) => {
    root: import("react").RefObject<T>;
    size: {
        width: number;
        height: number;
    };
    changeSize: () => void;
};
export default useRect;
