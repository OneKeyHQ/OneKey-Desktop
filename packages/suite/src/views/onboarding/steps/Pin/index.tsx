import React, { ComponentProps } from 'react';
import { UI } from '@onekeyhq/connect';

import { Translation, Image } from '@suite-components';
import { Text, OnboardingButton, Wrapper } from '@onboarding-components';
import { Props } from './Container';
import { useDeviceType } from '@suite/hooks/suite';

const SetPinStep = (props: Props) => {
    const { device } = props;
    const deviceType = useDeviceType();
    if (!device || !device.features) {
        return null;
    }

    const getStatus = () => {
        if (device.buttonRequests.filter(b => b === UI.REQUEST_PIN).length === 1) {
            return 'first';
        }
        if (device.buttonRequests.filter(b => b === UI.REQUEST_PIN).length === 2) {
            return 'second';
        }
        if (device && device.features.pin_protection) {
            return 'success';
        }
        if (device && !device.features.pin_protection) {
            return 'initial';
        }

        // todo: what if device disconnects?
        return null;
    };

    return (
        <Wrapper.Step data-test="@onboarding/pin">
            <Wrapper.StepHeading>
                {getStatus() === 'initial' && <Translation id="TR_PIN_HEADING_INITIAL" />}
                {getStatus() === 'first' && <Translation id="TR_PIN_HEADING_FIRST" />}
                {getStatus() === 'second' && <Translation id="TR_PIN_HEADING_REPEAT" />}
                {getStatus() === 'success' && <Translation id="TR_PIN_HEADING_SUCCESS" />}
            </Wrapper.StepHeading>
            <Wrapper.StepBody>
                {getStatus() === 'initial' && (
                    <>
                        <Text>
                            <Translation id="TR_PIN_SUBHEADING" />
                        </Text>

                        <Image
                            image={
                                `${deviceType}-pin-ask-1` as ComponentProps<typeof Image>['image']
                            }
                        />
                        <Wrapper.Controls>
                            <OnboardingButton.Cta
                                data-test="@onboarding/set-pin-button"
                                onClick={() => {
                                    props.changePin();
                                }}
                            >
                                <Translation id="TR_SET_PIN" />
                            </OnboardingButton.Cta>
                        </Wrapper.Controls>
                    </>
                )}

                {getStatus() === 'success' && (
                    <>
                        <Text>
                            <Translation id="TR_PIN_SET_SUCCESS" />
                        </Text>
                        <Image
                            image={
                                `${deviceType}-pin-success-1` as ComponentProps<
                                    typeof Image
                                >['image']
                            }
                        />
                        <Wrapper.Controls>
                            <OnboardingButton.Cta
                                data-test="@onboarding/pin/continue-button"
                                onClick={() => props.goToNextStep()}
                            >
                                <Translation id="TR_COMPLETE_SETUP" />
                            </OnboardingButton.Cta>
                        </Wrapper.Controls>
                    </>
                )}
            </Wrapper.StepBody>
            <Wrapper.StepFooter>
                {getStatus() !== 'success' && (
                    <OnboardingButton.Back
                        data-test="@onboarding/skip-button"
                        icon="CROSS"
                        onClick={() => props.goToNextStep()}
                    >
                        <Translation id="TR_SKIP" />
                    </OnboardingButton.Back>
                )}
            </Wrapper.StepFooter>
        </Wrapper.Step>
    );
};

export default SetPinStep;
