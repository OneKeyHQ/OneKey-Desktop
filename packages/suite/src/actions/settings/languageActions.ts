import { resolveStaticPath } from '@suite-utils/nextjs';
import { SUITE } from '@suite-actions/constants';
import { Dispatch } from '@suite-types';
import { LANGUAGES } from '@suite-config';
import enLocale from '@trezor/suite-data/files/translations/en-US.json';
import zhLocale from '@trezor/suite-data/files/translations/zh-CN.json';

export const fetchLocale = (locale: typeof LANGUAGES[number]['code']) => async (
    dispatch: Dispatch,
) => {
    if (locale === 'en') {
        dispatch({
            type: SUITE.SET_LANGUAGE,
            locale,
            messages: enLocale,
        });
    } else if (locale === 'zh') {
        dispatch({
            type: SUITE.SET_LANGUAGE,
            locale,
            messages: zhLocale,
        });
    } else {
        try {
            const response = await fetch(resolveStaticPath(`translations/${locale}.json`));
            if (!response.ok) throw Error(response.statusText);

            const messages: { [key: string]: string } = await response.json();
            dispatch({
                type: SUITE.SET_LANGUAGE,
                locale,
                messages,
            });
        } catch (error) {
            dispatch({
                type: SUITE.SET_LANGUAGE,
                locale: 'en',
                messages: enLocale,
            });
        }
    }
};
