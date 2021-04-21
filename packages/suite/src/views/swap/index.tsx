/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { LayoutContext } from '@suite-components';

const SwapContainer: React.FC<{ menu: React.ReactNode }> = ({ menu }) => {
    const { setLayout } = useContext(LayoutContext);

    useEffect(() => {
        if (setLayout) setLayout('Swap', undefined, menu, true);
    }, [setLayout, menu]);

    return null;
};

export default connect()(SwapContainer);
