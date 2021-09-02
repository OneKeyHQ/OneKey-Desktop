import React from 'react';
import { Translation } from '@suite-components';
import { Wrapper, Text, OnboardingButton, Option } from '@onboarding-components';
import { useDeviceType } from '@suite-hooks';
import { Props } from './Container';

const SelectDeviceStep = ({ onboardingActions }: Props) => {
    const deviceType = useDeviceType();

    const titleTranslationId = () => {
        if (deviceType === 'mini') return 'TR_MINI_TITLE';
        return 'TR_MODEL_ONE';
    };

    const descTranslationId = () => {
        if (deviceType === 'mini') return 'TR_MINI_DESCRIPTION';
        return 'TR_MODEL_ONE_DESC';
    };

    return (
        <Wrapper.Step>
            <Wrapper.StepHeading>
                <Translation id="TR_SELECT_YOUR_DEVICE_HEADING" />
            </Wrapper.StepHeading>
            <Wrapper.StepBody>
                <Text>
                    <Translation id="TR_MODELS_DESC" />
                </Text>
                <Wrapper.Options>
                    <Option
                        data-test="@onboarding/option-model-one-path"
                        action={() => {
                            onboardingActions.selectTrezorModel(1);
                            onboardingActions.goToNextStep();
                        }}
                        title={<Translation id={titleTranslationId()} />}
                        text={<Translation id={descTranslationId()} />}
                        button={
                            <Translation
                                id="TR_SELECT_MODEL"
                                values={{ model: <Translation id={titleTranslationId()} /> }}
                            />
                        }
                        imgSrc={`images/svg/${deviceType}-model-1.svg`}
                    />
                </Wrapper.Options>
            </Wrapper.StepBody>
            <Wrapper.StepFooter>
                <Wrapper.Controls>
                    <OnboardingButton.Back
                        onClick={() => {
                            onboardingActions.goToPreviousStep();
                        }}
                    >
                        <Translation id="TR_BACK" />
                    </OnboardingButton.Back>
                </Wrapper.Controls>
            </Wrapper.StepFooter>
        </Wrapper.Step>
    );
};

export default SelectDeviceStep;
