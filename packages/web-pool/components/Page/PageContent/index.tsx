import React, { FC } from 'react';
import cx, { Argument } from 'classnames';

type PageContentProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
};

const defaultProps = {} as const;

const PageContent: FC<PageContentProps> = ({ className, children, ...rest }) => {
    return (
        <div className={cx('flex-1 p-4 lg:p-8', !!className && className)} {...rest}>
            <div className={cx('w-full max-w-6xl mx-auto')}>{children}</div>
        </div>
    );
};

PageContent.defaultProps = defaultProps;

export default PageContent;
