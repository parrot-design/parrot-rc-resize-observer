import React, { useEffect,useState } from 'react';
import ResizeObserverA from 'rc-resize-observer';
import ResizeObserver from '../../src';


const Demo = () => {

    const [text,setText]=useState("1111");

    return (
        <div>
            <button onClick={()=>setText(text+1)}>测试</button>
            <ResizeObserver onResize={(e)=>{console.log(e)}}>
                <div style={{display:'inline-block'}}>{text}</div>
            </ResizeObserver>
        </div>
    )
}
 

export default Demo;