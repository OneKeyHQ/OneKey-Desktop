// TODO: Add generic locale keys
interface Pin {
    code: '' | 'desktop' | 'device';
    zh: string;
    en: string;
}

export default [
    { code: 'desktop', zh: '在桌面端解锁', en: 'unlock on desktop' },
    { code: 'device', zh: '在设备上解锁', en: 'unlock on device' },
] as ReadonlyArray<Pin>;
