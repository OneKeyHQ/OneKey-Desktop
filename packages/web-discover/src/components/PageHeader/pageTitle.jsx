import React from 'react';

export default function PageTitle({ pageTitle }) {
    return (
        <div>
            <h1 className="text-lg font-medium text-gray-900 dark:text-gray-50">{pageTitle}</h1>
        </div>
    );
}
