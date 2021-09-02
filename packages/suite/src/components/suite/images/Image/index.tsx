import React from 'react';
import styled, { css } from 'styled-components';
import { resolveStaticPath } from '@suite-utils/nextjs';

const PATH = 'images/svg';

const IMAGES = {
    '404': '404.svg',
    '12-words': '12-words.svg',
    '18-words': '18-words.svg',
    '24-words': '24-words.svg',
    TUnknown: 'TUnknown.svg',
    analytics: 'analytics.svg',
    back: 'back.svg',
    'classic-T1': 'classic-T1.svg',
    'classic-all-done-1': 'classic-all-done-1.svg',
    'classic-bridge-check': 'classic-bridge-check.svg',
    'classic-bridge-question-1': 'classic-bridge-question-1.svg',
    'classic-bridge-question': 'classic-bridge-question.svg',
    'classic-device-confirm': 'classic-device-confirm.svg',
    'classic-device-initialized-1': 'classic-device-initialized-1.svg',
    'classic-empty-dashboard': 'classic-empty-dashboard.svg',
    'classic-existing-user': 'classic-existing-user.svg',
    'classic-firmware-init-1': 'classic-firmware-init-1.svg',
    'classic-firmware-success-1': 'classic-firmware-success-1.svg',
    'classic-how-to-enter-bootloader-model-1': 'classic-how-to-enter-bootloader-model-1.svg',
    'classic-model-1': 'classic-model-1.svg',
    'classic-new-device': 'classic-new-device.svg',
    'classic-new-user': 'classic-new-user.svg',
    'classic-one-device-confirm': 'classic-one-device-confirm.svg',
    'classic-pin-ask-1': 'classic-pin-ask-1.svg',
    'classic-pin-success-1': 'classic-pin-success-1.svg',
    'classic-recovery-advanced': 'classic-recovery-advanced.svg',
    'classic-set-up-pin-dialog': 'classic-set-up-pin-dialog.svg',
    'classic-used-device': 'classic-used-device.svg',
    'classic-writing-seed': 'classic-writing-seed.svg',
    'connect-device': 'connect-device.svg',
    'create-new': 'create-new.svg',
    'device-another-session': 'device-another-session.svg',
    'disconnect-device': 'disconnect-device.svg',
    'hologram-warning': 'hologram-warning.svg',
    'mini-T1': 'mini-T1.svg',
    'mini-all-done-1': 'mini-all-done-1.svg',
    'mini-bridge-check': 'mini-bridge-check.svg',
    'mini-bridge-question-1': 'mini-bridge-question-1.svg',
    'mini-bridge-question': 'mini-bridge-question.svg',
    'mini-device-confirm': 'mini-device-confirm.svg',
    'mini-device-initialized-1': 'mini-device-initialized-1.svg',
    'mini-existing-user': 'mini-existing-user.svg',
    'mini-firmware-init-1': 'mini-firmware-init-1.svg',
    'mini-firmware-success-1': 'mini-firmware-success-1.svg',
    'mini-how-to-enter-bootloader-model-1': 'mini-how-to-enter-bootloader-model-1.svg',
    'mini-model-1': 'mini-model-1.svg',
    'mini-new-device': 'mini-new-device.svg',
    'mini-new-user': 'mini-new-user.svg',
    'mini-one-device-confirm': 'mini-one-device-confirm.svg',
    'mini-pin-ask-1': 'mini-pin-ask-1.svg',
    'mini-pin-success-1': 'mini-pin-success-1.svg',
    'mini-recovery-advanced': 'mini-recovery-advanced.svg',
    'mini-set-up-pin-dialog': 'mini-set-up-pin-dialog.svg',
    'mini-used-device': 'mini-used-device.svg',
    'mini-wallet-empty': 'mini-wallet-empty.svg',
    'mini-writing-seed': 'mini-writing-seed.svg',
    'recover-from-seed': 'recover-from-seed.svg',
    'recovery-basic': 'recovery-basic.svg',
    reload: 'reload.svg',
    'seed-card-shamir': 'seed-card-shamir.svg',
    'seed-card-single': 'seed-card-single.svg',
    spinner: 'spinner.svg',
    'uni-empty-page': 'uni-empty-page.svg',
    'uni-error': 'uni-error.svg',
    'uni-success': 'uni-success.svg',
    'uni-warning': 'uni-warning.svg',
    'wallet-empty-neue': 'wallet-empty-neue.png',
    'wallet-empty-neue@2x': 'wallet-empty-neue@2x.png',
    'wallet-empty': 'wallet-empty.svg',
    welcome: 'welcome.svg',
} as const;

type Image = keyof typeof IMAGES;
export type Props = React.ImgHTMLAttributes<Omit<HTMLImageElement, 'src'>> & {
    image: Image;
    alt?: string; // why? Seems not to be part of HTMLImageElement :(
};

const buildSrcSet = (image: Image) => {
    const imageFile1x = IMAGES[image];
    const hiRes = `${image}_2x`;
    const imageFile2x = hiRes in IMAGES ? IMAGES[hiRes as Image] : undefined;
    if (!imageFile2x) return undefined;

    return `${resolveStaticPath(`${PATH}/${imageFile1x}`)} 1x, ${resolveStaticPath(
        `${PATH}/${imageFile2x}`,
    )} 2x`;
};

const Image = styled.img`
    /* should not overflow it's container */
    max-width: 100%;

    ${props =>
        props.theme.IMAGE_FILTER &&
        css`
            filter: ${props.theme.IMAGE_FILTER};
        `}
`;

const ImageComponent = ({ image, alt = '', ...props }: Props) => (
    <Image
        {...props}
        alt={alt}
        src={resolveStaticPath(`${PATH}/${IMAGES[image]}`)}
        srcSet={buildSrcSet(image)}
    />
);

export default ImageComponent;
