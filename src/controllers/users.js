const Joi = require("joi");
const User = require('../models/user');
const Book = require('../models/book');


const addUserBody = Joi.object({
		name: Joi.string().required(),
		surname: Joi.string().required(),
		username: Joi.string().required()
	}).options({ allowUnknown: false });


const getUsers = async (request, response) => {
	try {
		await User.find().then((result) => {
				response.status(200);
				response.json(result);
			});
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const getUser = async (request, response) => {
	try {
		const { id } = request.params;

		const user = await User.findById(id);
		if (!user)
		{
			return response.status(404).json({ status: 'Пользователь не найден' });
		}

		response.status(200);
		response.json(user);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const addUser = async (request, response) => {
	try {
		const { error } = addUserBody.validate(request.body);
		if (error)
		{
			return response.status(400).json({ error: 'Невалидное тело запроса' });
		}

		const newUserName = request.body.name;
		if (newUserName.length < 2)
		{
			return response.status(401).json({ error: 'Имя слишком маленькое (должно быть не меньше 2 символов)' });
		}

		const newUserSurname = request.body.surname;
		if (newUserSurname.length < 2)
		{
			return response.status(401).json({ error: 'Фамилия слишком маленькая (должно быть не меньше 2 символов)' });
		}

		const newUserUsername = request.body.username;
		if (newUserUsername.length < 5)
		{
			return response.status(401).json({ error: 'Никнейм слишком маленький (должно быть не меньше 5 символов)' });
		}

		const user = new User({ name: newUserName, surname: newUserSurname, username: newUserUsername });
		await user.save().then((result) => {
				response.status(201).json({ status: 'New user: ' + newUserName + ' ' + newUserSurname + ' (' + newUserUsername + ')' });
			});
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const deleteUser = async (request, response) => {
	try {
		const { id } = request.params;

		await User.findByIdAndDelete(id).then((result) => {
				response.status(204).json({ status: 'Пользователь удалён' });
			});
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const getUserBooks = async (request, response) => {
	try {
		const { id } = request.params;

		const user = await User.findById(id).populate('books');
		response.json(user.books);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const addBookToUser = async (request, response) => {
	try {
		const { userId, bookId } = request.params;

		const user = await User.findById(userId);
		const book = await Book.findById(bookId);

		if (!user || !book) {
			return response.status(404).json({ error: 'Пользователь или книга не найдены' });
		}

		if (book.isFree == false) {
			return response.status(400).json({ error: 'Книга занята' });
		}

		user.books.push(book);
		book.isFree = false;

		await user.save();
		await book.save();

		response.status(201).json({ status: 'Книга была добавлена в список книг пользователя' });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const removeBookFromUser = async (request, response) => {
	try {
		const { userId, bookId } = request.params;

		const user = await User.findById(userId);
		const book = await Book.findById(bookId);

		if (!user || !book) {
			return res.status(404).json({ error: 'Пользователь или книга не найдены' });
		}

		const bookIndex = user.books.indexOf(bookId);
		if (bookIndex === (-1)) {
			return response.status(400).json({ error: 'Книга не найдена у пользователя' });
		}

		user.books.splice(bookIndex, 1);
		book.isFree = true;

		await user.save();
		await book.save();

		response.status(201).json({ status: 'Книга была убрана из списка книг пользователя и освобождена' });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}


module.exports = {
	getUsers,
	getUser,
	getUserBooks,
	addUser,
	deleteUser,
	addBookToUser,
	removeBookFromUser
};
