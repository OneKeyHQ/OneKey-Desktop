import React from 'react';
import { InitImg, ConnectInBootloaderImg, P, H2, InstallButton } from '@firmware-components';
import { Translation } from '@suite-components';
import { useDevice, useFirmware } from '@suite-hooks';

const Body = () => {
    const { device } = useDevice();
    const { prevDevice } = useFirmware();
    const expectedModel = prevDevice?.features?.major_version || 1;

    if (!device?.connected) {
        return (
            <>
                <ConnectInBootloaderImg model={expectedModel} />
                <H2>
                    <Translation id="TR_RECONNECT_IN_BOOTLOADER" />
                </H2>
                <P data-test="@firmware/connect-in-bootloader-message">
                    {expectedModel === 1 && <Translation id="TR_HOLD_LEFT_BUTTON" />}
                    {expectedModel !== 1 && <Translation id="TR_SWIPE_YOUR_FINGERS" />}
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
    const { firmwareUpdate } = useFirmware();
    return <InstallButton onClick={firmwareUpdate} />;
};

export const ReconnectInBootloaderStep = {
    Body,
    BottomBar,
};
