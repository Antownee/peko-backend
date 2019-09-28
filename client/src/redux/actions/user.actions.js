import { userConstants } from '../constants';
import { userService } from '../services';
import { history } from '../helpers';
import { toast } from "react-toastify";

export const userActions = {
    login,
    logout,
    register,
    getAll,
    delete: _delete
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    dispatch(success(user)); //Successful login
                    if (user.role === "User") {
                        return history.push('/user/dashboard');
                    }
                    return history.push('/admin/dashboard');
                },
                error => {
                    dispatch(failure(error.toString())); //Failed login
                    let err = error.message === "Failed to fetch" ? "Try logging in again later." : error.toString();
                    toast.error(err);
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => {
                    dispatch(success(user)); //dispatch successful registration
                    dispatch(successLogin(user))//dispatch successful logging in as well

                    if (user.role === "User") {
                        return history.push('/user/dashboard');
                    }
                    return history.push('/admin/dashboard');
                },
                error => {
                    dispatch(failure(error.toString())); //Failed registration
                    let err = error.message === "Failed to fetch" ? "Try logging in again later." : error.toString();
                    toast.error(err);
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function successLogin(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => {
                    dispatch(success(users));
                },
                error => {
                    dispatch(failure(error.toString()));
                    toast.error(error.toString());
                }
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}