export function getBleVerAsArray(bleVer?: string): [number, number, number] {
    const result = bleVer?.split('.').map(Number);
    if (result && result.length === 3 && !result.some(v => Number.isNaN(v))) {
        return result as [number, number, number];
    }
    return [1, 0, 0];
}
