import React from 'react';
import PageHeader from '@components/PageHeader';

export default function layout(props) {
    const { children, showHeader = true, pageTitle, back, ...rest } = props;

    return (
        <main className="relative flex-1 overflow-y-auto lg:h-full" {...rest}>
            {/* Page title & actions */}
            {showHeader && <PageHeader back={back} pageTitle={pageTitle} />}
            {/* Page Content */}
            <div className="p-4 lg:p-8">
                <div className="w-full max-w-6xl mx-auto">{children}</div>
            </div>
        </main>
    );
}
