import React from 'react';
import styled, { css } from 'styled-components';

import { resolveStaticPath } from '@suite-utils/nextjs';
import { Image } from '@suite-components';

const StyledImg = styled.img`
    flex: 1 0 auto;
    margin: auto;

    ${props =>
        props.theme.IMAGE_FILTER &&
        css`
            filter: ${props.theme.IMAGE_FILTER};
        `}
`;
interface Props {
    deviceType?: string;
}

export const InitImg = ({ deviceType, ...props }: Props) => (
    <StyledImg
        alt=""
        src={resolveStaticPath(`images/svg/${deviceType}-firmware-init-1.svg`)}
        {...props}
    />
);

export const SuccessImg = ({ deviceType, ...props }: Props) => (
    <StyledImg
        alt=""
        src={resolveStaticPath(`images/svg/${deviceType}-firmware-success-1.svg`)}
        {...props}
    />
);

export const WarningImg = () => (
    <StyledImg alt="" src={resolveStaticPath(`images/svg/uni-warning.svg`)} />
);

export const ErrorImg = () => (
    <StyledImg alt="" src={resolveStaticPath(`images/svg/uni-error.svg`)} />
);

export const DisconnectImg = () => (
    <StyledImg alt="" src={resolveStaticPath(`images/svg/disconnect-device.svg`)} />
);

export const ConnectInNormalImg = () => <Image image="connect-device" />;

export const ConnectInBootloaderImg = ({ deviceType }: Props) => (
    <StyledImg
        alt=""
        src={resolveStaticPath(`images/svg/${deviceType}-how-to-enter-bootloader-model-1.svg`)}
    />
);

// todo: another image (not exportable from zeplin atm)
// see here:
// https://github.com/styled-components/styled-components/issues/2473
export const SeedImg = styled(props => <Image image="recover-from-seed" {...props} />)`
    height: 250px;
    padding: 30px;
`;
