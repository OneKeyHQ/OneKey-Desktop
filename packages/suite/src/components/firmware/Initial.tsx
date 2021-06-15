import React, { useEffect } from 'react';
import styled from 'styled-components';

import { Icon, variables } from '@trezor/components';
import { Translation, ExternalLink } from '@suite-components';
import { getFwVersion, findErrorBatchDevice } from '@suite-utils/device';
import { useDevice, useFirmware } from '@suite-hooks';
import { ReconnectInNormalStep, NoNewFirmware, ContinueButton, P, H2 } from '@firmware-components';
import { isNewer, isNewerOrEqual } from '@firmware-utils';
import { getBleVerAsArray } from "@suite-utils/getBleVerAsArray";

const { FONT_SIZE, FONT_WEIGHT } = variables;

const HeadingWrapper = styled.div``;

const BodyWrapper = styled.div`
    text-align: left;
`;

const ChangesSummary = styled.div`
    width: 100%;
    text-align: left;
    background-color: ${props => props.theme.BG_LIGHT_GREY};
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
`;

const ChangelogGroup = styled.div`
    margin-bottom: 20px;
    color: ${props => props.theme.TYPE_DARK_GREY};
    font-size: ${FONT_SIZE.SMALL};
`;

const ChangelogHeading = styled.div`
    font-weight: ${FONT_WEIGHT.MEDIUM};
`;

const Version = styled.span`
    display: block;
    font-size: ${FONT_SIZE.SMALL};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
`;

const ChangesUl = styled.ul`
    margin-left: 16px;

    & > li {
        margin: 4px 0;
    }
`;

const StyledExternalLink = styled(ExternalLink)`
    margin: 4px 0;
`;

const Heading = () => {
    const { device } = useDevice();
    const { firmwareError } = useFirmware();
    const isErrorBatchDevice = findErrorBatchDevice(device);

    useEffect(() => {
        if (isErrorBatchDevice) {
            firmwareError('error batch device');
        }
    }, [isErrorBatchDevice, firmwareError]);

    if (isErrorBatchDevice) return null;

    if (device?.mode === 'normal') {
        return (
            <HeadingWrapper>
                <Translation
                    id={window?.$BLE_MODE ? 'TR_BLE_UPDATE_AVAILABLE' : 'TR_UPDATE_AVAILABLE'}
                />
                <Version data-test="@firmware/initial/heading/version">
                    <Translation
                        id="TR_DEVICE_FIRMWARE_VERSION"
                        values={
                            !window?.$BLE_MODE
                                ? {
                                      firmware: getFwVersion(device),
                                  }
                                : {
                                      firmware: device.features.ble_ver,
                                  }
                        }
                    />
                </Version>
            </HeadingWrapper>
        );
    }
    return <Translation id="TR_FIRMWARE_UPDATE" />;
};

const BLEBody = () => {
    const { device } = useDevice();

    // ensure that device is connected in requested mode
    if (device?.mode !== 'normal') return <ReconnectInNormalStep.Body />;

    if (
        isNewerOrEqual(
            getBleVerAsArray(device?.features?.ble_ver),
            (window.$BLE_DATA?.version.split('.').map(Number) as [number, number, number]) ?? [
                1,
                0,
                0,
            ],
        )
    )
        return <NoNewFirmware.Body />;

    const { firmwareRelease } = device;
    if (!device?.features || !firmwareRelease) return null; // ts

    // Create custom object containing changelogs for easier manipulation in render() method.
    // Default changelog format is just a long string where individual changes are separated by "*" symbol.
    const logsCustomObject: any = {};

    if (firmwareRelease.changelog && firmwareRelease.changelog?.length > 0) {
        firmwareRelease.changelog.forEach((log: any) => {
            // get array of individual changes for a given version
            const logsArr = log.changelog.trim().split(/\*/g);

            // The first element of logsArr is an empty array, so get rid of it (but still make sure it's really empty).
            if (!logsArr[0]) {
                logsArr.shift();
            }

            // Get firmware version, convert to string and use it as a key in custom object
            const versionString = log.version.join('.'); // e.g. [1,9,8] => "1.9.8"

            logsCustomObject[versionString] = {}; // Object initialization
            logsCustomObject[versionString].changelogs = logsArr;
            logsCustomObject[versionString].url = log.url;
            logsCustomObject[versionString].notes = log.notes;
        });
    }

    return (
        <BodyWrapper>
            <H2 isGreen data-test="@firmware/initial/subheading/version">
                v{window.$BLE_DATA?.version ?? ''} 已发布!
            </H2>
            <P>
                <Translation id="FIRMWARE_UPDATE_AVAILABLE_DESC" />
            </P>

            <ChangesSummary data-test="@firmware/initial/changelog">
                <ChangelogGroup key={window.$BLE_DATA?.version}>
                    <ChangelogHeading>{window.$BLE_DATA?.version}</ChangelogHeading>
                    <ChangesUl>
                        {/* render individual changes for a given version */}
                        <li key={window.$BLE_DATA?.changelog_cn}>
                            {window.$BLE_DATA?.changelog_cn}
                        </li>
                    </ChangesUl>
                </ChangelogGroup>
            </ChangesSummary>

            {/* <BottomRow>
                <Button variant="tertiary" icon="GITHUB">
                    <TrezorLink href={CHANGELOG_URL}>
                        <Translation id="TR_READ_ALL_ON_GITHUB" />
                    </TrezorLink>
                </Button>
            </BottomRow> */}
        </BodyWrapper>
    );
};

const Body = () => {
    const { device } = useDevice();
    if (window?.$BLE_MODE) return <BLEBody />;

    // ensure that device is connected in requested mode
    if (device?.mode !== 'normal') return <ReconnectInNormalStep.Body />;
    if (device?.firmware === 'valid') return <NoNewFirmware.Body />;

    const { firmwareRelease } = device;
    if (!device?.features || !firmwareRelease) return null; // ts

    // Create custom object containing changelogs for easier manipulation in render() method.
    // Default changelog format is just a long string where individual changes are separated by "*" symbol.
    const logsCustomObject: any = {};

    if (firmwareRelease.changelog && firmwareRelease.changelog?.length > 0) {
        firmwareRelease.changelog.forEach((log: any) => {
            // get array of individual changes for a given version
            const logsArr = log.changelog.trim().split(/\*/g);

            // The first element of logsArr is an empty array, so get rid of it (but still make sure it's really empty).
            if (!logsArr[0]) {
                logsArr.shift();
            }

            // Get firmware version, convert to string and use it as a key in custom object
            const versionString = log.version.join('.'); // e.g. [1,9,8] => "1.9.8"

            logsCustomObject[versionString] = {}; // Object initialization
            logsCustomObject[versionString].changelogs = logsArr;
            logsCustomObject[versionString].url = log.url;
            logsCustomObject[versionString].notes = log.notes;
        });
    }

    return (
        <BodyWrapper>
            <H2 isGreen data-test="@firmware/initial/subheading/version">
                v{firmwareRelease.release.version.join('.')} 已发布!
            </H2>
            <P>
                <Translation id="FIRMWARE_UPDATE_AVAILABLE_DESC" />
            </P>

            {Object.keys(logsCustomObject).length > 0 && (
                <ChangesSummary data-test="@firmware/initial/changelog">
                    {Object.keys(logsCustomObject).map(version => {
                        const log = logsCustomObject[version];
                        return (
                            <ChangelogGroup key={version}>
                                <ChangelogHeading>{version}</ChangelogHeading>
                                <ChangesUl>
                                    {/* render individual changes for a given version */}
                                    {log.changelogs.map(
                                        (change: string) =>
                                            // return only if change is not an empty array
                                            change && <li key={change}>{change}</li>,
                                    )}
                                </ChangesUl>
                                {log.notes && (
                                    <StyledExternalLink size="small" href={log.notes}>
                                        <Translation id="TR_LEARN_MORE" />
                                    </StyledExternalLink>
                                )}
                            </ChangelogGroup>
                        );
                    })}
                </ChangesSummary>
            )}

            {/* <BottomRow>
                <Button variant="tertiary" icon="GITHUB">
                    <TrezorLink href={CHANGELOG_URL}>
                        <Translation id="TR_READ_ALL_ON_GITHUB" />
                    </TrezorLink>
                </Button>
            </BottomRow> */}
        </BodyWrapper>
    );
};

const HowLong = styled.div`
    color: ${props => props.theme.TYPE_DARK_GREY};
    font-size: ${FONT_SIZE.TINY};
    display: flex;
    justify-content: center;
    margin-top: 16px;
    align-items: center;
`;

const BLEBottomBar = () => {
    const { setStatus } = useFirmware();
    const { device } = useDevice();

    if (!device?.connected || !device?.features || device.mode !== 'normal') {
        return null;
    }

    if (
        isNewer(
            (window.$BLE_DATA?.version.split('.').map(Number) as [number, number, number]) ?? [
                1,
                0,
                0,
            ],
            getBleVerAsArray(device?.features?.ble_ver)
        )
    ) {
        return (
            <>
                <ContinueButton onClick={() => setStatus('check-seed')} />
                <HowLong>
                    <Icon size={12} icon="CLOCK" />
                    <Translation id="TR_TAKES_N_MINUTES" values={{ n: '5' }} />
                </HowLong>
            </>
        );
    }

    return null;
};

const BottomBar = () => {
    const { setStatus } = useFirmware();
    const { device } = useDevice();

    if (window?.$BLE_MODE) return <BLEBottomBar />;
    if (!device?.connected || !device?.features || device.mode !== 'normal') {
        return null;
    }

    if (['outdated', 'required'].includes(device.firmware)) {
        return (
            <>
                <ContinueButton onClick={() => setStatus('check-seed')} />
                <HowLong>
                    <Icon size={12} icon="CLOCK" />
                    <Translation id="TR_TAKES_N_MINUTES" values={{ n: '3' }} />
                </HowLong>
            </>
        );
    }

    return null;
};

export const InitialStep = {
    Heading,
    Body,
    BottomBar,
};
