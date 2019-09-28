import { orderConstants } from '../constants';
import { orderService } from '../services';
import { alertActions } from '.';
import { history } from '../helpers';

export const orderActions = {
    addOrder
};


function addOrder(order) {
    return dispatch => {
        dispatch(request(order));

        orderService.addOrder(order)
            .then(
                order => { 
                    dispatch(success());
                    history.push('/user/place-order');
                    dispatch(alertActions.success('Order successfuly added'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(order) { return { type: orderConstants.ADD_REQUEST, order } }
    function success(order) { return { type: orderConstants.ADD_SUCCESS, order } }
    function failure(error) { return { type: orderConstants.ADD_FAILURE, error } }
}
