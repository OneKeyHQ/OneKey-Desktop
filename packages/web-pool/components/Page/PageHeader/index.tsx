import React, { FC, ReactNode } from 'react';
import cx, { Argument } from 'classnames';
import { Button } from '@onekeyhq/ui-components';

export type PageHeaderProps = {
    /**
     * 设置额外的 class
     */
    className?: Argument;
    /**
     * 面包屑导航
     */
    breadcrubms?: Array<any>;
    /**
     * 设置额外的 class
     */
    actions?: ReactNode;
    /**
     * 标题之前的缩略图
     */
    thumbnail?: ReactNode;
    /**
     * 页面标题
     */
    title?: string;
};

const defaultProps = {} as const;

const PageHeader: FC<PageHeaderProps> = ({
    className,
    children,
    actions,
    breadcrubms,
    thumbnail,
    title,
    ...rest
}) => {
    return (
        <header
            className={cx('flex-shrink-0 border-b border-gray-200', !!className && className)}
            {...rest}
        >
            <div className="p-4 lg:px-8">
                <div className="flex flex-wrap items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center min-w-0">
                        {!!breadcrubms?.length && breadcrubms.length === 1 ? (
                            <nav className="flex items-center justify-center w-5 h-5 mr-5">
                                <Button
                                    href={breadcrubms[0].url}
                                    as="a"
                                    leadingIcon="ArrowLeftSolid"
                                    type="plain"
                                    circular
                                >
                                    <span className="sr-only">{breadcrubms[0].content}</span>
                                </Button>
                            </nav>
                        ) : null}
                        <div className="flex items-center min-w-0 space-x-3">
                            {thumbnail && (
                                <div className="inline-flex flex-shrink-0">{thumbnail}</div>
                            )}
                            <h1 className="text-lg font-medium text-gray-900 truncate">{title}</h1>
                        </div>
                    </div>

                    {actions && <div>{actions}</div>}
                </div>
            </div>
        </header>
    );
};

PageHeader.defaultProps = defaultProps;

export default PageHeader;
