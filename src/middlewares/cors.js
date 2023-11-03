const cors = (request, response, next) => {
	response.header('Access-Control-Allow-Origin', 'http://localhost');
	response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	response.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, DELETE');

	next();
}


module.exports = cors;
