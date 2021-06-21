import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Button, Icon } from '@trezor/components';
import { isWebUSB } from '@suite-utils/transport';
import {
    InitImg,
    ConnectInBootloaderImg,
    DisconnectImg,
    P,
    H2,
    InstallButton,
} from '@firmware-components';
import { Translation, WebusbButton } from '@suite-components';
import { useDevice, useFirmware, useSelector } from '@suite-hooks';
import { findErrorBatchDevice } from '@suite-utils/device';

const MessageStepContainer = styled.div`
    text-align: left;
    width: auto;
    margin: 0 auto;
    color: rgb(117, 117, 117);

    & > div + div {
        margin-top: 6px;
    }
`;

const CornerListIndex = styled.div`
    width: 12px;
    display: inline-block;
    text-align: right;
    margin-right: 6px;
`;

const InlineIcon = styled(Icon)`
    display: inline-flex;
    transform: translateY(3px);
`;

const Body = () => {
    const { device } = useDevice();
    const { prevDevice, firmwareError } = useFirmware();
    const expectedModel = prevDevice?.features?.major_version || 1;

    if (!device?.connected) {
        return (
            <>
                <ConnectInBootloaderImg model={expectedModel} />
                <H2>
                    <Translation id="TR_RECONNECT_IN_BOOTLOADER" />
                </H2>
                {expectedModel === 1 && (
                    <MessageStepContainer>
                        <P data-test="@firmware/connect-in-bootloader-message">
                            <CornerListIndex>1. </CornerListIndex>
                            <Translation
                                id="TR_HOLD_LEFT_BUTTON_1"
                                values={{
                                    down: <InlineIcon size={16} icon="DOWN_BUTTON" />,
                                    power: <InlineIcon size={16} icon="POWER" />,
                                }}
                            />
                        </P>

                        <P data-test="@firmware/connect-in-bootloader-message">
                            <CornerListIndex>2. </CornerListIndex>
                            <Translation id="TR_HOLD_LEFT_BUTTON_2" />
                        </P>
                    </MessageStepContainer>
                )}
                {expectedModel !== 1 && (
                    <P data-test="@firmware/connect-in-bootloader-message">
                        <Translation id="TR_SWIPE_YOUR_FINGERS" />
                    </P>
                )}
            </>
        );
    }

    if (device.mode !== 'bootloader' && !device.features?.firmware_present) {
        return (
            <>
                <DisconnectImg />
                <H2 data-test="@firmware/disconnect-message">
                    <Translation id="TR_DISCONNECT_YOUR_DEVICE" />
                </H2>
                <P>
                    <Translation id="FIRMWARE_RECONNECT_BL_NEXT_STEP_DESC" />
                </P>
            </>
        );
    }
    return (
        <>
            <InitImg model={expectedModel} />
            <H2>
                <Translation id="TR_START_FIRMWARE_UPDATE" />
            </H2>
            <P>
                <Translation id="FIRMWARE_RECONNECTED_BL_NEXT_STEP_DESC" />
            </P>
        </>
    );
};

const BottomBar = () => {
    const { device } = useDevice();
    const { firmwareUpdate } = useFirmware();
    const transport = useSelector(state => state.suite.transport);

    if (device?.mode === 'bootloader') {
        return <InstallButton onClick={firmwareUpdate} />;
    }

    if (!device?.connected && isWebUSB(transport)) {
        return (
            <WebusbButton ready>
                <Button icon="PLUS" variant="tertiary">
                    <Translation id="TR_CHECK_FOR_DEVICES" />
                </Button>
            </WebusbButton>
        );
    }

    return null;
};

export const ReconnectInBootloaderStep = {
    Body,
    BottomBar,
};
