const router = require('express').Router()
const { getBooks, getBook, addBook, deleteBook, changeBookFreeStatus } = require('../controllers/books');


router.get('/books', getBooks);
router.get('/books/:id', getBook);
router.post('/books', addBook);
router.delete('/books/:id', deleteBook);
router.patch('/books/:id', changeBookFreeStatus);


module.exports = router;
