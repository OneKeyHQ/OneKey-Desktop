/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext, useEffect } from 'react';
import { LayoutContext } from '@suite-components';
import AccountsSelector from '@suite/components/wallet/AccountsSelector';

const SwapContainer: React.FC<{ menu: React.ReactNode; loaded?: boolean }> = ({
    menu,
    loaded = false,
}) => {
    const { setLayout } = useContext(LayoutContext);

    useEffect(() => {
        if (setLayout) setLayout('Swap', loaded ? <AccountsSelector /> : undefined, menu, true);
    }, [setLayout, menu, loaded]);

    return null;
};

export default SwapContainer;
