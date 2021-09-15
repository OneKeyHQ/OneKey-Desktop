import React, { FC } from 'react';
import cx, { Argument } from 'classnames';
import { Sidebar } from '@onekeyhq/ui-components';
import Page, { PageProps } from '../Page';

type LayoutProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
    /**
     * 是否显示 sidebar，默认为 true
     */
    sidebar?: boolean;
    /**
     * Page 的属性
     */
    page?: PageProps;
};

const defaultProps = {
    sidebar: true,
} as const;

const Layout: FC<LayoutProps> = ({ className, children, sidebar, page, ...rest }) => {
    return (
        <div
            className={cx(
                'flex flex-col w-full h-full h-screen lg:flex-row antialiased',
                !!className && className,
            )}
            {...rest}
        >
            {!!sidebar && <Sidebar />}
            <Page {...page}>{children}</Page>
        </div>
    );
};

Layout.defaultProps = defaultProps;

export default Layout;
