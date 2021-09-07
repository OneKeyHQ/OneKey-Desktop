/* eslint-disable no-unused-expressions */
import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Option from './Option';
import { SUPPORTED_WALLETS } from './constants';
import { injected } from './hooks/connect';

const PendingSection = styled.div`
    align-items: center;
    justify-content: center;
    width: 100%;
    & > * {
        width: 100%;
    }
`;

const LoadingMessage = styled.div`
    align-items: center;
    justify-content: flex-start;
    border-radius: 12px;
    margin-bottom: 20px;

    & > * {
        padding: 1rem;
    }
`;

const ErrorGroup = styled.div`
    align-items: center;
    justify-content: flex-start;
`;

const ErrorButton = styled.div`
    border-radius: 8px;
    font-size: 12px;
    margin-left: 1rem;
    padding: 0.5rem;
    font-weight: 600;
    user-select: none;

    &:hover {
        cursor: pointer;
    }
`;

const LoadingWrapper = styled.div`
    align-items: center;
    justify-content: center;
`;

export default function PendingView({ connector, error = false, setPendingError, tryActivation }) {
    const isMetamask = window?.ethereum?.isMetaMask;
    return (
        <PendingSection>
            <LoadingMessage error={error}>
                <LoadingWrapper>
                    {error ? (
                        <ErrorGroup>
                            <div>Error connecting.</div>
                            <ErrorButton
                                onClick={() => {
                                    setPendingError(false);
                                    connector && tryActivation(connector);
                                }}
                            >
                                <FormattedMessage
                                    id="crowdfund__connect_wallet__retry"
                                    defaultMessage="Retry"
                                />
                            </ErrorButton>
                        </ErrorGroup>
                    ) : (
                        <FormattedMessage
                            id="crowdfund__connect_wallet__connecting"
                            defaultMessage="Initializing..."
                        />
                    )}
                </LoadingWrapper>
            </LoadingMessage>
            {Object.keys(SUPPORTED_WALLETS).map(key => {
                const option = SUPPORTED_WALLETS[key];
                if (option.connector === connector) {
                    if (option.connector === injected) {
                        if (isMetamask && option.name !== 'MetaMask') {
                            return null;
                        }
                        if (!isMetamask && option.name === 'MetaMask') {
                            return null;
                        }
                    }
                    return (
                        <Option
                            id={`connect-${key}`}
                            key={key}
                            clickable={false}
                            color={option.color}
                            header={option.name}
                            subheader={option.description}
                            icon={option.iconName}
                        />
                    );
                }
                return null;
            })}
        </PendingSection>
    );
}
