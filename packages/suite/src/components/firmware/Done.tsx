import React from 'react';

import { SuccessImg, H2, P } from '@firmware-components';
import { useDeviceType, useFirmware } from '@suite-hooks';
import { Translation } from '@suite-components';

const Heading = () => <Translation id="TR_SUCCESS" />;

const Body = () => {
    const { prevDevice } = useFirmware();
    const deviceType = useDeviceType();
    const model = prevDevice?.features?.major_version;
    return (
        <>
            {model && <SuccessImg deviceType={deviceType} />}
            <H2>
                <Translation id="FIRMWARE_UPDATE_SUCCESS_HEADING" />
            </H2>
            <P>
                <Translation id="FIRMWARE_UPDATE_SUCCESS_DESC" />
            </P>
        </>
    );
};

export const DoneStep = {
    Heading,
    Body,
};
