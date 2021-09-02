import React from 'react';
import { ConfirmOnDevice } from './index';
import { storiesOf } from '@storybook/react';
import { StoryColumn } from '../../../support/Story';

storiesOf('Prompts', module).add(
    'Confirm On Device',
    () => {
        return (
            <>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="Confirm on Trezor T1"
                        deviceType="classic"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="Confirm with cancel"
                        onCancel={() => {}}
                        deviceType="classic"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="Confirm on Trezor T2"
                        deviceType="mini"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="With 3 steps no active"
                        steps={3}
                        deviceType="mini"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="With 2 steps no active"
                        steps={2}
                        deviceType="mini"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="With 5 steps - active 4"
                        steps={5}
                        activeStep={4}
                        deviceType="mini"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="With 3 steps - active 1"
                        steps={3}
                        activeStep={1}
                        deviceType="mini"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="confirmed"
                        title="5 steps 3 active cancel"
                        steps={5}
                        activeStep={3}
                        onCancel={() => {}}
                        deviceType="mini"
                    />
                </StoryColumn>
                <StoryColumn minWidth={300}>
                    <ConfirmOnDevice
                        successText="Confirmed"
                        title="Confirm on Trezor"
                        steps={5}
                        activeStep={5}
                        onCancel={() => {}}
                        deviceType="mini"
                    />
                </StoryColumn>
            </>
        );
    },
    {
        options: {
            showPanel: false,
        },
    }
);
