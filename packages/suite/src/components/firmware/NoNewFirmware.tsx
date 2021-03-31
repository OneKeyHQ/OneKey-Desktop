import React from 'react';

import { getFwVersion } from '@suite-utils/device';
import { useDevice } from '@suite-hooks';
import { P, H2, SuccessImg } from '@firmware-components';
import { Translation } from '@suite-components';

const Heading = () => (
    <Translation id={window?.$BLE_MODE ? 'TR_BLE_FIRMWARE_UPDATE' : 'TR_FIRMWARE_UPDATE'} />
);

const Body = () => {
    const { device } = useDevice();

    if (!device?.features) return null;

    return (
        <>
            <SuccessImg model={device.features.major_version} />
            <H2>
                <Translation
                    id={
                        window?.$BLE_MODE
                            ? 'TR_BLE_FIRMWARE_IS_UP_TO_DATE'
                            : 'TR_FIRMWARE_IS_UP_TO_DATE'
                    }
                />
            </H2>
            <P>
                <Translation
                    id="TR_FIRMWARE_INSTALLED_TEXT"
                    values={
                        !window?.$BLE_MODE
                            ? {
                                  version: getFwVersion(device),
                              }
                            : {
                                  version: device.features.ble_ver,
                              }
                    }
                />{' '}
                {/* <ExternalLink size="small" href={CHANGELOG_URL}>
                    <Translation id="TR_WHATS_NEW_FIRMWARE" />
                </ExternalLink> */}
            </P>
        </>
    );
};

export const NoNewFirmware = {
    Heading,
    Body,
};
