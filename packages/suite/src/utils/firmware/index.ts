import { AppState } from '@suite-types';

export const getFormattedFingerprint = (fingerprint: string) => {
    return [
        fingerprint.substr(0, 16),
        fingerprint.substr(16, 16),
        fingerprint.substr(32, 16),
        fingerprint.substr(48, 16),
    ]
        .join('\n')
        .toUpperCase();
};

export const getTextForStatus = (status: AppState['firmware']['status']) => {
    switch (status) {
        case 'waiting-for-confirmation':
            return 'TR_WAITING_FOR_CONFIRMATION';
        case 'started':
        case 'installing':
            return 'TR_INSTALLING';
        case 'wait-for-reboot':
            return 'TR_WAIT_FOR_REBOOT';
        case 'reconnect-timeout':
            return 'TR_RECONNECT_TIMEOUT';
        case 'unplug':
            return 'TR_DISCONNECT_YOUR_DEVICE';
        default:
            return null;
    }
};
export const getDescriptionForStatus = (status: AppState['firmware']['status']) => {
    switch (status) {
        case 'started':
        case 'installing':
        case 'wait-for-reboot':
            return 'TR_DO_NOT_DISCONNECT';
        case 'reconnect-timeout':
            return 'TR_NO_NEED_TO_DISCONNECT';
        default:
            return null;
    }
};

type VersionArray = [number, number, number];

export const parse = (versionArr: VersionArray) => {
    return {
        major: versionArr[0],
        minor: versionArr[1],
        patch: versionArr[2],
    };
};

export const toString = (arr: VersionArray) => `${arr[0]}.${arr[1]}.${arr[2]}`;

export const isNewer = (versionX: VersionArray, versionY: VersionArray) => {
    const parsedX = parse(versionX);
    const parsedY = parse(versionY);

    if (parsedX.major - parsedY.major !== 0) {
        return parsedX.major > parsedY.major;
    }
    if (parsedX.minor - parsedY.minor !== 0) {
        return parsedX.minor > parsedY.minor;
    }
    if (parsedX.patch - parsedY.patch !== 0) {
        return parsedX.patch > parsedY.patch;
    }

    return false;
};

export const isEqual = (versionX: VersionArray, versionY: VersionArray) =>
    toString(versionX) === toString(versionY);

export const isNewerOrEqual = (versionX: VersionArray, versionY: VersionArray) =>
    isNewer(versionX, versionY) || isEqual(versionX, versionY);
