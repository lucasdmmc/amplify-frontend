import React from 'react';

export const ReferenceImage = (src) => {
    return (
        <div>
            <img src={src} alt="" style={{
                width: '300px', 
                height: '300px', 
                margin: 'auto', 
                border: '1px solid black', 
                borderRadius: '8px'}} 
            />
            <span style={{fontSize: '24px', fontFamily: "roboto", color: "green" }}>The user is validated as a real person </span>
        </div>
        
    )
}