import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as routerActions from '@suite-actions/routerActions';
import * as modalActions from '@suite-actions/modalActions';
import {
    applySettings,
    changePin,
    changeUnlockPinMethod,
    changeShowPassphraseSwitch,
} from '@settings-actions/deviceSettingsActions';

import { AppState, Dispatch } from '@suite-types';

import DeviceSettings from './index';

const mapStateToProps = (state: AppState) => ({
    language: state.suite.settings.language,
    device: state.suite.device,
    unlockPin: state.suite.settings.unlockPin,
    passphraseShowSwitch: state.suite.settings.passphraseShowSwitch,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
    bindActionCreators(
        {
            applySettings,
            changePin,
            goto: routerActions.goto,
            openModal: modalActions.openModal,
            changeUnlockPinMethod,
            changeShowPassphraseSwitch,
        },
        dispatch,
    );

export type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSettings);
