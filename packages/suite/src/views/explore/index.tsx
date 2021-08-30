/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext, useEffect } from 'react';
import { LayoutContext } from '@suite-components';
import AccountsSelector from '@suite/components/wallet/AccountsSelector';

const ExploreContainer: React.FC<{ menu: React.ReactNode; loaded?: boolean }> = ({
    menu,
    loaded = false,
}) => {
    const { setLayout } = useContext(LayoutContext);

    useEffect(() => {
        if (setLayout) setLayout('Explore', loaded ? <AccountsSelector /> : undefined, menu, true);
    }, [setLayout, menu, loaded]);

    return null;
};

export default ExploreContainer;
