import React from 'react';
import { Image, ImageProps } from '@suite-components';

const ConnectDeviceImage = (props: Omit<ImageProps, 'image'>) => {
    return <Image image="connect-device" {...props} />;
};

export default ConnectDeviceImage;
