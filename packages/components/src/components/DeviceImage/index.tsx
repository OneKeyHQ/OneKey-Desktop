/* eslint-disable global-require */
import React from 'react';
import styled from 'styled-components';
import { DefaultType } from '../../utils';

interface Props {
    deviceType?: DefaultType;
    height?: string | number;
    className?: string;
}

const Image = styled.img``;

const DeviceImage = ({ deviceType, height = '100%', className }: Props) => {
    return (
        <Image
            className={className}
            height={height}
            alt="OneKey MINI"
            // eslint-disable-next-line import/no-dynamic-require
            src={require(`../../images/device/${deviceType || 'unknown'}.svg`)}
        />
    );
};

export { DeviceImage, Props as DeviceImageProps };
