import React from 'react';
import { Icon, variables, useTheme, SuiteThemeColors } from '@trezor/components';
import styled from 'styled-components';
import * as deviceUtils from '@suite-utils/device';
import { TrezorDevice } from '@suite-types';
import classNames from 'classnames';

type Status = 'connected' | 'disconnected' | 'warning';

const getStatusColor = (status: Status, theme: SuiteThemeColors) => {
    const statusColors = {
        connected: theme.TYPE_GREEN,
        disconnected: theme.TYPE_RED,
        warning: theme.TYPE_ORANGE,
    };

    return statusColors[status];
};

const getStatusForDevice = (device: TrezorDevice) => {
    const deviceStatus = deviceUtils.getStatus(device);
    const needsAttention = deviceUtils.deviceNeedsAttention(deviceStatus);

    if (!device.connected) {
        return 'disconnected';
    }
    if (needsAttention) {
        return 'warning';
    }
    return 'connected';
};

const StatusText = styled.div<{ show: boolean; status: Status }>`
    position: absolute;
    top: 12px;
    text-transform: uppercase;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
    font-size: ${variables.FONT_SIZE.TINY};
    color: ${props => getStatusColor(props.status, props.theme)};

    opacity: ${props => (props.show ? 1 : 0)};

    right: ${props => (props.show ? '12px' : '4px')};
    transition: opacity 0.5s ease, right 0.5s ease;
    height: 18px;
    border-radius: 9px;
    padding: 0 7px;
`;

const OuterCircle = styled.div<{ show: boolean; status: Status }>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    transition: opacity 0.5s ease, right 0.5s ease;
`;

const InnerCircle = styled.div<{ status: Status }>`
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => getStatusColor(props.status, props.theme)};
`;

interface Props {
    device: TrezorDevice;
    onRefreshClick?: () => void;
    showIconStatus?: boolean;
    showTextStatus?: boolean;
    isCollapsed?: boolean;
}

const DeviceStatus = ({
    device,
    onRefreshClick,
    showIconStatus = true,
    showTextStatus = false,
    isCollapsed,
}: Props) => {
    const status = getStatusForDevice(device);
    const theme = useTheme();

    // if device needs attention and CTA func was passed show refresh button
    if (status === 'warning' && onRefreshClick) {
        return (
            <div
                className={classNames(
                    'relative z-10 flex self-start mt-1 -ml-4 bg-white rounded-full dark:bg-gray-800 md:dark:bg-gray-700',
                    isCollapsed ? '-translate-y-2 translate-x-2' : 'transform-none',
                )}
            >
                <Icon
                    onClick={(e: any) => {
                        e.stopPropagation();
                        onRefreshClick();
                    }}
                    icon="REFRESH"
                    size={16}
                    color={getStatusColor(status, theme)}
                />
            </div>
        );
    }

    // otherwise show dot icon (green/orange/red)
    return (
        <>
            <StatusText
                className={classNames(
                    'hidden border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700',
                    { 'md:block': !isCollapsed },
                )}
                status={status}
                show={showTextStatus}
            >
                {status}
            </StatusText>
            <OuterCircle
                className={classNames(
                    'bg-brand-500/10 top-3 right-3',
                    !showIconStatus && !isCollapsed ? 'lg:right-[48px] lg:opacity-0' : '',
                    isCollapsed ? 'translate-x-3 -translate-y-3' : 'transform-none',
                )}
                status={status}
                show={showIconStatus}
            >
                <InnerCircle status={status} />
            </OuterCircle>
        </>
    );
};

export default DeviceStatus;
