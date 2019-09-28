import { loadingConstants } from '../constants/index';

export const loadingActions = {
    toggleLoad
};

function toggleLoad(message) {
    return { type: loadingConstants.SUCCESS, message };
}
