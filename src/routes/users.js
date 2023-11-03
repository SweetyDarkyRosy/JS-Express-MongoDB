const router = require('express').Router()
const { getUsers, getUser, getUserBooks, addUser, deleteUser, addBookToUser, removeBookFromUser } = require('../controllers/users');


router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.get('/users/:id/books', getUserBooks);
router.post('/users', addUser);
router.post('/users/:userId/books/:bookId', addBookToUser);
router.delete('/users/:id', deleteUser);
router.delete('/users/:userId/books/:bookId', removeBookFromUser);


module.exports = router;
