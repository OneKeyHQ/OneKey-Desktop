import React from 'react';
import { Option, Wrapper } from '@onboarding-components';
import { Translation } from '@suite-components';
import { useDeviceType } from '@suite/hooks/suite';

interface Props {
    onSelect: (number: boolean) => void;
}

const SelectRecoveryType = ({ onSelect }: Props) => {
    const deviceType = useDeviceType();
    return (
        <>
            <Wrapper.Options>
                <Option
                    action={() => {
                        onSelect(false);
                    }}
                    title={<Translation id="TR_BASIC_RECOVERY" />}
                    text={<Translation id="TR_BASIC_RECOVERY_OPTION" />}
                    button={<Translation id="TR_BASIC_RECOVERY" />}
                    imgSrc="images/svg/recovery-basic.svg"
                    data-test="@recover/select-type/basic"
                />

                <Option
                    action={() => {
                        onSelect(true);
                    }}
                    title={<Translation id="TR_ADVANCED_RECOVERY" />}
                    text={<Translation id="TR_ADVANCED_RECOVERY_OPTION" />}
                    button={<Translation id="TR_ADVANCED_RECOVERY" />}
                    imgSrc={`images/svg/${deviceType}-recovery-advanced.svg`}
                    data-test="@recover/select-type/advanced"
                />
            </Wrapper.Options>
        </>
    );
};

export default SelectRecoveryType;
