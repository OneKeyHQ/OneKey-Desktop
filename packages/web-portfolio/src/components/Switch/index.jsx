import React, { useState } from 'react';

import { Switch } from '@headlessui/react';
import classNames from 'classnames';

export default function OneSwitch({ checked, onChange }) {
    const [enabled, setEnabled] = useState(checked);
    const active = checked ?? enabled;
    return (
        <Switch
            checked={active}
            onChange={onChange ?? setEnabled}
            className={classNames(
                active ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-600',
                'relative inline-flex flex-shrink-0 h-5 w-10 border-4 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-gray-900',
            )}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={classNames(
                    active ? 'translate-x-5 dark:bg-white' : 'translate-x-0 dark:bg-gray-900',
                    'pointer-events-none bg-white inline-block h-3 w-3 rounded-full shadow transform ring-0 transition ease-in-out duration-200',
                )}
            />
        </Switch>
    );
}
