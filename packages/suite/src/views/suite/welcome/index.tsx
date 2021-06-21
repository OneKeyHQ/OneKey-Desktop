import React, { FC } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, H2, P } from '@trezor/components';
import * as routerActions from '@suite-actions/routerActions';
import * as languageActions from '@settings-actions/languageActions';
import { Translation, Image, Modal } from '@suite-components';
import { useActions } from '@suite-hooks';
import { LANGUAGES } from '@suite-config';
import { AppState, Dispatch } from '@suite-types';
import { ActionSelect } from '@suite-components/Settings';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const StyledImg = styled(props => <Image {...props} />)`
    margin-top: 20px;
`;

const LanguageContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 20px;
`;

const LanguageLabel = styled.div`
    margin-right: 12px;
`;

const mapStateToProps = (state: AppState) => ({
    language: state.suite.settings.language,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            fetchLocale: languageActions.fetchLocale,
        },
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Index: FC<Props> = ({ language, fetchLocale }) => {
    const { goto } = useActions({ goto: routerActions.goto });
    return (
        <Modal useFixedHeight data-test="@welcome">
            <Wrapper>
                <H2>
                    <Translation id="TR_WELCOME_MODAL_HEADING" />
                </H2>
                <P size="small">
                    <Translation id="TR_WELCOME_MODAL_TEXT" />
                </P>
                <StyledImg image="WELCOME" />
                <LanguageContainer>
                    <LanguageLabel>语言 / language</LanguageLabel>
                    <ActionSelect
                        variant="small"
                        hideTextCursor
                        useKeyPressScroll
                        noTopLabel
                        value={{
                            value: language,
                            label: LANGUAGES.find(l => l.code === language)!.name,
                        }}
                        // isDisabled
                        options={LANGUAGES.map(l => ({ value: l.code, label: l.name }))}
                        onChange={(option: {
                            value: typeof LANGUAGES[number]['code'];
                            label: typeof LANGUAGES[number]['name'];
                        }) => {
                            fetchLocale(option.value);
                        }}
                        data-test="@settings/language-select"
                    />
                </LanguageContainer>
                <Button
                    data-test="@welcome/continue-button"
                    onClick={() => goto('onboarding-index')}
                >
                    <Translation id="TR_BEGIN" />
                </Button>
            </Wrapper>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);
