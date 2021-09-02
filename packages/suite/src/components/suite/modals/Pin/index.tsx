import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { H2, variables, Button } from '@trezor/components';
import {
    PinInput,
    Loading,
    Translation,
    Image,
    TrezorLink,
    Modal,
    ModalProps,
} from '@suite-components';
import TrezorConnect from '@onekeyhq/connect';
import { TrezorDevice } from '@suite-types';
import * as suiteActions from '@suite-actions/suiteActions';
import { URLS } from '@suite-constants';
import * as modalActions from '@suite-actions/modalActions';
import { useActions, useDeviceType } from '@suite-hooks';

import type { Props as ConnectedProps } from '..';

const { FONT_SIZE, SCREEN_SIZE } = variables;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;

    @media only screen and (max-width: ${SCREEN_SIZE.MD}) {
        flex-direction: column;
    }
`;

const Col = styled.div<{ noYPadding?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 348px;
    height: 100%;
    /* no vertical padding if the modal is used as inner modal (eg. inside Recovery) */
    padding: ${props => (props.noYPadding ? '0px 40px' : '30px 40px 30px 40px')};

    @media only screen and (max-width: ${SCREEN_SIZE.MD}) {
        align-self: center;
    }
`;

const GreyCol = styled(Col)`
    background: ${props => props.theme.BG_LIGHT_GREY};
    @media only screen and (max-width: ${SCREEN_SIZE.MD}) {
        display: none;
    }
`;

const Expand = styled.div`
    flex: 1;
`;

const How = styled.div`
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-size: ${FONT_SIZE.SMALL};
    text-align: center;
`;

const Text = styled(How)`
    margin-bottom: 14px;
`;

const StyledImg = styled(props => <Image {...props} />)`
    padding: 34px;
`;

const StyledButton = styled(Button)`
    margin: 24px 0;
`;

interface TextComponentProps {
    pinRequestType: string;
    invalid: boolean;
}

const PinHeading = ({ pinRequestType, invalid }: TextComponentProps) => {
    if (invalid) {
        return <Translation id="TR_WRONG_PIN_ENTERED" />;
    }
    switch (pinRequestType) {
        case 'PinMatrixRequestType_Current':
            return <Translation id="TR_ENTER_CURRENT_PIN" />;
        case 'PinMatrixRequestType_NewFirst':
            return <Translation id="TR_SET_UP_NEW_PIN" />;
        case 'PinMatrixRequestType_NewSecond':
            return <Translation id="TR_CONFIRM_PIN" />;
        default:
            return null;
    }
};

const PinDescription = ({ pinRequestType, invalid }: TextComponentProps) => {
    if (invalid) {
        return (
            <Text>
                <Translation id="TR_WRONG_PIN_ENTERED_DESCRIPTION" />
            </Text>
        );
    }
    switch (pinRequestType) {
        case 'PinMatrixRequestType_Current':
            return <Translation id="TR_ENTER_CURRENT_PIN" />;
        case 'PinMatrixRequestType_NewFirst':
        case 'PinMatrixRequestType_NewSecond':
            return (
                <>
                    <Text>
                        <Translation id="TR_SET_UP_STRONG_PIN_TO_PROTECT" />
                    </Text>
                    <Text>
                        <Translation id="TR_MAXIMUM_LENGTH_IS_9_DIGITS" />
                    </Text>
                </>
            );
        default:
            return null;
    }
};

const ExplanationCol = (props: { heading: React.ReactNode; description?: React.ReactNode }) => {
    const deviceType = useDeviceType();
    return (
        <GreyCol>
            <H2>{props.heading}</H2>
            {props.description && props.description}
            <Expand>
                <StyledImg image={`${deviceType}-set-up-pin-dialog`} />
            </Expand>
            <How>
                <Translation id="TR_HOW_PIN_WORKS" />{' '}
                <TrezorLink href={URLS.PIN_MANUAL_URL}>
                    <Translation id="TR_LEARN_MORE" />
                </TrezorLink>
            </How>
        </GreyCol>
    );
};

interface OwnProps extends ModalProps {
    device: TrezorDevice;
    cancelable?: boolean;
    noBackground?: boolean;
    onCancel: () => void;
    settings: ConnectedProps['settings'];
    changeUnlockPinMethod: ConnectedProps['changeUnlockPinMethod'];
}

type Props = OwnProps;

const Pin = ({
    settings,
    changeUnlockPinMethod,
    device,
    cancelable,
    noBackground,
    ...rest
}: Props) => {
    const [submitted, setSubmitted] = useState(false);
    const { onPinSubmit } = useActions({ onPinSubmit: modalActions.onPinSubmit });

    const pinRequestType = device.buttonRequests[device.buttonRequests.length - 1];
    const invalidCounter = device.buttonRequests.filter(r => r === 'ui-invalid_pin').length || 0;

    useEffect(() => {
        if (
            [
                'PinMatrixRequestType_NewFirst',
                'PinMatrixRequestType_NewSecond',
                'PinMatrixRequestType_Current',
            ].includes(pinRequestType)
        ) {
            setSubmitted(false);
        }
    }, [pinRequestType]);

    // 3 cases when we want to show left column
    const isExtended =
        ['PinMatrixRequestType_NewFirst', 'PinMatrixRequestType_NewSecond'].includes(
            pinRequestType,
        ) || invalidCounter > 0;

    const submit = useCallback(
        (pin: string) => {
            onPinSubmit(pin);
            setSubmitted(true);
        },
        [onPinSubmit],
    );

    const modeType = settings.unlockPin;

    useEffect(() => {
        if (!device.features) return;
        if (!isExtended && !submitted && modeType === 'device') {
            submit('@@ONEKEY_INPUT_PIN_IN_DEVICE');
        }
    }, [modeType, submit, isExtended, submitted, device.features]);

    if (!device.features) return null;

    const submitText = () => {
        switch (pinRequestType) {
            case 'PinMatrixRequestType_NewSecond':
                return 'TR_NEW_PIN_SECOND';
            case 'PinMatrixRequestType_NewFirst':
                return 'TR_NEW_PIN_FIRST';
            default:
                return 'TR_ENTER_PIN';
        }
    };

    if (!isExtended && modeType === 'device') {
        return (
            <Modal
                noPadding
                useFixedWidth={false}
                cancelable={cancelable}
                noBackground={noBackground}
                {...rest}
                data-test="@modal/pin-select"
            >
                <Wrapper>
                    <Col noYPadding={noBackground}>
                        <H2>
                            <Translation id="TR_DEVICE_SETTINGS_INPUT_ON_DEVICE" />
                        </H2>
                        <How>
                            <Translation id="TR_DEVICE_SETTINGS_INPUT_ON_DEVICE_DESC" />
                        </How>
                    </Col>
                </Wrapper>
            </Modal>
        );
    }

    if (submitted) {
        return <Loading />;
    }

    if (!isExtended && !modeType) {
        return (
            <Modal
                noPadding
                useFixedWidth={false}
                cancelable={cancelable}
                noBackground={noBackground}
                {...rest}
                data-test="@modal/pin-select"
            >
                <Wrapper>
                    <Col noYPadding={noBackground}>
                        <H2>
                            <Translation id="TR_DEVICE_SETTINGS_CHANGE_PIN_METHOD_TITLE" />
                        </H2>
                        <How>
                            <Translation id="TR_DEVICE_SETTINGS_CHANGE_PIN_METHOD_DESCRIPTION" />
                        </How>
                        <How>
                            <Translation id="TR_DEVICE_SETTINGS_CHANGE_PIN_METHOD_DESCRIPTION_2" />
                        </How>
                        <StyledButton
                            onClick={() => {
                                changeUnlockPinMethod('device');
                            }}
                            fullWidth
                            data-test="@pin/submit-button"
                        >
                            <Translation id="TR_DEVICE_SETTINGS_CHANGE_PIN_METHOD_DEVICE" />
                        </StyledButton>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => changeUnlockPinMethod('desktop')}
                            data-test="@pin/submit-button"
                        >
                            <Translation id="TR_DEVICE_SETTINGS_CHANGE_PIN_METHOD_DESKTOP" />
                        </Button>
                    </Col>
                </Wrapper>
            </Modal>
        );
    }

    // TODO: figure out responsive design
    return (
        <Modal
            noPadding
            useFixedWidth={false}
            cancelable={cancelable}
            noBackground={noBackground}
            {...rest}
            data-test="@modal/pin"
        >
            <Wrapper>
                {isExtended && (
                    <ExplanationCol
                        heading={
                            <PinHeading
                                pinRequestType={pinRequestType}
                                invalid={invalidCounter > 0}
                            />
                        }
                        description={
                            <PinDescription
                                pinRequestType={pinRequestType}
                                invalid={invalidCounter > 0}
                            />
                        }
                    />
                )}
                <Col noYPadding={noBackground}>
                    <H2>
                        <Translation
                            id={submitText()}
                            values={{
                                deviceLabel: device.label,
                            }}
                        />
                    </H2>
                    <How>
                        <Translation id="TR_THE_PIN_LAYOUT_IS_DISPLAYED" />
                    </How>
                    <PinInput onPinSubmit={submit} />
                </Col>
            </Wrapper>
        </Modal>
    );
};

export default Pin;
