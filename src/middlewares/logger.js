const logger = (request, response, next) => {
	console.log('Новый запрос:', request.originalUrl);

	next();
};


module.exports = logger;
