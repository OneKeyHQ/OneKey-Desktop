import { combineReducers } from 'redux';
import FavoriteReducer from './FavoriteReducer';
import SelectedAccount from './SelectedAccount';

const ExploreReducers = combineReducers({
    favorite: FavoriteReducer,
    selectedAccount: SelectedAccount,
});

export default ExploreReducers;
