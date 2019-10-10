import { authHeader } from '../helpers';
import { apiUrl } from "../../config";

export const orderService = {
    addOrder,
    deleteOrder,
    getAllOrders,
    confirmOrder,
    uploadDocuments,
    addTeaAssets,
    addEmailAssets,
    populateDashboard,
    getTeaAssets,
    shipOrder,
    addShipment,
    getShipmentsByOrderID,
};


function addOrder(order, user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, user })
    };

    return fetch(`${apiUrl}/users/order`, requestOptions)
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

function deleteOrder(order) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ order })
    };

    return fetch(`${apiUrl}/admin/order/delete`, requestOptions)
        .then(handleResponse)
        .then((msg) => { return msg })
}

function confirmOrder(order, user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, user })
    };

    return fetch(`${apiUrl}/admin/order/confirm`, requestOptions)
        .then(handleResponse)
        .then((msg) => { return msg })
}

function shipOrder(order, user) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ order, user })
    };

    return fetch(`${apiUrl}/admin/order/ship`, requestOptions)
        .then(handleResponse)
        .then((msg) => { return msg })
}

function uploadDocuments(documents, orderid) {
    const formData = new FormData();
    formData.append('orderID', orderid);
    for (var x = 0; x < documents.length; x++) {
        formData.append('file', documents[x].document, orderid + "_" + documents[x].id)
    }

    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader() },
        body: formData
    };

    return fetch(`${apiUrl}/admin/order/documents`, requestOptions)
        .then(handleResponse)
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
        body: JSON.stringify(user)
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


function getShipmentsByOrderID(orderID) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(orderID)
    };

    return fetch(`${apiUrl}/admin/shipment/all`, requestOptions)
        .then(handleResponse)
        .then(msg => { return msg })
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