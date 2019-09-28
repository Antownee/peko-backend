import { userConstants } from '../constants';

export function registration(state = {}, action) {
  switch (action.type) {
    case userConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.REGISTER_FAILURE:
      return {
        loggedIn: false,
        error: action.error
      };
    default:
      return state
  }
}