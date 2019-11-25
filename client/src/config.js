const production = true;

let apiUrl = production ? "http://167.99.100.167/api" : "http://localhost:5000/api"
let fileUrl = production ? "http://167.99.100.167" : "http://localhost:5000"
let baseUrl = production ? "http://167.99.100.167" : "http://localhost:5000"

module.exports = {
    apiUrl, fileUrl, baseUrl
}
