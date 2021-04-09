// TODO: Add generic locale keys
interface Pin {
    code: '' | 'desktop' | 'device';
    zh: string;
    en: string;
}

export default [
    { code: 'desktop', zh: '在桌面端解锁', en: 'Desktop' },
    { code: 'device', zh: '在设备上解锁', en: 'Device' },
] as ReadonlyArray<Pin>;
