import React from 'react';
import { TrezorDevice } from '@suite-types';
import { resolveStaticPath } from '@suite/utils/suite/nextjs';
import styled, { css } from 'styled-components';
import { useDeviceType } from '@suite/hooks/suite';

const Image = styled.img`
    ${props =>
        props.theme.IMAGE_FILTER &&
        css`
            filter: ${props.theme.IMAGE_FILTER};
        `}
`;

interface Props extends React.HTMLAttributes<HTMLImageElement> {
    device: TrezorDevice;
}

const DeviceConfirmImage = ({ device, ...rest }: Props) => {
    const deviceType = useDeviceType();
    return (
        <Image src={resolveStaticPath(`images/svg/${deviceType}-device-confirm.svg`)} {...rest} />
    );
};

export default DeviceConfirmImage;
