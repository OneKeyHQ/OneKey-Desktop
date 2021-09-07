import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

export default function Tooltip({
    id,
    effect = 'solid',
    delayShow = 300,
    children,
    className,
    ...rest
}) {
    useEffect(() => {
        ReactTooltip.rebuild();
    });

    return (
        <ReactTooltip
            id={id}
            effect={effect}
            className={`tooltip ${className}`}
            delayShow={delayShow}
            {...rest}
        >
            {children}
        </ReactTooltip>
    );
}
