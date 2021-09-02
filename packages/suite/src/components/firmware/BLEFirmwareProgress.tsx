import React from 'react';
import { Translation } from '@suite-components';
import { Loaders } from '@onboarding-components';
import { useDeviceType } from '@suite-hooks';
import { InitImg, H2 } from '@firmware-components';

const Body = () => {
    return (
        <>
            <InitImg deviceType={useDeviceType()} />
            <H2>
                <Translation id="TR_INSTALLING" />
                <Loaders.Dots />
            </H2>
        </>
    );
};

export const BLEFirmwareProgressStep = {
    Body,
};
