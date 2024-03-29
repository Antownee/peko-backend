import { authHeader } from '../helpers';
import { apiUrl } from "../../config";

export const orderService = {
    addOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    addTeaAssets,
    addEmailAssets,
    populateDashboard,
    getTeaAssets,
    addShipment,
    updateShipment,
    getShipmentsByOrderID,
    deleteShipment, 
    populateAssetPage
};


function addOrder(orderRequestID, userID, teaOrders ) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderRequestID, userID, teaOrders } )
    };

    return fetch(`${apiUrl}/users/order`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}

function updateOrder(orderParams) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(orderParams)
    };

    return fetch(`${apiUrl}/admin/order/update`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}



function getAllOrders(user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    if (user.role === "Admin") {
        return fetch(`${apiUrl}/admin/order/all`, requestOptions)
            .then(handleResponse)
            .then(msg => { return msg })
    } else {
        return fetch(`${apiUrl}/users/order/all`, requestOptions)
            .then(handleResponse)
            .then(msg => { return msg })
    }
}

function deleteOrder(orderRequestID) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderRequestID })
    };

    return fetch(`${apiUrl}/admin/order/delete`, requestOptions)
        .then(handleResponse)
        .then((msg) => { return msg })
}

function addTeaAssets(tea) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(tea)
    };

    return fetch(`${apiUrl}/admin/asset/tea`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}

//For the Place Order page
function getTeaAssets() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${apiUrl}/users/asset/alltea`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}

function addEmailAssets(email) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(email)
    };

    return fetch(`${apiUrl}/admin/asset/email`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}

function populateDashboard(user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: user.userID })
    };

    if (user.role === "Admin") {
        return fetch(`${apiUrl}/admin/asset/dashboard`, requestOptions)
            .then(handleResponse)
            .then(msg => { return msg })
    } else {
        return fetch(`${apiUrl}/users/asset/dashboard`, requestOptions)
            .then(handleResponse)
            .then(msg => { return msg })
    }
}


function populateAssetPage() {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' }
    };

    return fetch(`${apiUrl}/admin/asset/populate`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function addShipment(shipment) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(shipment)
    };

    return fetch(`${apiUrl}/admin/shipment`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}


function updateShipment(shipment) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(shipment)
    };

    return fetch(`${apiUrl}/admin/shipment/update`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
}


function getShipmentsByOrderID(orderID, role) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID })
    };

    return role === "Admin" ?
        fetch(`${apiUrl}/admin/shipment/all`, requestOptions)
            .then(handleResponse)
            .then(msg => { return msg }) :
        fetch(`${apiUrl}/users/shipment/all`, requestOptions)
            .then(handleResponse)
            .then(msg => { return msg })
}

function deleteShipment(shipmentID) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentID })
    };

    return fetch(`${apiUrl}/admin/shipment/delete`, requestOptions)
        .then(handleResponse)
        .then((msg) => { return msg })
}


function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}