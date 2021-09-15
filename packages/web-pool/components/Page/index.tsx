import React, { FC, ReactNode } from 'react';
import cx, { Argument } from 'classnames';
import PageHeader, { PageHeaderProps } from './PageHeader';
import PageContent from './PageContent';

export type PageProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
    /**
     * 二级导航
     */
    subNav?: ReactNode;
    /**
     * PageHeader 的属性
     */
    pageHeader?: PageHeaderProps;
};

const defaultProps = {} as const;

const Page: FC<PageProps> = ({ className, children, subNav, pageHeader, ...rest }) => {
    return (
        <main
            className={cx(
                !subNav ? 'flex-col' : '',
                'flex-1 flex bg-white-ground',
                !!className && className,
            )}
            {...rest}
        >
            {!subNav ? (
                <>
                    {!!(pageHeader?.title || pageHeader?.actions) && <PageHeader {...pageHeader} />}
                    <PageContent>{children}</PageContent>
                </>
            ) : (
                <>
                    {subNav}
                    <div className="flex flex-col flex-1">
                        {!!(pageHeader?.title || pageHeader?.actions) && (
                            <PageHeader {...pageHeader} />
                        )}
                        <PageContent>{children}</PageContent>
                    </div>
                </>
            )}
        </main>
    );
};

Page.defaultProps = defaultProps;

export default Page;
