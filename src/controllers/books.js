const Joi = require("joi");
const Book = require('../models/book');
const User = require('../models/user');


const addBookBody = Joi.object({
	title: Joi.string().required(),
	author: Joi.string().required(),
	releaseYear: Joi.number().required()
}).options({ allowUnknown: false });


const getBooks = async (request, response) => {
	try {
		await Book.find().then((result) => {
				response.status(200);
				response.json(result);
			});
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const getBook = async (request, response) => {
	try {
		const { id } = request.params;

		const book = await Book.findById(id);
		if (!book)
		{
			return response.status(404).json({ error: 'Книга не найдена' });
		}

		response.status(200);
		response.json(book);
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const addBook = async (request, response) => {
	try {
		const { error } = addBookBody.validate(request.body);
		if (error)
		{
			return response.status(400).json({ error: 'Невалидное тело запроса' });
		}

		const newBookTitle = request.body.title;
		if (newBookTitle.length < 2)
		{
			return response.status(401).json({ error: 'Наименование книги слишком маленькое (должно быть не меньше 2 символов)' });
		}

		const newBookAuthorName = request.body.author;
		if (newBookAuthorName.length < 2)
		{
			return response.status(401).json({ error: 'Полное имя автора слишком маленькое (должно быть не меньше 2 символов)' });
		}

		const newBookReleaseYear = request.body.releaseYear;

		const book = new Book({ title: newBookTitle, author: newBookAuthorName, releaseYear: newBookReleaseYear });
		await book.save().then((result) => {
				response.status(201).json({ status: 'New book: "' + newBookTitle + '" (' + newBookAuthorName + ', ' + newBookReleaseYear + ')' });
			});
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const deleteBook = async (request, response) => {
	try {
		const { id } = request.params;

		const book = await Book.findById(id);
		if (!book)
		{
			return response.status(404).json({ error: 'Книга не найдена' });
		}

		const users = await User.find({ books: id });
		users.forEach(async (user) => {
				user.books = user.books.filter((book) => book.toString() !== id);
				await user.save();
			});

		await Book.findByIdAndDelete(id).then((result) => {
				response.status(204).json({ status: 'Книга удалена' });
			});
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}

const changeBookFreeStatus = async (request, response) => {
	try {
		const { id } = request.params;

		const book = await Book.findById(id);
		if (!book)
		{
			return response.status(404).json({ error: 'Книга не найдена' });
		}

		book.isFree = !book.isFree;
		await book.save();

		response.status(200).json({ status: 'Состояние книги было изменено' });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
}


module.exports = {
	getBooks,
	getBook,
	addBook,
	deleteBook,
	changeBookFreeStatus
};
