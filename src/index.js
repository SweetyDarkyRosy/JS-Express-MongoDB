const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cors = require('./middlewares/cors');
const logger = require('./middlewares/logger')
const userRouter = require('./routes/users')
const bookRouter = require('./routes/books')


const {
	API_URL = "http://127.0.0.1",
	PORT = 3005
} = process.env;

dotenv.config();

const app = express();

app.use(cors);
app.use(logger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRouter);
app.use(bookRouter);

app.get('/', (request, response) => {
	response.status(200);
	response.send('Database is online!');
})


try {
	mongoose.connect('mongodb://127.0.0.1:27017/database').then(() => {
			console.log('Успешное подключение к базе данных')
		});
} catch (error) {
	handleError(error);
}

app.listen(PORT, () => {
	console.log("Server is working at " + API_URL + ":" + PORT);
});
