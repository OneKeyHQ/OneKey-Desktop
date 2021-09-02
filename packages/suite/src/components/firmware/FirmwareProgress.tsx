import React from 'react';
import { getTextForStatus, getDescriptionForStatus } from '@firmware-utils';
import { Translation } from '@suite-components';
import { Loaders } from '@onboarding-components';
import { useDeviceType, useFirmware } from '@suite-hooks';
import { InitImg, P, H2 } from '@firmware-components';

const Body = () => {
    const { status } = useFirmware();

    const statusText = getTextForStatus(status);
    const statusDescription = getDescriptionForStatus(status);
    return (
        <>
            <InitImg deviceType={useDeviceType()} />

            {statusText && (
                <>
                    <H2>
                        <Translation id={statusText} />
                        <Loaders.Dots />
                    </H2>
                    {statusDescription && (
                        <P>
                            <Translation id={statusDescription} />
                        </P>
                    )}
                </>
            )}
        </>
    );
};

export const FirmwareProgressStep = {
    Body,
};
