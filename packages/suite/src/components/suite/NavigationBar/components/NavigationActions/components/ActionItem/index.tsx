import React from 'react';
import styled from 'styled-components';
import { useTheme, Icon, IconProps, variables } from '@trezor/components';
import classNames from 'classnames';

const Wrapper = styled.div<Pick<Props, 'isActive'>>``;

const IconWrapper = styled.div<Pick<Props, 'isActive'>>``;

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
            size={24}
            icon={props.icon}
            className={classNames(
                props.isActive
                    ? 'text-gray-500 dark:text-white/80'
                    : 'text-gray-400 dark:text-white/40',
            )}
        />
    ) : (
        props.iconComponent
    );

    return (
        <Wrapper
            className={classNames(
                'relative flex items-center p-2 transition rounded-md cursor-pointer',
                props.isActive
                    ? 'text-gray-900 bg-gray-100 dark:text-white/90 dark:bg-white/10'
                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white/90 dark:text-white/50',
            )}
            {...props}
        >
            <IconWrapper className="relative md:p-2 lg:p-0" isActive={props.isActive}>
                {iconComponent}
                {props.withAlertDot && (
                    <AlertDotWrapper>
                        <AlertDot />
                    </AlertDotWrapper>
                )}
            </IconWrapper>
            <div className="flex items-center flex-1 ml-3 font-medium translate-y-px md:hidden lg:flex lg:text-sm">
                {props.label}
            </div>
        </Wrapper>
    );
});
export default ActionItem;
