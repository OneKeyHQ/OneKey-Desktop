import { combineReducers } from 'redux';

import deviceReducer from './device';
import payloadReducer from './payload';
import activeReducer from './active';

export default combineReducers({
    device: deviceReducer,
    payload: payloadReducer,
    active: activeReducer,
});
