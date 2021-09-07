import React from 'react';
import styled from 'styled-components';

const InfoCard = styled.button`
    padding: 1rem;
    outline: none;
    border: 1px solid;
    border-radius: 12px;
    width: 100% !important;
    border-color: ${({ active }) => (active ? 'transparent' : '#EDEEF2')};
    background-color: ${({ active }) => (active ? '#EDEEF2' : '')};
    &:focus {
        box-shadow: 0 0 0 1px #00b812;
    }
`;

const OptionCard = styled(InfoCard)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 2rem;
    padding: 1rem;
`;

const OptionCardLeft = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const OptionCardClickable = styled(OptionCard)`
    margin-top: 0;
    &:hover {
        cursor: ${({ clickable }) => (clickable ? 'pointer' : '')};
        border: ${({ clickable }) => (clickable ? `1px solid #00B812` : ``)};
    }
    opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`;

const GreenCircle = styled.div`
    justify-content: center;
    align-items: center;

    &:first-child {
        height: 8px;
        width: 8px;
        margin-right: 8px;
        border-radius: 50%;
        background-color: #27ae60;
    }
`;

const CircleWrapper = styled.div`
    color: #27ae60;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const HeaderText = styled.div`
    display: flex;
    flex-flow: row nowrap;
    font-size: 1rem;
    font-weight: 500;
`;

const SubHeader = styled.div`
    margin-top: 10px;
    font-size: 12px;
`;

const IconWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
`;

export default function Option({
    link = null,
    clickable = true,
    size,
    onClick = null,
    color,
    header,
    subheader = null,
    icon,
    active = false,
    id,
}) {
    const content = (
        <OptionCardClickable
            id={id}
            onClick={onClick}
            clickable={clickable && !active}
            active={active}
            className="focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
            <OptionCardLeft>
                <HeaderText color={color}>
                    {active ? (
                        <CircleWrapper>
                            <GreenCircle>
                                <div />
                            </GreenCircle>
                        </CircleWrapper>
                    ) : (
                        ''
                    )}
                    {header}
                </HeaderText>
                {subheader && <SubHeader>{subheader}</SubHeader>}
            </OptionCardLeft>
            <IconWrapper size={size}>
                <img alt="icon" src={icon} />
            </IconWrapper>
        </OptionCardClickable>
    );

    if (link) {
        return (
            <a href={link} target="blank">
                {content}
            </a>
        );
    }

    return content;
}
