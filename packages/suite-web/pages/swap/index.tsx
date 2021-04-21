import React from 'react';
import styled from 'styled-components';

import { AccountExceptionLayout } from '@wallet-components';
import Swap from '@swap-views';
import { MAX_WIDTH } from '@suite-constants/layout';
import { Translation } from '@suite-components';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    max-width: ${MAX_WIDTH};
    width: 100%;
    height: 100%;
`;

const Container = () => {
    return (
        <Wrapper>
            <AccountExceptionLayout
                title={<Translation id="TR_SWAP_IN_WEB_BROWSER" />}
                image="404"
                description={<Translation id="TR_SWAP_IN_WEB_BROWSER_DESC" />}
                actions={[
                    {
                        key: '1',
                        variant: 'secondary',
                        onClick: () => {
                            if (window.location) {
                                window.location.href = 'https://swap.onekey.so/';
                            }
                        },
                        children: <Translation id="TR_SWAP_IN_WEB_GOTO_SWAP_SITE" />,
                    },
                ]}
            />
        </Wrapper>
    );
};

const SwapContainer = () => {
    return <Swap key="swap" menu={<Container />} />;
};

export default SwapContainer;
