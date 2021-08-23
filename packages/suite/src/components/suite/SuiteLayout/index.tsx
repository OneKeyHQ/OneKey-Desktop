import React, { useState, createContext } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { variables, scrollbarStyles } from '@trezor/components';
import SuiteBanners from '@suite-components/Banners';
import { AppState } from '@suite-types';
import { Metadata } from '@suite-components';
import MenuSecondary from '@suite-components/MenuSecondary';
import { MAX_WIDTH, DESKTOP_TITLEBAR_HEIGHT } from '@suite-constants/layout';
import { DiscoveryProgress } from '@wallet-components';
import NavigationBar from '../NavigationBar';
import { useLayoutSize } from '@suite-hooks';
import { isDesktop, isMac as isMacOS } from '@suite-utils/env';

const PageWrapper = styled.div`
    height: ${isDesktop() ? '100vh' : '100vh'};
    display: flex;
    flex-direction: column;
`;

const Body = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
`;

// AppWrapper and MenuSecondary creates own scrollbars independently
const Columns = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1 0 100%;
    overflow: auto;
`;

const AppWrapper = styled.div<{ isMac?: boolean }>`
    display: flex;
    color: ${props => props.theme.TYPE_DARK_GREY};
    background: ${props => props.theme.BG_GREY};
    flex-direction: column;
    overflow-x: auto;
    overflow-y: scroll;
    width: 100%;
    align-items: center;
    padding-top: ${({ isMac }) => (!isMac ? '28px' : '0')};

    ${scrollbarStyles}
`;

const MaxWidthWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    max-width: ${MAX_WIDTH};
`;

const DefaultPaddings = styled.div<{ ignoreChildren?: boolean }>`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: ${({ ignoreChildren }) => (!ignoreChildren ? '24px 32px 90px 32px' : 0)};

    @media screen and (max-width: ${variables.SCREEN_SIZE.LG}) {
        padding: ${({ ignoreChildren }) => (!ignoreChildren ? '24px 16px 70px 16px' : 0)};
    }

    @media screen and (max-width: ${variables.SCREEN_SIZE.SM}) {
        padding-bottom: 50px;
    }
`;

const mapStateToProps = (state: AppState) => ({
    router: state.router,
});

type Props = ReturnType<typeof mapStateToProps> & {
    children?: React.ReactNode;
};

interface BodyProps {
    url: string;
    menu?: React.ReactNode;
    appMenu?: React.ReactNode;
    children?: React.ReactNode;
    ignoreChildren?: boolean;
}

interface LayoutContextI {
    title?: string;
    menu?: React.ReactNode;
    appMenu?: React.ReactNode;
    setLayout?: (
        title?: string,
        menu?: React.ReactNode,
        appMenu?: React.ReactNode,
        status?: boolean,
    ) => void;
}

export const LayoutContext = createContext<LayoutContextI>({
    title: undefined,
    menu: undefined,
    appMenu: undefined,
    setLayout: undefined,
});

type ScrollAppWrapperProps = Pick<BodyProps, 'url' | 'children'>;
// ScrollAppWrapper is mandatory to reset AppWrapper scroll position on url change, fix: issue #1658
const ScrollAppWrapper = ({ url, children }: ScrollAppWrapperProps) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const isMac = isMacOS();
    React.useEffect(() => {
        const { current } = ref;
        if (!current) return;
        current.scrollTop = 0; // reset scroll position on url change
    }, [ref, url]);
    return (
        <AppWrapper isMac={isMac} ref={ref}>
            {children}
        </AppWrapper>
    );
};

const BodyWide = ({ url, menu, appMenu, children, ignoreChildren }: BodyProps) => (
    <Body>
        <Columns>
            {menu && <MenuSecondary>{menu}</MenuSecondary>}
            <ScrollAppWrapper url={url}>
                {appMenu}
                <DefaultPaddings ignoreChildren={ignoreChildren}>
                    <MaxWidthWrapper>{children}</MaxWidthWrapper>
                </DefaultPaddings>
            </ScrollAppWrapper>
        </Columns>
    </Body>
);

const BodyNarrow = ({ url, menu, appMenu, children, ignoreChildren }: BodyProps) => (
    <Body>
        <Columns>
            <ScrollAppWrapper url={url}>
                {menu}
                {appMenu}
                <DefaultPaddings ignoreChildren={ignoreChildren}>{children}</DefaultPaddings>
            </ScrollAppWrapper>
        </Columns>
    </Body>
);

type SuiteLayoutProps = Omit<Props, 'menu' | 'appMenu'>;
const SuiteLayout = (props: SuiteLayoutProps) => {
    // TODO: if (props.layoutSize === 'UNAVAILABLE') return <SmallLayout />;
    const { isMobileLayout } = useLayoutSize();
    const [title, setTitle] = useState<string | undefined>(undefined);
    const [menu, setMenu] = useState<any>(undefined);
    const [appMenu, setAppMenu] = useState<any>(undefined);
    const [ignoreChildren, setIgnoreChildren] = useState(false);
    const setLayout = React.useCallback<NonNullable<LayoutContextI['setLayout']>>(
        (newTitle, newMenu, newAppMenu, childrenStatus) => {
            setTitle(newTitle);
            setMenu(newMenu);
            setAppMenu(newAppMenu);
            setIgnoreChildren(!!childrenStatus);
        },
        [],
    );

    return (
        <PageWrapper>
            <SuiteBanners />
            <div className="flex flex-col flex-1 overflow-x-hidden md:flex-row">
                <Metadata title={title} />
                <DiscoveryProgress />
                <NavigationBar />
                <LayoutContext.Provider value={{ title, menu, setLayout }}>
                    {!isMobileLayout && (
                        <BodyWide
                            key={title}
                            menu={menu}
                            appMenu={appMenu}
                            url={props.router.url}
                            ignoreChildren={!!ignoreChildren}
                        >
                            {props.children}
                        </BodyWide>
                    )}
                    {isMobileLayout && (
                        <BodyNarrow
                            key={title}
                            menu={menu}
                            appMenu={appMenu}
                            url={props.router.url}
                            ignoreChildren={!!ignoreChildren}
                        >
                            {props.children}
                        </BodyNarrow>
                    )}
                </LayoutContext.Provider>
                {/* <BetaBadge /> */}
            </div>
        </PageWrapper>
    );
};

export default connect(mapStateToProps)(SuiteLayout);
