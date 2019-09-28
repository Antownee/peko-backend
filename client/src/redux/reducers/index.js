import { combineReducers } from 'redux';
import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { loadState } from './isLoading.reducer';
import { languageSwitch } from './languageSwitch.reducer';
import { users } from './users.reducer'

const rootReducer = combineReducers({
  authentication,
  userRegistration: registration,
  loadState,
  currentLanguage: languageSwitch,
  userLogin: users
});

export default rootReducer;