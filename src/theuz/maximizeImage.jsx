import React, { useState } from 'react';
import './theuz.css'; // Importe o arquivo CSS


const ImagemTeste = ({ src }) => {
    const [maximized, setMaximized] = useState(false);

    const handleImageClick = () => {
        setMaximized(true);
    }

    const handleMaximizedClick = () => {
        setMaximized(false);
    }

    return (
        <>
            <img className="imagem-teste" src={src} onClick={handleImageClick} />
            {maximized && 
                <div id="imagem-maximizada" className={maximized ? 'maximized' : ''} onClick={handleMaximizedClick}>
                    <img className="maximized" src={src} />
                </div>
            }
        </>
    );
}

export {ImagemTeste} ;
