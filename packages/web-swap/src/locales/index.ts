import en from './en.json';
import zhCN from './zh-CN.json';
import zhTW from './zh-TW.json';
import esAR from './es-AR.json';
import esUS from './es-US.json';
import de from './de.json';
import he from './he.json';
import itIT from './it-IT.json';
import ro from './ro.json';
import ru from './ru.json';
import vi from './vi.json';

export type TranslationKeys = Partial<keyof typeof en>;
export type TranslationMap = Record<TranslationKeys, string>;
export type LocaleKey =
    | 'en'
    | 'de'
    | 'he'
    | 'ro'
    | 'ru'
    | 'vi'
    | 'en-US'
    | 'zh-CN'
    | 'zh-TW'
    | 'es-AR'
    | 'es-US'
    | 'it-IT'
    | 'vi-VN';

export default {
    en,
    de,
    he,
    ro,
    ru,
    vi,
    'en-US': en,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'es-AR': esAR,
    'es-US': esUS,
    'it-IT': itIT,
    'vi-VN': vi,
} as const;
