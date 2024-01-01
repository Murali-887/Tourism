import React from 'react'
import { FaFlag } from 'react-icons/fa';

function ImageText(props) {
    return (
        <div className='text-image'>
           <span> 
                <FaFlag />
                {`${props.details}`}
            </span>
        </div>
    )
}

export default ImageText;