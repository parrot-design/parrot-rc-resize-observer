import React ,{ useRef,useEffect } from 'react';
import { usePageVisibility } from '../../src'

const Demo = () => {

    const visibility=usePageVisibility();

    useEffect(() => {
        console.log("visibility",visibility)
    }, [visibility])
     
    return (
        <div> 
            
        </div>
    )
}

export default Demo;