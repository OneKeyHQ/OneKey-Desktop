import React, { FC, ReactNode } from 'react';
import cx, { Argument } from 'classnames';

type SettingsItemProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
    /**
     * 标题
     */
    title?: ReactNode;
    /**
     * 描述
     */
    description?: ReactNode;
};

const defaultProps = {} as const;

const SettingsItem: FC<SettingsItemProps> = ({
    className,
    children,
    title,
    description,
    ...rest
}) => {
    return (
        <div className={cx('', !!className && className)} {...rest}>
            <h5 className="font-medium text-gray-900">{title}</h5>
            <p className="text-gray-500">{description}</p>
            <div className="mt-3">{children}</div>
        </div>
    );
};

SettingsItem.defaultProps = defaultProps;

export default SettingsItem;
