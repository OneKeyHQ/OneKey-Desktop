import React, { useState } from 'react';
import DeviceSelector from './components/DeviceSelector';
import NavigationActions from './components/NavigationActions';
import styled from 'styled-components';
import { Icon, TrezorLogo, useTheme } from '@trezor/components';
import { useLayoutSize } from '@suite-hooks';

const StyledDeviceSelector = styled(DeviceSelector)``;

const StyledTrezorLogo = styled(TrezorLogo)`
    margin-bottom: 30px;
    align-self: flex-start;
`;

const StyledNavigationBar = styled.div<{ isMobileLayout: boolean }>`
    display: flex;
    width: 100%;
    min-height: 80px;
    flex: 0;
    z-index: 3;
    padding: ${props => (!props.isMobileLayout ? '6px 32px 6px 8px' : '6px 8px')};
    align-items: center;
    background: ${props => props.theme.BG_WHITE};
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};

    &:hover ${StyledDeviceSelector} {
        /* apply same device selector's hover styles on hover anywhere in navigation panel */
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 ${props => props.theme.BOX_SHADOW_BLACK_20};
    }
`;

const VerticalNavigationBar = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 281px;
    height: 100%;
    flex: 0;
    z-index: 3;
    padding: 25px 20px 0 10px;
    align-items: center;
    background: ${props => props.theme.BG_NAVBAR};
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};

    &:hover ${StyledDeviceSelector} {
        /* apply same device selector's hover styles on hover anywhere in navigation panel */
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 ${props => props.theme.BOX_SHADOW_BLACK_20};
    }
`;

const HamburgerWrapper = styled.div`
    display: flex;
    padding-right: 12px;
    flex: 1;
    justify-content: flex-end;
`;

const MobileNavigationWrapper = styled.div`
    position: relative;
    height: 100vh;
`;

const ExpandedMobileNavigation = styled.div`
    display: flex;
    position: absolute;
    flex-direction: column;
    background: ${props => props.theme.BG_WHITE};
    z-index: 3;
    width: 100%;
    height: 100%;
`;

const NavigationBar = () => {
    const [opened, setOpened] = useState(false);
    const { isMobileLayout } = useLayoutSize();
    const theme = useTheme();

    const closeMainNavigation = () => {
        setOpened(false);
    };

    if (isMobileLayout) {
        return (
            <>
                <StyledNavigationBar isMobileLayout={isMobileLayout}>
                    <StyledDeviceSelector isMobileLayout={isMobileLayout} />
                    <HamburgerWrapper>
                        <Icon
                            onClick={() => setOpened(!opened)}
                            icon={opened ? 'CROSS' : 'MENU'}
                            size={24}
                            color={theme.TYPE_DARK_GREY}
                        />
                    </HamburgerWrapper>
                </StyledNavigationBar>
                {opened && (
                    <MobileNavigationWrapper>
                        <ExpandedMobileNavigation>
                            <NavigationActions closeMainNavigation={closeMainNavigation} />
                        </ExpandedMobileNavigation>
                    </MobileNavigationWrapper>
                )}
            </>
        );
    }

    return (
        <VerticalNavigationBar>
            <StyledTrezorLogo type="horizontal" height={35} />
            <StyledDeviceSelector />
            <NavigationActions />
        </VerticalNavigationBar>
    );
};

export default NavigationBar;
