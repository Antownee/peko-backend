const production = false;

let apiUrl = production ? "http://157.230.190.34/api" : "http://localhost:5000/api"
let fileUrl = production ? "http://157.230.190.34/api" : "http://localhost:5000"
let baseUrl = production ? "http://157.230.190.34/api" : "http://localhost:5000"

module.exports = {
    apiUrl, fileUrl, baseUrl
}
