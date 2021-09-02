import React from 'react';
import styled from 'styled-components';
import { variables } from '@trezor/components';
import { Translation, Image } from '@suite-components';
import { useDevice, useFirmware } from '@suite-hooks';

const Wrapper = styled.div`
    display: flex;
    padding: 54px 42px;
    align-items: center;

    @media screen and (max-width: ${variables.SCREEN_SIZE.MD}) {
        flex-direction: column;
    }
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    display: flex;
    font-size: ${variables.FONT_SIZE.H2};
    color: ${props => props.theme.TYPE_DARK_GREY};
    margin-bottom: 30px;
    text-align: center;
`;

const StyledImage = styled(props => <Image {...props} />)`
    display: flex;
    width: 220px;
    height: 180px;
    margin-right: 52px;

    @media screen and (max-width: ${variables.SCREEN_SIZE.MD}) {
        margin-bottom: 20px;
    }
`;

const SecurityItem = styled.div`
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-size: ${variables.FONT_SIZE.BUTTON};

    & + & {
        margin-top: 12px;
    }
`;

type Props = React.HTMLAttributes<HTMLDivElement>;

const EmptyWallet = (props: Props) => {
    const { device } = useDevice();
    return (
        <Wrapper {...props} data-test="@dashboard/wallet-ready">
            <StyledImage image={device?.deviceType ? `${device.deviceType}-new-device` : '404'} />
            <Content>
                <Title>
                    <Translation id="TR_YOUR_WALLET_IS_READY_WHAT" />
                </Title>
                <SecurityItem>
                    <Translation id="TR_ADDITIONAL_SECURITY_FEATURES" />
                </SecurityItem>
            </Content>
        </Wrapper>
    );
};

export default EmptyWallet;
