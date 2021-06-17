import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme, Icon, IconProps, variables } from '@trezor/components';

const Wrapper = styled.div<Pick<Props, 'isActive'>>`
    display: flex;
    position: relative;
    cursor: pointer;
    align-items: center;
    padding-left: 8px;
    border-radius: 8px;
    ${props =>
        props.isActive &&
        css`
            font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
            background-color: ${props => props.theme.BG_GREY_ALT};
        `}
`;

const IconWrapper = styled.div<Pick<Props, 'isActive'>>`
    display: flex;
    position: relative;
    cursor: pointer;
    align-items: center;
    margin-right: 16px;
`;

const Label = styled.span`
    padding: 16px 8px;
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    font-size: ${variables.FONT_SIZE.NORMAL};
`;

const AlertDotWrapper = styled.div`
    position: absolute;
    top: 0;
    right: 2px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.BG_WHITE};
`;

const AlertDot = styled.div`
    position: relative;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.theme.TYPE_ORANGE};
`;

interface CommonProps extends Pick<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
    label: React.ReactNode;
    isActive?: boolean;
    withAlertDot?: boolean;
}

interface CustomIconComponentProps extends CommonProps {
    iconComponent: React.ReactNode;
    icon?: never;
}
interface IconComponentProps extends CommonProps {
    icon: IconProps['icon'];
    iconComponent?: never;
}

type Props = CustomIconComponentProps | IconComponentProps;

const ActionItem = React.forwardRef((props: Props) => {
    const theme = useTheme();
    const iconComponent = props.icon ? (
        <Icon
            color={props.isActive ? theme.TYPE_GREEN : theme.TYPE_LIGHT_GREY}
            size={24}
            icon={props.icon}
        />
    ) : (
        props.iconComponent
    );

    return (
        <Wrapper {...props}>
            <IconWrapper isActive={props.isActive}>
                {iconComponent}
                {props.withAlertDot && (
                    <AlertDotWrapper>
                        <AlertDot />
                    </AlertDotWrapper>
                )}
            </IconWrapper>
            <Label>{props.label}</Label>
        </Wrapper>
    );
});
export default ActionItem;
