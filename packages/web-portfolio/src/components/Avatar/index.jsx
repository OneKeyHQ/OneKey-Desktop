import React from 'react';
import ImageFallback from 'react-image-fallback';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import cx from 'classnames';

const Avatar = ({
    address: _address,
    url,
    size = 32,
    avatarProps,
    className,
    rounded = true,
    ...rest
}) => {
    const imageClassName = cx('h-6 w-6', className);
    const address = _address || '';
    return (
        <ImageFallback
            src={url}
            fallbackImage={
                <Jazzicon
                    paperStyles={{
                        width: '100%',
                        height: '100%',
                        borderRadius: rounded ? '50%' : 'none',
                        overflow: 'hidden',
                    }}
                    diameter={size}
                    seed={jsNumberForAddress(address)}
                    {...avatarProps}
                />
            }
            alt="avatar"
            className={cx(imageClassName, {
                rounded: 'rounded-full overflow-hidden',
            })}
            style={{ minWidth: size, minHeight: size }}
            {...rest}
        />
    );
};

export default Avatar;
