import React from 'react';
import { ReactSVG } from 'react-svg';

const buildPrefix = () => {
    return process.env.PUBLIC_URL || '';
};

export default function Icon(props) {
    const { className, src, name, ...rest } = props;
    const dest = name && !src ? `${buildPrefix()}/icons/${name}.svg` : `${buildPrefix()}${src}`;

    return <ReactSVG className={className} src={dest} {...rest} />;
}
