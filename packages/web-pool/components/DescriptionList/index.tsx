import React, { FC } from 'react';
import cx, { Argument } from 'classnames';
import Item from './Item';

type DescriptionListProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
};

const defaultProps = {} as const;

const DescriptionList: FC<DescriptionListProps> & { Item } = ({ className, children, ...rest }) => {
    return (
        <div className={cx('space-y-3', !!className && className)} {...rest}>
            {children}
        </div>
    );
};

DescriptionList.defaultProps = defaultProps;
DescriptionList.Item = Item;

export default DescriptionList;
