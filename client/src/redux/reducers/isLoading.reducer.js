import { loadingConstants } from '../constants';

export function loadState(state = {}, action) {
  switch (action.type) {
    case loadingConstants.SUCCESS:
      return { isLoading: action.message };
    case loadingConstants.ERROR:
      return {
        type: 'load-danger',
        message: action.message
      };
    case loadingConstants.CLEAR:
      return {};
    default:
      return state
  }
}