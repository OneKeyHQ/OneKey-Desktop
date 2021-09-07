import React from 'react';
import ImageFallback from 'react-image-fallback';

const buildImageSrc = src => {
    if (src.startsWith('http')) {
        return src;
    }
    const prefix = process.env.PUBLIC_URL || '';
    return `${prefix}${src}`;
};

const ImageContainer = ({ ...props }) => {
    return (
        <div className="flex justify-center">
            <ImageFallback
                fallbackImage={<div />}
                alt={props.name}
                {...props}
                src={buildImageSrc(props.src)}
            />
        </div>
    );
};

export default ImageContainer;
