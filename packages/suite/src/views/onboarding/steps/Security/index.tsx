import React, { ComponentProps } from 'react';
import styled from 'styled-components';

import { Translation, Image } from '@suite-components';
import { OnboardingButton, Text, Wrapper } from '@onboarding-components';

import { Props } from './Container';
import { useDeviceType } from '@suite-hooks';

const StyledImage = styled(Image)`
    height: 250px;
    margin-bottom: auto;
`;

const SecurityStep = (props: Props) => {
    const deviceType = useDeviceType();
    return (
        <Wrapper.Step>
            <Wrapper.StepHeading>
                <Translation id="TR_SECURITY_HEADING" />
            </Wrapper.StepHeading>
            <Wrapper.StepBody>
                <Text>
                    <Translation id="TR_SECURITY_SUBHEADING" />
                </Text>
                <StyledImage
                    image={
                        `${deviceType}-device-initialized-1` as ComponentProps<
                            typeof Image
                        >['image']
                    }
                />
                <Wrapper.Controls>
                    <OnboardingButton.Cta
                        data-test="@onboarding/continue-to-security-button"
                        onClick={() => {
                            props.goToNextStep();
                        }}
                    >
                        <Translation id="TR_GO_TO_SECURITY" />
                    </OnboardingButton.Cta>
                </Wrapper.Controls>
                <Text>
                    <Translation id="TR_ONLY_2_MORE_STEPS" />
                </Text>
            </Wrapper.StepBody>
            <Wrapper.StepFooter>
                <OnboardingButton.Back
                    icon="CROSS"
                    data-test="@onboarding/exit-app-button"
                    onClick={() => props.closeModalApp()}
                >
                    <Translation id="TR_SKIP_SECURITY" />
                </OnboardingButton.Back>
            </Wrapper.StepFooter>
        </Wrapper.Step>
    );
};
export default SecurityStep;
