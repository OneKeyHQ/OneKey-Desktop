import React, { useState } from 'react';

export default function ActivableChain({ icon, alt }) {
    const [isActive, setIsActive] = useState(true);

    function toggleActive() {
        setIsActive(value => !value);
    }

    return (
        <button
            type="button"
            onClick={toggleActive}
            className="w-7 h-7 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:ring-offset-gray-900"
        >
            <img className={`transition ${isActive ? '' : 'opacity-50'}`} src={icon} alt={alt} />
        </button>
    );
}
